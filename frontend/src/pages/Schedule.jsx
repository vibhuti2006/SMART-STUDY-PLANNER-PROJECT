// import { useApiQuery } from '../hooks/useApi';
// import { scheduleAPI } from '../services/api';
// import { Link } from 'react-router-dom';

// const Schedule = () => {
//   const { data: response, isLoading, error } = useApiQuery(['schedule'], scheduleAPI.getToday);
//   const schedule = response?.data || [];
//   console.log('Schedule response:', response, 'Error:', error);  // Debug

//   if (isLoading) {
//     return <div className="flex items-center justify-center min-h-screen bg-gray-50">
//       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       <span className="ml-2 text-gray-600">Generating schedule...</span>
//     </div>;
//   }

//   if (error) {
//     return <div className="bg-red-100 p-6 rounded-lg text-center">
//       <h3 className="text-lg font-semibold text-red-800 mb-2">Schedule Error</h3>
//       <p className="text-red-700 mb-4">Failed to load: {error.message}. Try adding subjects/exams.</p>
//       <Link to="/subjects" className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2">Add Subjects</Link>
//       <Link to="/exams" className="bg-green-600 text-white px-4 py-2 rounded-lg">Add Exams</Link>
//     </div>;
//   }

//   return (
//     <div>
//       <h1 className="text-3xl font-bold text-gray-900 mb-6">Today's Schedule</h1>
//       {schedule.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {schedule.slice(0, 3).map((session, index) => (
//             <div key={index} className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
//               <h3 className="text-xl font-bold text-gray-900 mb-2">{session.subjectName}</h3>
//               <p className="text-gray-600 mb-2">Date: {new Date(session.day).toLocaleDateString()}</p>
//               <p className="text-gray-600 mb-2">Topics: {session.topics.join(', ') || 'General review'}</p>
//               <p className="text-lg font-semibold text-blue-600">Duration: {session.durationMinutes} min</p>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="bg-white p-8 rounded-lg shadow text-center">
//           <h3 className="text-xl font-bold text-gray-900 mb-2">No Schedule Yet</h3>
//           <p className="text-gray-600 mb-4">Add subjects and exams to generate your personalized plan.</p>
//           <div className="space-x-4">
//             <Link to="/subjects" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
//               Add Subjects
//             </Link>
//             <Link to="/exams" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
//               Add Exams
//             </Link>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Schedule;





import { useApiQuery } from '../hooks/useApi';
import { scheduleAPI } from '../services/api';
import { Link } from 'react-router-dom';
import { Calendar, Clock, BookOpen, TrendingUp, Plus } from 'lucide-react';

const Schedule = () => {
  const { data: response, isLoading, error } = useApiQuery(['schedule'], scheduleAPI.getToday);
  const schedule = response?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Generating your personalized schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-red-200 p-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Unable to Generate Schedule</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {error.message || 'We need some information to create your personalized study plan.'}
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                to="/subjects" 
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
              >
                <Plus className="w-5 h-5" />
                Add Subjects
              </Link>
              <Link 
                to="/exams" 
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
              >
                <Plus className="w-5 h-5" />
                Add Exams
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Group schedule by day
  const groupedSchedule = schedule.reduce((acc, session) => {
    const day = session.dayOfWeek || new Date(session.day).toLocaleDateString('en-US', { weekday: 'long' });
    if (!acc[day]) acc[day] = [];
    acc[day].push(session);
    return acc;
  }, {});

  const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const sortedDays = Object.keys(groupedSchedule).sort((a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Study Schedule</h1>
          <p className="text-lg text-gray-600">Your personalized weekly study plan</p>
        </div>

        {schedule.length > 0 ? (
          <>
            {/* Weekly Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-700">Total Sessions</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {new Set(schedule.map(s => s.subjectName)).size}
                </p>
                <p className="text-sm text-gray-500 mt-1">To study</p>
              </div>
            </div>

            {/* Day-by-Day Schedule */}
            <div className="space-y-6">
              {sortedDays.map((day) => (
                <div key={day} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                    {day}
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({groupedSchedule[day].length} session{groupedSchedule[day].length !== 1 ? 's' : ''})
                    </span>
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedSchedule[day].map((session, index) => (
                      <div
                        key={index}
                        className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                      >
                        {/* Subject Name */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-600 rounded-lg">
                              <BookOpen className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              {session.subjectName}
                            </h3>
                          </div>
                        </div>

                        {/* Topics */}
                        {session.topics && session.topics.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-gray-600 mb-1">Topics:</p>
                            <div className="flex flex-wrap gap-1">
                              {session.topics.map((topic, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-white rounded-md text-xs text-gray-700 border border-blue-200"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Duration */}
                        <div className="flex items-center gap-2 p-2 bg-white rounded-lg">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-semibold text-gray-900">
                            {session.durationMinutes} minutes
                          </span>
                        </div>

                        {/* Completion Boost */}
                        {session.estimatedCompletionBoost && (
                          <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 rounded-lg">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-700 font-medium">
                              +{session.estimatedCompletionBoost}% progress
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="mt-8 text-center">
              <Link
                to="/pomodoro"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 font-semibold text-lg"
              >
                <Clock className="w-6 h-6" />
                Start Studying Now
              </Link>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Schedule Generated</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Add subjects and exams to generate your personalized study plan
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/subjects"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
              >
                <Plus className="w-5 h-5" />
                Add Subjects
              </Link>
              <Link
                to="/exams"
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
              >
                <Plus className="w-5 h-5" />
                Add Exams
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;