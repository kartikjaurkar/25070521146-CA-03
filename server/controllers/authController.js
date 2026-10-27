const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

const createToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured on the server.');
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Full name, email, and password are required.');
  }

  const trimmedName = String(name).trim();
  const normalizedEmail = String(email).trim().toLowerCase();

  if (trimmedName.length < 2) {
    res.status(400);
    throw new Error('Please enter your full name (at least 2 characters).');
  }

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    res.status(400);
    throw new Error('Please enter a valid email address.');
  }

  if (String(password).length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters long.');
  }

  if (String(password).length > 72) {
    res.status(400);
    throw new Error('Password must be 72 characters or fewer.');
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match.');
  }

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    res.status(409);
    throw new Error('An account with this email already exists.');
  }

  const user = await User.create({
    name: trimmedName,
    email: normalizedEmail,
    password,
  });

  const token = createToken(user._id);

  res.status(201).json({
    message: 'Account created successfully.',
    token,
    user: serializeUser(user),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required.');
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user || !(await user.matchPassword(String(password)))) {
    res.status(401);
    throw new Error('Invalid email or password.');
  }

  const token = createToken(user._id);

  res.json({
    message: 'Logged in successfully.',
    token,
    user: serializeUser(user),
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({
    user: serializeUser(req.user),
  });
});

module.exports = { register, login, getMe };
