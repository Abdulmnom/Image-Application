const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    tittle: String,
    description: String,
    imagePath: String,
    likes: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Image', ImageSchema);