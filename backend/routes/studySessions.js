const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const studySessionController = require('../controllers/studySessionController');

router.use(protect);

// Schedule routes FIRST (more specific routes before generic ones)
router.get('/schedule/today', studySessionController.generateSchedule);  // Changed from /schedule
router.get('/schedule', studySessionController.generateSchedule);  // Keep this too for compatibility
router.get('/analytics', studySessionController.getAnalytics);

// CRUD routes
router.post('/', studySessionController.createSession);
router.get('/', studySessionController.getSessions);
router.put('/:id', studySessionController.updateSession);
router.delete('/:id', studySessionController.deleteSession);

module.exports = router;