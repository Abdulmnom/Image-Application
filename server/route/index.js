const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../module/User');


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
        const token = jwt.sign({ userId : newUser._id, username: newUser.username, email: newUser.email }, process.env.JWT_SECRET);
        res.status(201).json({ message: 'User created successfully', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
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
        const token = jwt.sign({ userId : user._id, username: user.username, email: user.email }, process.env.JWT_SECRET);
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router