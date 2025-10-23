const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: false  // Optional if it's a general session
  },
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: false  // Ties to a specific exam prep
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  topicsCovered: [{
    type: String,  // e.g., "Algebra basics", "Calculus derivatives"
    required: false
  }],
  notes: {
    type: String,
    required: false
  },
  productivity: {
    type: Number,  // 1-10 rating, optional for now
    min: 1,
    max: 10,
    required: false
  }
}, {
  timestamps: true
});

// Virtual for session duration in minutes
studySessionSchema.virtual('durationMinutes').get(function() {
  const diffTime = this.endTime - this.startTime;
  return Math.ceil(diffTime / (1000 * 60));
});

// Ensure virtuals are included in JSON/toObject
studySessionSchema.set('toJSON', { virtuals: true });
studySessionSchema.set('toObject', { virtuals: true });

// Indexes for faster queries
studySessionSchema.index({ userId: 1, startTime: -1 });  // Recent sessions by user
studySessionSchema.index({ subjectId: 1 });
studySessionSchema.index({ examId: 1 });

const StudySession = mongoose.model('StudySession', studySessionSchema);

module.exports = StudySession;