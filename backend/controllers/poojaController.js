import PoojaModel from '../models/poojaModel.js';
import cloudinary from '../config/cloudinary.js';

// All poojas (filtered by temple if templeId is provided)
const allPoojas = async (req, res) => {
  try {
    const { templeId } = req.query;
    let query = {};
    
    if (templeId) {
      // Find poojas where temple equals templeId (legacy) 
      // OR temples array contains an entry with templeId and isActive is true
      query = {
        $or: [
          { temple: templeId },
          { temples: { $elemMatch: { templeId: templeId, isActive: true } } }
        ]
      };
    }

    const poojasData = await PoojaModel.find(query).populate('temple', 'name location').populate('temples.templeId', 'name location');
    
    // Transform data to ensure the correct price and temple info is returned for the user-side
    const poojas = poojasData.map(pooja => {
      const poojaObj = pooja.toObject();
      
      if (templeId) {
        // Find custom config for this temple
        const templeConfig = poojaObj.temples?.find(t => t.templeId?._id?.toString() === templeId || t.templeId?.toString() === templeId);
        if (templeConfig) {
          poojaObj.price = templeConfig.price || poojaObj.price;
        }
      }
      
      return poojaObj;
    });

    res.json({ success: true, poojas });
  } catch (error) {
    res.json({ success: false, message: 'Error fetching poojas', error: error.message });
  }
};

// Add a new pooja
const addPooja = async (req, res) => {
  try {
    const { name, description, price, temple, temples } = req.body;
    const file = req.file;

    if (!file) {
      return res.json({ success: false, message: 'No image uploaded' });
    }

    // Process temples array if it's sent as a stringified JSON
    let processedTemples = [];
    if (temples) {
      try {
        processedTemples = typeof temples === 'string' ? JSON.parse(temples) : temples;
      } catch (e) {
        console.error("Error parsing temples JSON:", e);
      }
    }

    // For legacy support if temples is empty but temple is provided
    if (processedTemples.length === 0 && temple) {
      processedTemples.push({ templeId: temple, price: price, isActive: true });
    }

    // Upload image directamente from buffer
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'pooja_images', use_filename: true, unique_filename: false },
      async (error, uploadResult) => {
        if (error) {
          return res.json({ success: false, message: 'Cloudinary upload error', error: error.message });
        }

        const newPooja = new PoojaModel({
          name,
          description,
          price: price || 0,
          image: uploadResult.secure_url,
          temples: processedTemples,
          temple: temple || (processedTemples.length > 0 ? processedTemples[0].templeId : null) // Backward Compat
        });

        await newPooja.save();
        res.json({ success: true, message: 'Pooja added successfully', pooja: newPooja });
      }
    );

    result.end(file.buffer);
  } catch (error) {
    console.error("Add Pooja Error:", error);
    res.json({ success: false, message: 'Error adding pooja', error: error.message });
  }
};

// Remove a pooja
const removePooja = async (req, res) => {
  try {
    const { id } = req.params;
    const pooja = await PoojaModel.findById(id);
    if (!pooja) {
      return res.status(404).json({ success: false, message: 'Pooja not found' });
    }

    if (pooja.image) {
      const imageUrl = pooja.image;
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`pooja_images/${publicId}`);
    }

    await PoojaModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Pooja removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing pooja', error: error.message });
  }
};

// Update a pooja
const updatePooja = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, temple, temples, ...otherUpdates } = req.body;

    const pooja = await PoojaModel.findById(id);
    if (!pooja) {
      return res.status(404).json({ success: false, message: 'Pooja not found' });
    }

    let updates = { name, description, price, temple, ...otherUpdates };

    // Process temples array if it's sent as a stringified JSON
    if (temples) {
      try {
        updates.temples = typeof temples === 'string' ? JSON.parse(temples) : temples;
      } catch (e) {
        console.error("Error parsing temples JSON:", e);
      }
    }

    if (req.file) {
      if (pooja.image) {
        const oldPublicId = pooja.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`pooja_images/${oldPublicId}`);
      }

      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'pooja_images' },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          stream.end(req.file.buffer);
        });

      const result = await streamUpload();
      updates.image = result.secure_url;
    }

    const updatedPooja = await PoojaModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: 'Pooja updated successfully', pooja: updatedPooja });
  } catch (error) {
    console.error('Update Error:', error);
    res.status(500).json({ success: false, message: 'Error updating pooja', error: error.message });
  }
};

// Get a single pooja by ID
const getPoojaById = async (req, res) => {
  try {
    const { id } = req.params;
    const pooja = await PoojaModel.findById(id).populate('temple', 'name location').populate('temples.templeId', 'name location');
    if (!pooja) {
      return res.status(404).json({ success: false, message: 'Pooja not found' });
    }
    res.status(200).json({ success: true, pooja });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching pooja', error: error.message });
  }
};

// Update availability (unavailable dates) for a pooja at a specific temple
const updatePoojaAvailability = async (req, res) => {
  try {
    const { poojaId, templeId, unavailableDates } = req.body;

    const pooja = await PoojaModel.findById(poojaId);
    if (!pooja) {
      return res.status(404).json({ success: false, message: 'Pooja not found' });
    }

    const templeConfig = pooja.temples.find(t => t.templeId.toString() === templeId);
    if (!templeConfig) {
      return res.status(404).json({ success: false, message: 'Temple not assigned to this pooja' });
    }

    templeConfig.unavailableDates = unavailableDates;
    await pooja.save();

    res.status(200).json({ success: true, message: 'Availability updated successfully' });
  } catch (error) {
    console.error('Availability Update Error:', error);
    res.status(500).json({ success: false, message: 'Error updating availability', error: error.message });
  }
};

// Bulk update availability for multiple poojas and temples
const bulkUpdatePoojaAvailability = async (req, res) => {
  try {
    const { poojaIds, templeIds, date, action } = req.body;

    if (!poojaIds || !templeIds || !date || !action) {
      return res.status(400).json({ success: false, message: "Missing required fields (poojaIds, templeIds, date, action)" });
    }

    const poojas = await PoojaModel.find({ _id: { $in: poojaIds } });

    for (const pooja of poojas) {
      let modified = false;
      for (const templeId of templeIds) {
        const templeConfig = pooja.temples.find(t => (t.templeId?._id || t.templeId).toString() === templeId);
        if (templeConfig) {
          if (action === 'add') {
            if (!templeConfig.unavailableDates.includes(date)) {
              templeConfig.unavailableDates.push(date);
              modified = true;
            }
          } else if (action === 'remove') {
            const initialLength = templeConfig.unavailableDates.length;
            templeConfig.unavailableDates = templeConfig.unavailableDates.filter(d => d !== date);
            if (templeConfig.unavailableDates.length !== initialLength) {
              modified = true;
            }
          }
        }
      }
      if (modified) {
        await pooja.save();
      }
    }

    res.status(200).json({ success: true, message: 'Bulk availability updated successfully' });
  } catch (error) {
    console.error('Bulk Availability Update Error:', error);
    res.status(500).json({ success: false, message: 'Error updating bulk availability', error: error.message });
  }
};

export { allPoojas, addPooja, removePooja, updatePooja, getPoojaById, updatePoojaAvailability, bulkUpdatePoojaAvailability };
