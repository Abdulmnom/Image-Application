const express = require('express');
const router = express.Router();
const verifyToken =require('../middleware/auth');
const multer = require('multer');
const Image = require('../module/Image');
const path = require('path');
const fs = require('fs');

// storage setting
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

// upload image save in the dire uploads
router.post('/upload', verifyToken, upload.single('image'), async (req, res) => {
    try {
        const newImage = new Image({
            title: req.body.title,
            description: req.body.description,
            imagePath: req.file.path,
            createdBy: req.user.userId
        })
         
        await newImage.save();
        res.status(201).json({ message: 'Image uploaded successfully' });

    } catch (error) {
        console.error(error);
           if(!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            } 
        res.status(500).json({ message: 'Server error in uploading image' });
    }
});

// public image for all user
router.get('/',async(req, res) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (err) {
        res.status(500).json({ message: 'failed to get the image' });
    }
})

// get image for specific user 
router.get('/my', verifyToken, async(req, res) => {
    try {
        const images = await Image.find({createdBy: req.user.userId}).sort({createdAt: -1});
        res.json(images);
    } catch (err) {
        res.status(500).json({ message: 'failed to get the image' });
    }
});

// update the title and description of image
router.put('/:id', verifyToken, async(req,res)=> {
    try {
        const image = await Image.findOne({_id:req.params.id, createdBy: req.user.userId});
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        if (image.createdBy.toString() !== req.user.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        image.tittle = req.body.tittle || image.tittle;
        image.description = req.body.description || image.description;
        await image.save();
        res.json({ message: 'Image updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'failed to update the image' });
    }
})

// like image
router.post('/:id/like', verifyToken, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // check if user has already liked the image
    if (image.likesBy && image.likesBy.includes(req.user.userId)) {
      return res.status(400).json({ message: 'Already liked' });
    }

    image.likes += 1;
    image.likesBy = [...(image.likesBy || []), req.user.userId];
    await image.save();

    res.json({ message: 'Image liked successfully', likes: image.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to like the image' });
  }
});

// delete image
router.delete('/:id/', verifyToken, async(req, res) => {
    try {
        const image = await Image.findOne({_id:req.params.id, createdBy: req.user.userId});
        if (!image) {
            return res.status(404).json({ message: 'Image not found or does not have permission to delete' });
        }
        if (image.createdBy.toString() !== req.user.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        fs.unlinkSync(image.imagePath);
        await image.remove();
        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'failed to delete the image' });
    }
})

module.exports = router