import PoojaModel from '../models/poojaModel.js';
import cloudinary from '../config/cloudinary.js';

// All poojas (filtered by temple if templeId is provided)
const allPoojas = async (req, res) => {
  try {
    const { templeId } = req.query;
    let query = {};
    if (templeId) {
      query.temple = templeId;
    }
    const poojas = await PoojaModel.find(query).populate('temple', 'name location');
    res.json({ success: true, poojas });
  } catch (error) {
    res.json({ success: false, message: 'Error fetching poojas', error: error.message });
  }
};

// Add a new pooja
const addPooja = async (req, res) => {
  try {
    const { name, description, price, temple } = req.body;
    const file = req.file;

    if (!file) {
      return res.json({ success: false, message: 'No image uploaded' });
    }

    if (!temple) {
      return res.status(400).json({ success: false, message: 'Temple ID is required' });
    }

    // Upload image directly from buffer
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'pooja_images', use_filename: true, unique_filename: false },
      async (error, uploadResult) => {
        if (error) {
          return res.json({ success: false, message: 'Cloudinary upload error', error: error.message });
        }

        const newPooja = new PoojaModel({
          name,
          description,
          price,
          image: uploadResult.secure_url,
          temple
        });

        await newPooja.save();
        res.json({ success: true, message: 'Pooja added successfully', pooja: newPooja });
      }
    );

    result.end(file.buffer);
  } catch (error) {
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

    const imageUrl = pooja.image;
    const publicId = imageUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`pooja_images/${publicId}`);

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
    const updates = req.body;

    const pooja = await PoojaModel.findById(id);
    if (!pooja) {
      return res.status(404).json({ success: false, message: 'Pooja not found' });
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
    const pooja = await PoojaModel.findById(id).populate('temple', 'name location');
    if (!pooja) {
      return res.status(404).json({ success: false, message: 'Pooja not found' });
    }
    res.status(200).json({ success: true, pooja });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching pooja', error: error.message });
  }
};

export { allPoojas, addPooja, removePooja, updatePooja, getPoojaById };
