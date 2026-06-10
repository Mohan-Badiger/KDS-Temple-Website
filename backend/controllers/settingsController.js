import settingsModel from "../models/settingsModel.js";
import validator from "validator";

// ===================================
// 1. Get Public Website Settings
// ===================================
const getPublicSettings = async (req, res) => {
  try {
    let settings = await settingsModel.findOne();
    if (!settings) {
      settings = await settingsModel.create({});
    }

    // Exclude adminEmail from public response for security
    const publicSettings = {
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
    };

    return res.json({ success: true, settings: publicSettings });
  } catch (err) {
    console.error("Get Public Settings Error:", err);
    return res.status(500).json({ success: false, message: "Failed to retrieve settings" });
  }
};

// ===================================
// 2. Get Admin Website Settings (Includes adminEmail)
// ===================================
const getAdminSettings = async (req, res) => {
  try {
    let settings = await settingsModel.findOne();
    if (!settings) {
      settings = await settingsModel.create({});
    }

    return res.json({ success: true, settings });
  } catch (err) {
    console.error("Get Admin Settings Error:", err);
    return res.status(500).json({ success: false, message: "Failed to retrieve admin settings" });
  }
};

// ===================================
// 3. Update Website Settings
// ===================================
const updateAdminSettings = async (req, res) => {
  try {
    const { address, phone, email, adminEmail } = req.body;

    // Validation
    if (!address || address.trim() === "") {
      return res.json({ success: false, message: "Address is required" });
    }
    if (!phone || phone.trim() === "") {
      return res.json({ success: false, message: "Phone number is required" });
    }
    if (!email || !validator.isEmail(email)) {
      return res.json({ success: false, message: "Valid public contact email is required" });
    }
    if (!adminEmail || !validator.isEmail(adminEmail)) {
      return res.json({ success: false, message: "Valid admin login email is required" });
    }

    let settings = await settingsModel.findOne();
    if (!settings) {
      settings = new settingsModel();
    }

    settings.address = address.trim();
    settings.phone = phone.trim();
    settings.email = email.toLowerCase().trim();
    settings.adminEmail = adminEmail.toLowerCase().trim();

    await settings.save();

    return res.json({ success: true, message: "Settings updated successfully", settings });
  } catch (err) {
    console.error("Update Settings Error:", err);
    return res.status(500).json({ success: false, message: "Failed to update settings" });
  }
};

export { getPublicSettings, getAdminSettings, updateAdminSettings };
