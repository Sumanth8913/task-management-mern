const mongoose = require('mongoose');

const STATUS_VALUES = ['PENDING', 'IN_PROGRESS', 'DONE'];
const PRIORITY_VALUES = ['LOW', 'MEDIUM', 'HIGH'];

const attachmentSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    originalName: { type: String, required: true },
    resourceType: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: '',
    },
    status: {
      type: String,
      enum: STATUS_VALUES,
      default: 'PENDING',
    },
    priority: {
      type: String,
      enum: PRIORITY_VALUES,
      default: 'MEDIUM',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 120,
      default: '',
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Supports the common "my tasks, newest first" and text-search access patterns.
taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Task', taskSchema);
module.exports.STATUS_VALUES = STATUS_VALUES;
module.exports.PRIORITY_VALUES = PRIORITY_VALUES;
