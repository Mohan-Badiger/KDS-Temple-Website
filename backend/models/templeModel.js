import mongoose from "mongoose";

const templeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: false },
}, { timestamps: true });

const TempleModel = mongoose.models.temple || mongoose.model("Temple", templeSchema);

export default TempleModel;
