const e = require('express');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res , next) => {
    const token =req.headers.authorization;

    if (!token)
        return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // نضمن أنه يحتوي فقط على البيانات التي نحتاجها
        req.user =  {
            userId: decoded.userId,
            username: decoded.username,
            email: decoded.email
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid token you need to login' });
    }
}

module.exports = verifyToken