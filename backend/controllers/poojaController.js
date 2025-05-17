import PoojaModel from '../models/poojaModel.js';
import cloudinary from '../config/cloudinary.js';


//All poojas
const allPoojas = async (req, res) => {
    try {
      const poojas = await PoojaModel.find();
      res.json({ success: true, poojas });
    } catch (error) {
      res.json({ message: 'Error fetching poojas', error: error.message });
    }
  };

// Add a new pooja
const addPooja = async (req, res) => {
    try {
        const { name, description, price, date } = req.body;
        const file = req.file; // Get file from request

        if (!file) {
            return res.json({ success: false, message: 'No image uploaded' });
        }

        // Upload image directly from buffer
        const result = await cloudinary.uploader.upload_stream(
            { folder: 'pooja_images', use_filename: true, unique_filename: false },
            async (error, uploadResult) => {
                if (error) {
                    return res.json({ success: false, message: 'Cloudinary upload error', error: error.message });
                }

                // Save Pooja details in the database
                const newPooja = new PoojaModel({ 
                    name, 
                    description, 
                    price, 
                    image: uploadResult.secure_url,  // Store Cloudinary URL
                    date 
                });

                await newPooja.save();
                res.json({ success: true, message: 'Pooja added successfully', pooja: newPooja });
            }
        );

        result.end(file.buffer); // Send the file buffer to Cloudinary

    } catch (error) {
        res.json({ success: false, message: 'Error adding pooja', error: error.message });
    }
};

// Remove a pooja
const removePooja = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the pooja in the database
        const pooja = await PoojaModel.findById(id);
        if (!pooja) {
            return res.status(404).json({ success: false, message: 'Pooja not found' });
        }

        // Extract Cloudinary public ID from image URL
        const imageUrl = pooja.image;
        const publicId = imageUrl.split('/').pop().split('.')[0]; // Extracts file name without extension

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(`pooja_images/${publicId}`);

        // Delete the pooja from the database
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
  
      // Find existing pooja
      const pooja = await PoojaModel.findById(id);
      if (!pooja) {
        return res.status(404).json({ success: false, message: 'Pooja not found' });
      }
  
      // Handle new image upload
      if (req.file) {
        // Remove old image from Cloudinary
        if (pooja.image) {
          const oldPublicId = pooja.image.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`pooja_images/${oldPublicId}`);
        }
  
        // Upload new image using stream from buffer
        const streamUpload = () =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: 'pooja_images' },
              (error, result) => {
                if (result) resolve(result);
                else reject(error);
              }
            );
            stream.end(req.file.buffer); // important: send the buffer
          });
  
        const result = await streamUpload();
        updates.image = result.secure_url;
      }
  
      // Update pooja
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
        const pooja = await PoojaModel.findById(id);
        if (!pooja) {
            return res.status(404).json({ success: false, message: 'Pooja not found' });
        }
        res.status(200).json({ success: true, pooja });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching pooja', error: error.message });
    }
};


export {allPoojas, addPooja, removePooja, updatePooja, getPoojaById };
