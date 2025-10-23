const express = require('express');
const router = express.Router();
const {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  getUpcomingExams,
  getExamStats,
} = require('../controllers/examController');
const { protect } = require('../middleware/auth');

// All routes are protected (require authentication)

// Stats and upcoming - must be before /:id route
router.get('/stats', protect, getExamStats);
router.get('/upcoming', protect, getUpcomingExams);

// Exam CRUD
router.post('/', protect, createExam);
router.get('/', protect, getAllExams);
router.get('/:id', protect, getExamById);
router.put('/:id', protect, updateExam);
router.delete('/:id', protect, deleteExam);

module.exports = router;