const { ApiError } = require('../utils/apiResponse');
const { STATUS_VALUES, PRIORITY_VALUES } = require('../models/Task');

const validateCreateTask = (req, res, next) => {
  const { title, status, priority, dueDate } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || !title.trim()) {
    errors.push('Title is required.');
  } else if (title.trim().length > 200) {
    errors.push('Title must be 200 characters or fewer.');
  }

  if (status && !STATUS_VALUES.includes(status)) {
    errors.push(`Status must be one of: ${STATUS_VALUES.join(', ')}`);
  }
  if (priority && !PRIORITY_VALUES.includes(priority)) {
    errors.push(`Priority must be one of: ${PRIORITY_VALUES.join(', ')}`);
  }
  if (dueDate && Number.isNaN(Date.parse(dueDate))) {
    errors.push('Due date must be a valid date.');
  }

  if (errors.length) {
    throw new ApiError(400, 'Validation failed', errors);
  }
  next();
};

const validateUpdateTask = (req, res, next) => {
  const { status, priority, dueDate, title } = req.body;
  const errors = [];

  if (title !== undefined && (!title || !title.trim())) {
    errors.push('Title cannot be empty.');
  }
  if (status && !STATUS_VALUES.includes(status)) {
    errors.push(`Status must be one of: ${STATUS_VALUES.join(', ')}`);
  }
  if (priority && !PRIORITY_VALUES.includes(priority)) {
    errors.push(`Priority must be one of: ${PRIORITY_VALUES.join(', ')}`);
  }
  if (dueDate && Number.isNaN(Date.parse(dueDate))) {
    errors.push('Due date must be a valid date.');
  }

  if (errors.length) {
    throw new ApiError(400, 'Validation failed', errors);
  }
  next();
};

const MAX_PAGE_SIZE = 50;

const validateQuery = (req, res, next) => {
  let { page = '1', limit = '10' } = req.query;
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  if (!Number.isInteger(page) || page < 1) page = 1;
  if (!Number.isInteger(limit) || limit < 1) limit = 10;
  if (limit > MAX_PAGE_SIZE) limit = MAX_PAGE_SIZE;

  req.query.page = page;
  req.query.limit = limit;
  next();
};

module.exports = { validateCreateTask, validateUpdateTask, validateQuery };
