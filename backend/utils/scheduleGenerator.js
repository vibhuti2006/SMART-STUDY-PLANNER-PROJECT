const Subject = require('../models/Subject');
const Exam = require('../models/Exam');

// Map priority string to number for duration calc
const getPriorityNumber = (priorityStr) => {
  const mapping = { low: 1, medium: 3, high: 5 };
  return mapping[priorityStr] || 3;  // Default medium
};

// Simple schedule generator
async function generateSchedule(userId, weeksAhead = 1) {
  // Fetch active subjects only
  const subjects = await Subject.find({ userId, isActive: true });

  if (subjects.length === 0) return [];  // No subjects? Empty schedule

  // Fetch upcoming exams
  const exams = await Exam.find({ userId, preparationStatus: { $ne: 'completed' } })
    .sort('examDate')
    .limit(subjects.length * 2);

  // Prioritize: Urgency (exams) + Gaps (completion %) + Difficulty + Low study time
  const prioritizedSubjects = subjects.map(subject => {
    const nearestExam = exams.find(e => e.subjectId && e.subjectId.toString() === subject._id.toString());
    const daysToExam = nearestExam ? Math.max(1, (nearestExam.examDate - new Date()) / (1000 * 60 * 60 * 24)) : 30;
    const completionPct = (subject.completionPercentage || 0) / 100;
    const difficulty = Number(subject.difficulty) || 3;
    const studyTimeFactor = 1 / Math.max(1, (subject.totalStudyTime || 0) / 60);  // Penalize low hours (<1 hr = higher urgency)
    const priorityScore = (1 / daysToExam) * (1 - completionPct) * difficulty * studyTimeFactor;

    // Topics: Unfinished from syllabus
    let topics = [];
    if (subject.syllabus && Array.isArray(subject.syllabus)) {
      topics = subject.syllabus
        .filter(topic => topic && !topic.completed)
        .slice(0, 3)  // Top 3 unfinished
        .map(topic => topic.name);
    }
    // Fallback if no unfinished
    if (topics.length === 0) {
      topics = subject.syllabus?.slice(0, 3).map(t => t?.name) || [`Review ${subject.name}`];
    }

    return { 
      ...subject.toObject(), 
      priorityScore, 
      daysToExam,
      topics,
      priorityNum: getPriorityNumber(subject.priority)  // Pre-compute
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore);

  // Generate schedule: Mon-Fri, balanced rotation
  const schedule = [];
  const daysInPeriod = weeksAhead * 7;
  let subjectIndex = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);  // Midnight today

  for (let dayOffset = 0; dayOffset < daysInPeriod; dayOffset++) {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() + dayOffset);
    
    const dayOfWeek = dayDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;  // Skip Sun/Sat

    const subject = prioritizedSubjects[subjectIndex % prioritizedSubjects.length];
    const duration = 50 + (subject.priorityNum * 10);  // 60-100 min (adjusted for Pomodoro-friendly)

    schedule.push({
      day: dayDate.toISOString().split('T')[0],  // YYYY-MM-DD string for cleaner UI
      dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek],
      subjectId: subject._id,
      subjectName: subject.name,
      durationMinutes: duration,
      topics: subject.topics.slice(0, 2),  // ✅ FIXED: Use subject.topics instead of topics
      estimatedCompletionBoost: Math.round(duration / (subject.totalTopics || 1))  // Rough % gain
    });

    subjectIndex++;
  }

  return schedule;
}

module.exports = { generateSchedule };