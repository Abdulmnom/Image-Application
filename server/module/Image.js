const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    imagePath: String,
    likes: { type: Number, default: 0 },
    likesBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Image', ImageSchema);