import mongoose from 'mongoose';

const poojaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number }, // Default/Legacy price
    temple: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple' }, // Legacy temple
    temples: [{
        templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple' },
        price: { type: Number },
        isActive: { type: Boolean, default: true },
        unavailableDates: [{ type: String }] // Format: YYYY-MM-DD
    }]
});

const PoojaModel = mongoose.models.pooja || mongoose.model('Pooja', poojaSchema);

export default PoojaModel;
