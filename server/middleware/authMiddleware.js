const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized. Please log in to continue.');
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    res.status(401);
    throw new Error('Your session has expired. Please log in again.');
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    res.status(401);
    throw new Error('The account for this session no longer exists.');
  }

  req.user = user;
  return next();
});

module.exports = { protect };
