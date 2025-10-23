const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  confidence: {
    type: Number,
    min: 1,
    max: 10,
    default: 5,
  },
  notes: {
    type: String,
    default: '',
  },
  lastStudied: {
    type: Date,
  },
});

const subjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a subject name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    difficulty: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    color: {
      type: String,
      default: '#3B82F6', // Blue color
      match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    },
    syllabus: [topicSchema],
    totalTopics: {
      type: Number,
      default: 0,
    },
    completedTopics: {
      type: Number,
      default: 0,
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalStudyTime: {
      type: Number,
      default: 0, // in minutes
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate completion percentage before saving
subjectSchema.pre('save', function (next) {
  if (this.syllabus && this.syllabus.length > 0) {
    this.totalTopics = this.syllabus.length;
    this.completedTopics = this.syllabus.filter((topic) => topic.completed).length;
    this.completionPercentage = Math.round(
      (this.completedTopics / this.totalTopics) * 100
    );
  } else {
    this.totalTopics = 0;
    this.completedTopics = 0;
    this.completionPercentage = 0;
  }
  next();
});

// Index for faster queries
subjectSchema.index({ userId: 1, isActive: 1 });
subjectSchema.index({ userId: 1, priority: 1 });

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;