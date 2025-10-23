const Subject = require('../models/Subject');

// @desc    Create new subject
// @route   POST /api/subjects
// @access  Private
const createSubject = async (req, res) => {
  try {
    const { name, description, difficulty, priority, color, syllabus } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a subject name',
      });
    }

    // Create subject
    const subject = await Subject.create({
      userId: req.user.id,
      name,
      description,
      difficulty,
      priority,
      color,
      syllabus: syllabus || [],
    });

    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: subject,
    });
  } catch (error) {
    console.error('Create Subject Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating subject',
      error: error.message,
    });
  }
};

// @desc    Get all subjects for logged-in user
// @route   GET /api/subjects
// @access  Private
const getAllSubjects = async (req, res) => {
  try {
    const { priority, isActive } = req.query;

    // Build query
    const query = { userId: req.user.id };

    if (priority) {
      query.priority = priority;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const subjects = await Subject.find(query).sort({ priority: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error) {
    console.error('Get All Subjects Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching subjects',
      error: error.message,
    });
  }
};

// @desc    Get single subject by ID
// @route   GET /api/subjects/:id
// @access  Private
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    // Check if subject belongs to user
    if (subject.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this subject',
      });
    }

    res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    console.error('Get Subject By ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching subject',
      error: error.message,
    });
  }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private
const updateSubject = async (req, res) => {
  try {
    let subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    // Check if subject belongs to user
    if (subject.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this subject',
      });
    }

    subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Subject updated successfully',
      data: subject,
    });
  } catch (error) {
    console.error('Update Subject Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating subject',
      error: error.message,
    });
  }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    // Check if subject belongs to user
    if (subject.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this subject',
      });
    }

    await subject.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error('Delete Subject Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting subject',
      error: error.message,
    });
  }
};

// @desc    Update topic completion
// @route   PUT /api/subjects/:id/topics/:topicId
// @access  Private
const updateTopicCompletion = async (req, res) => {
  try {
    const { completed, confidence } = req.body;
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found',
      });
    }

    // Check if subject belongs to user
    if (subject.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this subject',
      });
    }

    // Find and update topic
    const topic = subject.syllabus.id(req.params.topicId);

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found',
      });
    }

    if (completed !== undefined) {
      topic.completed = completed;
    }

    if (confidence !== undefined) {
      topic.confidence = confidence;
    }

    topic.lastStudied = new Date();

    await subject.save();

    res.status(200).json({
      success: true,
      message: 'Topic updated successfully',
      data: subject,
    });
  } catch (error) {
    console.error('Update Topic Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating topic',
      error: error.message,
    });
  }
};

// @desc    Get subject statistics
// @route   GET /api/subjects/stats
// @access  Private
const getSubjectStats = async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.user.id, isActive: true });

    const stats = {
      totalSubjects: subjects.length,
      averageCompletion: 0,
      totalStudyTime: 0,
      subjectsByPriority: {
        high: 0,
        medium: 0,
        low: 0,
      },
      subjectsByDifficulty: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
    };

    subjects.forEach((subject) => {
      stats.averageCompletion += subject.completionPercentage;
      stats.totalStudyTime += subject.totalStudyTime;
      stats.subjectsByPriority[subject.priority]++;
      stats.subjectsByDifficulty[subject.difficulty]++;
    });

    if (subjects.length > 0) {
      stats.averageCompletion = Math.round(stats.averageCompletion / subjects.length);
    }

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Get Subject Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stats',
      error: error.message,
    });
  }
};

module.exports = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  updateTopicCompletion,
  getSubjectStats,
};