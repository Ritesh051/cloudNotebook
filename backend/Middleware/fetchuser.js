const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path as necessary

const fetchuser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(data.user.id);
        next();
    } catch (error) {
        console.error('Error in fetchuser middleware:', error.message);
        res.status(401).send('Invalid token');
    }
};

module.exports = fetchuser;
