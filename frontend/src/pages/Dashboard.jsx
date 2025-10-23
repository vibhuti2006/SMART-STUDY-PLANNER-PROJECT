// import { useApiQuery } from '../hooks/useApi';
// import { subjectsAPI, examsAPI, scheduleAPI } from '../services/api';
// import { useAuth } from '../contexts/AuthContext';
// import PomodoroTimer from '../components/PomodoroTimer';
// import { BookOpenIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';  // ADD icons

// const Dashboard = () => {
//   const { user } = useAuth();
//   if (!user) return null;

//   const { data: subjectsRes, isLoading: subjectsLoading } = useApiQuery(['subjects'], subjectsAPI.getAll, { enabled: !!user });
//   const { data: examsRes, isLoading: examsLoading } = useApiQuery(['exams'], examsAPI.getAll, { enabled: !!user });
//   const { data: scheduleRes, isLoading: scheduleLoading } = useApiQuery(['schedule'], scheduleAPI.getToday, { enabled: !!user });

//   const subjects = subjectsRes?.data?.data || [];
//   const exams = examsRes?.data?.data || [];
//   const schedule = scheduleRes?.data || [];

//   if (subjectsLoading || examsLoading || scheduleLoading) {
//     return <div className="flex items-center justify-center min-h-screen bg-gray-50">
//       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       <span className="ml-2 text-gray-600">Loading dashboard...</span>
//     </div>;
//   }

//   const totalSubjects = subjects.length;
//   const upcomingExams = exams.filter(e => new Date(e.examDate) > new Date()).length;
//   const todaySchedule = schedule[0];

//   return (
//     <div>
//       <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome, {user.email || 'User'}!</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
//           <BookOpenIcon className="h-8 w-8 text-blue-600" />
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900">Subjects</h3>
//             <p className="text-3xl font-bold text-blue-600 mt-1">{totalSubjects}</p>
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
//           <CalendarIcon className="h-8 w-8 text-red-600" />
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900">Upcoming Exams</h3>
//             <p className="text-3xl font-bold text-red-600 mt-1">{upcomingExams}</p>
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
//           <ClockIcon className="h-8 w-8 text-green-600" />
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900">Today's Study Time</h3>
//             <p className="text-3xl font-bold text-green-600 mt-1">{todaySchedule?.durationMinutes || 0} min</p>
//           </div>
//         </div>
//       </div>
//       {todaySchedule && (
//         <div className="bg-white p-6 rounded-lg shadow mb-8">
//           <h3 className="text-xl text-gray-900 font-bold mb-4">Today's Schedule</h3>
//           <p className="text-gray-700">Subject: {todaySchedule.subjectName}</p>
//           <p className="text-gray-700">Topics: {todaySchedule.topics?.join(', ') || 'General review'}</p>
//           <p className="text-gray-700">Duration: {todaySchedule.durationMinutes} min</p>
//         </div>
//       )}
//       {!todaySchedule && <p className="text-gray-500 mb-8">No schedule today. Add subjects/exams to generate one.</p>}
//       <div className="mt-8">
//         <h2 className="text-2xl text-gray-900 font-bold mb-4">Start Studying</h2>
//         <PomodoroTimer subjectId="" examId="" />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;




import { useApiQuery } from '../hooks/useApi';
import { subjectsAPI, examsAPI } from '../services/api';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Clock, TrendingUp, ArrowRight, Target, Zap } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const { data: subjectsData } = useApiQuery(['subjects'], subjectsAPI.getAll);
  const { data: examsData } = useApiQuery(['exams'], examsAPI.getAll);
  const { data: sessionsData } = useApiQuery(['todaySessions'], () => 
    api.get('/study-sessions?startDate=' + new Date().toISOString().split('T')[0])
  );

  const subjects = subjectsData?.data.data || [];
  const exams = examsData?.data.data || [];
  const todaySessions = sessionsData?.data || [];

  const totalStudyTime = todaySessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const upcomingExams = exams.filter(e => new Date(e.examDate) > new Date()).length;

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Let's make today productive and focused.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Subjects Card */}
          <Link 
            to="/subjects"
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Active Subjects</h3>
            <p className="text-3xl font-bold text-gray-900">{subjects.length}</p>
            <p className="text-xs text-gray-500 mt-2">Click to manage</p>
          </Link>

          {/* Exams Card */}
          <Link 
            to="/exams"
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-red-200 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors">
                <Calendar className="w-6 h-6 text-red-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Upcoming Exams</h3>
            <p className="text-3xl font-bold text-gray-900">{upcomingExams}</p>
            <p className="text-xs text-gray-500 mt-2">Stay prepared</p>
          </Link>

          {/* Study Time Card */}
          <Link 
            to="/analytics"
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-green-200 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Today's Study Time</h3>
            <p className="text-3xl font-bold text-gray-900">{formatTime(totalStudyTime)}</p>
            <p className="text-xs text-gray-500 mt-2">Keep it up!</p>
          </Link>
        </div>

        {/* Today's Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
                </div>
                <Link 
                  to="/schedule"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {subjects.length > 0 ? (
                <div className="space-y-3">
                  {subjects.slice(0, 3).map((subject) => (
                    <div 
                      key={subject._id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl hover:from-gray-100 transition-colors border border-gray-100"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-1 h-12 bg-blue-500 rounded-full"></div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                          <p className="text-sm text-gray-500">
                            {subject.syllabus?.filter(t => !t.completed).length || 0} topics pending
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">60 min</div>
                        <div className="text-xs text-gray-500">suggested</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No subjects yet</p>
                  <Link 
                    to="/subjects"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    Add Your First Subject
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Zap className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              </div>
              
              <div className="space-y-3">
                <Link
                  to="/pomodoro"
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all group"
                >
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Start Studying</h3>
                    <p className="text-xs text-gray-600">Launch Pomodoro</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/analytics"
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all group"
                >
                  <div className="p-2 bg-green-600 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">View Progress</h3>
                    <p className="text-xs text-gray-600">Check analytics</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/schedule"
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all group"
                >
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">Study Plan</h3>
                    <p className="text-xs text-gray-600">View schedule</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Motivation Quote */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="text-4xl mb-3">💡</div>
              <p className="text-sm font-medium mb-2 opacity-90">Daily Motivation</p>
              <p className="text-lg font-semibold leading-relaxed">
                "Success is the sum of small efforts repeated day in and day out."
              </p>
            </div>
          </div>
        </div>

        {/* Upcoming Exams Preview */}
        {upcomingExams > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Upcoming Exams</h2>
              </div>
              <Link 
                to="/exams"
                className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exams
                .filter(e => new Date(e.examDate) > new Date())
                .slice(0, 3)
                .map((exam) => {
                  const daysUntil = Math.ceil((new Date(exam.examDate) - new Date()) / (1000 * 60 * 60 * 24));
                  return (
                    <div 
                      key={exam._id}
                      className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-100"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 flex-1">{exam.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          daysUntil <= 7 ? 'bg-red-200 text-red-700' : 'bg-orange-200 text-orange-700'
                        }`}>
                          {daysUntil}d
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(exam.examDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;