const Exam = require('../models/Exam');
const Subject = require('../models/Subject');

// @desc    Create new exam
// @route   POST /api/exams
// @access  Private
const createExam = async (req, res) => {
  try {
    const {
      subjectId,
      title,
      description,
      examDate,
      examTime,
      duration,
      totalMarks,
      weightage,
      topics,
      venue,
      examType,
    } = req.body;

    // Validate required fields
    if (!subjectId || !title || !examDate || !examTime || !totalMarks) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if subject exists and belongs to user
    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    if (subject.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create exam for this subject',
      });
    }

    // Create exam
    const exam = await Exam.create({
      userId: req.user.id,
      subjectId,
      title,
      description,
      examDate,
      examTime,
      duration,
      totalMarks,
      weightage,
      topics: topics || [],
      venue,
      examType,
    });

    // Populate subject info
    await exam.populate('subjectId', 'name color');

    res.status(201).json({
      success: true,
      message: 'Exam created successfully',
      data: exam,
    });
  } catch (error) {
    console.error('Create Exam Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating exam',
      error: error.message,
    });
  }
};

// @desc    Get all exams for logged-in user
// @route   GET /api/exams
// @access  Private
const getAllExams = async (req, res) => {
  try {
    const { subjectId, preparationStatus, upcoming } = req.query;

    // Build query
    const query = { userId: req.user.id };

    if (subjectId) {
      query.subjectId = subjectId;
    }

    if (preparationStatus) {
      query.preparationStatus = preparationStatus;
    }

    if (upcoming === 'true') {
      query.examDate = { $gte: new Date() };
    }

    const exams = await Exam.find(query)
      .populate('subjectId', 'name color priority')
      .sort({ examDate: 1 });

    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams,
    });
  } catch (error) {
    console.error('Get All Exams Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching exams',
      error: error.message,
    });
  }
};

// @desc    Get single exam by ID
// @route   GET /api/exams/:id
// @access  Private
const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate(
      'subjectId',
      'name color priority difficulty'
    );

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
      });
    }

    // Check if exam belongs to user
    if (exam.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this exam',
      });
    }

    res.status(200).json({
      success: true,
      data: exam,
    });
  } catch (error) {
    console.error('Get Exam By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching exam',
      error: error.message,
    });
  }
};

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private
const updateExam = async (req, res) => {
  try {
    let exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
      });
    }

    // Check if exam belongs to user
    if (exam.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this exam',
      });
    }

    exam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('subjectId', 'name color');

    res.status(200).json({
      success: true,
      message: 'Exam updated successfully',
      data: exam,
    });
  } catch (error) {
    console.error('Update Exam Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating exam',
      error: error.message,
    });
  }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private
const deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found',
      });
    }

    // Check if exam belongs to user
    if (exam.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this exam',
      });
    }

    await exam.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Exam deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error('Delete Exam Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting exam',
      error: error.message,
    });
  }
};

// @desc    Get upcoming exams
// @route   GET /api/exams/upcoming
// @access  Private
const getUpcomingExams = async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + parseInt(days));

    const exams = await Exam.find({
      userId: req.user.id,
      examDate: {
        $gte: today,
        $lte: futureDate,
      },
    })
      .populate('subjectId', 'name color priority')
      .sort({ examDate: 1 });

    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams,
    });
  } catch (error) {
    console.error('Get Upcoming Exams Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching upcoming exams',
      error: error.message,
    });
  }
};

// @desc    Get exam statistics
// @route   GET /api/exams/stats
// @access  Private
const getExamStats = async (req, res) => {
  try {
    const exams = await Exam.find({ userId: req.user.id });

    const today = new Date();
    const stats = {
      totalExams: exams.length,
      upcomingExams: 0,
      completedExams: 0,
      examsByStatus: {
        'not-started': 0,
        'in-progress': 0,
        completed: 0,
        revision: 0,
      },
      examsByType: {},
      averagePreparation: 0,
    };

    let totalPreparation = 0;

    exams.forEach((exam) => {
      // Count upcoming
      if (new Date(exam.examDate) >= today) {
        stats.upcomingExams++;
      }

      // Count completed
      if (exam.isPassed || new Date(exam.examDate) < today) {
        stats.completedExams++;
      }

      // Count by status
      stats.examsByStatus[exam.preparationStatus]++;

      // Count by type
      if (!stats.examsByType[exam.examType]) {
        stats.examsByType[exam.examType] = 0;
      }
      stats.examsByType[exam.examType]++;

      // Sum preparation
      totalPreparation += exam.studyProgress;
    });

    if (exams.length > 0) {
      stats.averagePreparation = Math.round(totalPreparation / exams.length);
    }

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get Exam Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stats',
      error: error.message,
    });
  }
};

module.exports = {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
  getUpcomingExams,
  getExamStats,
};