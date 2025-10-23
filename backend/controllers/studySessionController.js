const StudySession = require('../models/StudySession');
const { generateSchedule } = require('../utils/scheduleGenerator');

// Create a new study session (e.g., start/end Pomodoro)
exports.createSession = async (req, res) => {
  try {
    const { subjectId, examId, startTime, endTime, topicsCovered, notes, productivity } = req.body;
    const session = new StudySession({
      userId: req.user.id,  // From auth middleware
      subjectId,
      examId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      topicsCovered,
      notes,
      productivity
    });
    await session.save();

    // Optional: Update subject's studyTime and completion
    if (subjectId) {
      const Subject = require('../models/Subject');
      await Subject.findByIdAndUpdate(subjectId, {
        $inc: { studyTime: session.durationMinutes }
        // TODO: Update completionPercentage based on topicsCovered
      });
    }

    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user's sessions (filtered by date/subject)
exports.getSessions = async (req, res) => {
  try {
    const { subjectId, examId, startDate, endDate } = req.query;
    const filter = { userId: req.user.id };
    if (subjectId) filter.subjectId = subjectId;
    if (examId) filter.examId = examId;
    if (startDate) filter.startTime = { $gte: new Date(startDate) };
    if (endDate) filter.startTime = { ...filter.startTime, $lte: new Date(endDate) };

    const sessions = await StudySession.find(filter)
      .populate('subjectId', 'name completionPercentage')
      .populate('examId', 'examDate')
      .sort({ startTime: -1 })
      .limit(50);

    res.json(sessions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update session (e.g., end time after Pomodoro)
exports.updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await StudySession.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true }
    ).populate('subjectId', 'name').populate('examId', 'examDate');
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete session
exports.deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await StudySession.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json({ message: 'Session deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Generate schedule
exports.generateSchedule = async (req, res) => {
  try {
    console.log('User ID for schedule:', req.user.id);  // ADD: Debug
    const { weeksAhead = 1 } = req.query;
    const schedule = await generateSchedule(req.user.id, parseInt(weeksAhead));
    console.log('Generated schedule:', schedule);  // ADD: Debug
    res.json(schedule);
  } catch (error) {
    console.error('Generate Schedule Error:', error);  // ADD: Log full error
    res.status(400).json({ message: error.message });
  }
};


// Get study analytics (total time, avg productivity, sessions per subject)
exports.getAnalytics = async (req, res) => {
  try {
    const { period = 'week' } = req.query;  // 'week', 'month', 'all'
    let dateFilter = {};
    const now = new Date();
    if (period === 'week') {
      dateFilter = { startTime: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) } };
    } else if (period === 'month') {
      dateFilter = { startTime: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) } };
    }

    const sessions = await StudySession.find({ ...dateFilter, userId: req.user.id })
      .populate('subjectId', 'name');

    // Calculate stats
    const totalDuration = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const avgProductivity = sessions.length > 0 ? 
      (sessions.reduce((sum, s) => sum + (s.productivity || 5), 0) / sessions.length) : 0;
    
    // Sessions per subject
    const sessionsBySubject = sessions.reduce((acc, s) => {
      const subName = s.subjectId?.name || 'General';
      acc[subName] = (acc[subName] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalSessions: sessions.length,
      totalStudyTimeMinutes: totalDuration,
      avgProductivity,
      sessionsBySubject
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};