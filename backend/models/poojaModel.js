import mongoose from 'mongoose';

const poojaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    temple: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true }
});

const PoojaModel = mongoose.models.pooja || mongoose.model('Pooja', poojaSchema);

export default PoojaModel;
