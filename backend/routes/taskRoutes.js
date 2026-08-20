const express = require('express');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskWeather,
} = require('../controllers/taskController');
const { validateCreateTask, validateUpdateTask, validateQuery } = require('../validators/taskValidator');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', validateQuery, getTasks);
router.post('/', upload.single('attachment'), validateCreateTask, createTask);
router.get('/:id', getTaskById);
router.patch('/:id', upload.single('attachment'), validateUpdateTask, updateTask);
router.delete('/:id', deleteTask);
router.get('/:id/weather', getTaskWeather);

module.exports = router;
