const streamifier = require('stream').Readable;
const asyncHandler = require('../utils/asyncHandler');
const { success, ApiError } = require('../utils/apiResponse');
const Task = require('../models/Task');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const { sendTaskCreatedEmail, sendTaskCompletedEmail } = require('../services/emailService');
const { getWeatherForCity } = require('../services/weatherService');

const SORT_MAP = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  due_soon: { dueDate: 1 },
  due_late: { dueDate: -1 },
  priority: { priority: -1, createdAt: -1 },
};

const PRIORITY_RANK = { HIGH: 3, MEDIUM: 2, LOW: 1 };

const uploadBufferToCloudinary = (buffer, originalName) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'task-management/attachments', resource_type: 'auto' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    streamifier.from(buffer).pipe(uploadStream);
  });

const buildAttachment = async (file) => {
  if (!file) return null;
  if (!isCloudinaryConfigured()) {
    throw new ApiError(503, 'File uploads are not configured on this server.');
  }
  const result = await uploadBufferToCloudinary(file.buffer, file.originalname);
  return {
    url: result.secure_url,
    originalName: file.originalname,
    resourceType: result.resource_type,
    publicId: result.public_id,
  };
};

// GET /api/tasks
const getTasks = asyncHandler(async (req, res) => {
  const { page, limit, search, status, priority, startDate, endDate, sort } = req.query;

  const query = { user: req.user._id };

  if (status) query.status = status;
  if (priority) query.priority = priority;

  if (startDate || endDate) {
    query.dueDate = {};
    if (startDate && !Number.isNaN(Date.parse(startDate))) query.dueDate.$gte = new Date(startDate);
    if (endDate && !Number.isNaN(Date.parse(endDate))) query.dueDate.$lte = new Date(endDate);
  }

  if (search && search.trim()) {
    query.$text = { $search: search.trim() };
  }

  const sortStage = SORT_MAP[sort] || SORT_MAP.newest;

  const [tasks, total] = await Promise.all([
    Task.find(query)
      .sort(sortStage)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Task.countDocuments(query),
  ]);

  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return success(res, 200, { tasks }, {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  });
});

// GET /api/tasks/:id
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) throw new ApiError(404, 'Task not found.');
  return success(res, 200, { task });
});

// POST /api/tasks
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate, location } = req.body;

  const attachment = await buildAttachment(req.file);

  const task = await Task.create({
    user: req.user._id,
    title: title.trim(),
    description: description?.trim() || '',
    status: status || 'PENDING',
    priority: priority || 'MEDIUM',
    dueDate: dueDate || null,
    location: location?.trim() || '',
    attachments: attachment ? [attachment] : [],
    completedAt: status === 'DONE' ? new Date() : null,
  });

  // Email failure must never fail task creation.
  sendTaskCreatedEmail(req.user.email, task).catch(() => {});

  return success(res, 201, { task });
});

// PATCH /api/tasks/:id
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) throw new ApiError(404, 'Task not found.');

  const previousStatus = task.status;
  const updatable = ['title', 'description', 'status', 'priority', 'dueDate', 'location'];

  updatable.forEach((field) => {
    if (req.body[field] !== undefined) {
      task[field] = typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field];
    }
  });

  if (req.file) {
    const attachment = await buildAttachment(req.file);
    if (attachment) task.attachments.push(attachment);
  }

  // completedAt tracks the DONE transition; clearing it when a task leaves
  // DONE keeps the field meaningful instead of a stale timestamp.
  if (task.status === 'DONE' && previousStatus !== 'DONE') {
    task.completedAt = new Date();
  } else if (task.status !== 'DONE') {
    task.completedAt = null;
  }

  await task.save();

  if (previousStatus !== 'DONE' && task.status === 'DONE') {
    sendTaskCompletedEmail(req.user.email, task).catch(() => {});
  }

  return success(res, 200, { task });
});

// DELETE /api/tasks/:id
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) throw new ApiError(404, 'Task not found.');

  if (isCloudinaryConfigured()) {
    await Promise.all(
      task.attachments.map((a) =>
        cloudinary.uploader.destroy(a.publicId, { resource_type: a.resourceType }).catch(() => {})
      )
    );
  }

  await task.deleteOne();
  return success(res, 200, { message: 'Task deleted.' });
});

// GET /api/tasks/:id/weather
const getTaskWeather = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
  if (!task) throw new ApiError(404, 'Task not found.');
  if (!task.location) throw new ApiError(400, 'This task has no location set.');

  const weather = await getWeatherForCity(task.location);
  return success(res, 200, { weather });
});

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask, getTaskWeather };
