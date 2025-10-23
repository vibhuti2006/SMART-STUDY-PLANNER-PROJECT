const mongoose = require('mongoose');

const examSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Please provide a subject'],
    },
    title: {
      type: String,
      required: [true, 'Please provide an exam title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    examDate: {
      type: Date,
      required: [true, 'Please provide an exam date'],
    },
    examTime: {
      type: String,
      required: [true, 'Please provide an exam time'],
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // HH:MM format
    },
    duration: {
      type: Number,
      default: 180, // in minutes (3 hours default)
    },
    totalMarks: {
      type: Number,
      required: [true, 'Please provide total marks'],
      min: 0,
    },
    weightage: {
      type: Number,
      default: 100, // percentage
      min: 0,
      max: 100,
    },
    topics: [
      {
        type: String,
        trim: true,
      },
    ],
    preparationStatus: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed', 'revision'],
      default: 'not-started',
    },
    studyProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    reminders: [
      {
        reminderDate: {
          type: Date,
        },
        message: {
          type: String,
        },
        sent: {
          type: Boolean,
          default: false,
        },
      },
    ],
    venue: {
      type: String,
      trim: true,
      default: '',
    },
    examType: {
      type: String,
      enum: ['midterm', 'final', 'quiz', 'assignment', 'project', 'other'],
      default: 'other',
    },
    isPassed: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
examSchema.index({ userId: 1, examDate: 1 });
examSchema.index({ userId: 1, subjectId: 1 });
examSchema.index({ userId: 1, preparationStatus: 1 });

// Virtual for days until exam
examSchema.virtual('daysUntilExam').get(function () {
  const now = new Date();
  const exam = new Date(this.examDate);
  const diffTime = exam - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Ensure virtuals are included in JSON
examSchema.set('toJSON', { virtuals: true });
examSchema.set('toObject', { virtuals: true });

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;