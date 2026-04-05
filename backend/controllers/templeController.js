import TempleModel from "../models/templeModel.js";
import cloudinary from "../config/cloudinary.js";

// Add Temple
export const addTemple = async (req, res) => {
  try {
    const { name, location } = req.body;
    if (!name || !location) {
      return res.status(400).json({ success: false, message: "Name and location are required" });
    }
    
    let imageUrl = '';
    if (req.file) {
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'temple_images' },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          stream.end(req.file.buffer);
        });

      const result = await streamUpload();
      imageUrl = result.secure_url;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const newTemple = new TempleModel({ name, location, image: imageUrl });
    await newTemple.save();
    res.json({ success: true, message: "Temple added successfully", temple: newTemple });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Temples
export const getAllTemples = async (req, res) => {
  try {
    const temples = await TempleModel.find({});
    res.json({ success: true, temples });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Temple
export const updateTemple = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;
    
    const temple = await TempleModel.findById(id);
    if (!temple) {
      return res.status(404).json({ success: false, message: "Temple not found" });
    }

    let updateData = { name, location };

    if (req.file) {
      if (temple.image) {
        // Only attempt delete if it looks like a cloudinary URL (contains a slash and dot)
        if (temple.image.includes('/')) {
            const oldPublicId = temple.image.split('/').pop().split('.')[0];
            if (oldPublicId) {
                try {
                    await cloudinary.uploader.destroy(`temple_images/${oldPublicId}`);
                } catch(e) { console.error("Error deleting old image:", e); }
            }
        }
      }

      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'temple_images' },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          stream.end(req.file.buffer);
        });

      const result = await streamUpload();
      updateData.image = result.secure_url;
    } else if (req.body.image) {
      updateData.image = req.body.image;
    }

    const updatedTemple = await TempleModel.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ success: true, message: "Temple updated successfully", temple: updatedTemple });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Temple
export const deleteTemple = async (req, res) => {
  try {
    const { id } = req.params;
    const temple = await TempleModel.findById(id);
    if (!temple) {
      return res.status(404).json({ success: false, message: "Temple not found" });
    }

    if (temple.image && temple.image.includes('/')) {
      const publicId = temple.image.split('/').pop().split('.')[0];
      if (publicId) {
          try {
              await cloudinary.uploader.destroy(`temple_images/${publicId}`);
          } catch(e) { console.error("Error deleting image:", e); }
      }
    }

    await TempleModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Temple deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
