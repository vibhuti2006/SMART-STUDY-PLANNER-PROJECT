const express = require('express');
const router = express.Router();
const {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  updateTopicCompletion,
  getSubjectStats,
} = require('../controllers/subjectController');
const { protect } = require('../middleware/auth');

// All routes are protected (require authentication)

// Get stats - must be before /:id route
router.get('/stats', protect, getSubjectStats);

// Subject CRUD
router.post('/', protect, createSubject);
router.get('/', protect, getAllSubjects);
router.get('/:id', protect, getSubjectById);
router.put('/:id', protect, updateSubject);
router.delete('/:id', protect, deleteSubject);

// Topic management
router.put('/:id/topics/:topicId', protect, updateTopicCompletion);

module.exports = router;