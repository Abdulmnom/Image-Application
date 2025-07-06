const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../module/User');
const verifyToken = require('../middleware/auth');


// register
router.post('/register', async(req , res)=> {
    const { username , email , password } = req.body;
    try {
        // check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // hash password gen salt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // create new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        //  JWT token
          const token = jwt.sign(
            { userId: newUser._id, username: newUser.username, email: newUser.email },
            process.env.JWT_SECRET
        );
        res.status(201).json({ message: 'User created successfully', token , user: { id: newUser._id, username: newUser.username, email: newUser.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error',error });
    }
})

// login
router.post('/login', async(req , res)=> {
    const {email , password} = req.body;
    try {
        // check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        // check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        // JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username, email: user.email },
            process.env.JWT_SECRET
        );
        res.status(200).json({ Message: 'Login successful',
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// update user data 
router.put('/update', verifyToken, async (req, res) => {
  const { username, email, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username) user.username = username;
    if (email) user.email = email;
    // update password
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.json({ message: 'Profile updated successfully', user: {
      id: user._id,
      username: user.username,
      email: user.email
    }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
})

module.exports = router;