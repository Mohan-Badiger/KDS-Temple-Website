import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  address: { 
    type: String, 
    required: true, 
    default: "SH 53, Rabkavi Banhatti, Bagalkot, Karnataka 587311" 
  },
  phone: { 
    type: String, 
    required: true, 
    default: "+91 91234 56789" 
  },
  email: { 
    type: String, 
    required: true, 
    default: "info@banahattitemple.com" 
  },
  adminEmail: { 
    type: String, 
    required: true, 
    default: "mohanbadiger250@gmail.com" 
  }
}, {
  timestamps: true,
});

const settingsModel = mongoose.models.settings || mongoose.model("settings", settingsSchema);
export default settingsModel;
