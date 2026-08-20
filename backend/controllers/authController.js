const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const { success, ApiError } = require('../utils/apiResponse');
const User = require('../models/User');

const signToken = (userId) =>
  jwt.sign({ sub: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const user = await User.create({ name, email, password });
  const token = signToken(user._id);

  return success(res, 201, { user: user.toSafeObject(), token });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const token = signToken(user._id);
  return success(res, 200, { user: user.toSafeObject(), token });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  return success(res, 200, { user: req.user.toSafeObject() });
});

// POST /api/auth/logout
// Stateless JWT: logout is a client-side token removal. This endpoint exists
// for a consistent API surface and future-proofing (e.g. token blocklists).
const logout = asyncHandler(async (req, res) => {
  return success(res, 200, { message: 'Logged out.' });
});

module.exports = { register, login, getMe, logout };
