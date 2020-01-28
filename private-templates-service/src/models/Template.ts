import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    template: JSON,
    ownerOID: String,
    isPublished: Boolean,
    created: {
        type: Date,
        default: Date.now
    }
})

export const Template = mongoose.model('Template', templateSchema);