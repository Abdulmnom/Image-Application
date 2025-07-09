const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const multer = require('multer');
const Image = require('../module/Image');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

router.post('/upload', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const newImage = new Image({
      title: req.body.title,
      description: req.body.description,
      imagePath: req.file.path,
      createdBy: req.user.userId
    });

    await newImage.save();
    res.status(201).json({ message: 'Image uploaded successfully', image: newImage });
  } catch (error) {
    console.error("Error uploading image:", error);
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(500).json({ message: 'Server error in uploading image' });
  }
});

router.get('/', async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ message: 'Failed to get images' });
  }
});

router.get('/my', verifyToken, async (req, res) => {
  try {
    const images = await Image.find({ createdBy: req.user.userId }).sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    console.error("Error fetching user images:", err);
    res.status(500).json({ message: 'Failed to get user images' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const image = await Image.findOne({ _id: req.params.id, createdBy: req.user.userId });
    if (!image) {
      return res.status(404).json({ message: 'Image not found or unauthorized' });
    }

    image.title = req.body.title || image.title;
    image.description = req.body.description || image.description;
    await image.save();
    res.json({ message: 'Image updated successfully', image });
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).json({ message: 'Failed to update the image' });
  }
});

router.post('/:id/like', verifyToken, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const userIdString = req.user.userId.toString();
    if (image.likesBy.map(id => id.toString()).includes(userIdString)) {
      return res.status(400).json({ message: 'You have already liked this image.' });
    }

    image.likes += 1;
    image.likesBy = image.likesBy ? [...image.likesBy, req.user.userId] : [req.user.userId];
    await image.save();

    res.status(200).json({
      message: 'Image liked successfully',
      likes: image.likes,
      likesBy: image.likesBy.map(id => id.toString())
    });
  } catch (error) {
    console.error('Error liking image:', error);
    res.status(500).json({ message: 'Failed to like the image' });
  }
});
// something error  but in the server side is success
router.post('/:id/unlike', verifyToken, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });

    const userIdString = req.user.userId.toString();
    const index = image.likesBy.map(id => id.toString()).indexOf(userIdString);

    if (index !== -1) {
      image.likesBy.splice(index, 1);
      image.likes = Math.max(0, image.likes - 1);
      await image.save();

      res.status(200).json({
        message: 'Like removed successfully',
        likes: image.likes,
        likesBy: image.likesBy.map(id => id.toString())
      });
    } else {
      res.status(400).json({ message: 'You have not liked this image.' });
    }
  } catch (error) {
    console.error('Error unliking image:', error);
    res.status(500).json({ message: 'Server error in unliking' });
  }
});

router.delete('/:id/', verifyToken, async (req, res) => {
  try {
    const image = await Image.findOne({ _id: req.params.id, createdBy: req.user.userId });
    if (!image) {
      return res.status(404).json({ message: 'Image not found or unauthorized' });
    }

    if (fs.existsSync(image.imagePath)) {
      fs.unlinkSync(image.imagePath);
    }
    await Image.deleteOne({ _id: req.params.id }).exec();
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: 'Failed to delete the image' });
  }
});

router.get('/:id/likes', verifyToken, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id).populate('likesBy', 'username email');
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json({ users: image.likesBy });
  } catch (error) {
    console.error("Error fetching liked users:", error);
    res.status(500).json({ message: 'Failed to fetch liked users' });
  }
});

module.exports = router;
