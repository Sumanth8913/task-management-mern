const { ApiError } = require('../utils/apiResponse');

const EMAIL_RE = /^\S+@\S+\.\S+$/;

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters.');
  }
  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    errors.push('A valid email is required.');
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.push('Password must be at least 8 characters.');
  }

  if (errors.length) {
    throw new ApiError(400, 'Validation failed', errors);
  }

  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    errors.push('A valid email is required.');
  }
  if (!password || typeof password !== 'string') {
    errors.push('Password is required.');
  }

  if (errors.length) {
    throw new ApiError(400, 'Validation failed', errors);
  }

  req.body.email = email.trim().toLowerCase();
  next();
};

module.exports = { validateRegister, validateLogin };
