// import { useApiQuery } from '../hooks/useApi';
// import { studySessionsAPI } from '../services/api';
// import { Pie, Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
// } from 'chart.js';

// ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

// const Analytics = () => {
//   const { data: response, isLoading } = useApiQuery(['analytics'], () => studySessionsAPI.getAnalytics('month'));
//   const stats = response?.data || { totalStudyTimeMinutes: 0, avgProductivity: 0, sessionsBySubject: {} };

//   if (isLoading) {
//     return <div className="flex items-center justify-center min-h-screen bg-gray-50">
//       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//       <span className="ml-2 text-gray-600">Loading analytics...</span>
//     </div>;
//   }

//   // Pie: Sessions by subject (proxy for time)
//   const pieData = {
//     labels: Object.keys(stats.sessionsBySubject),
//     datasets: [{
//       data: Object.values(stats.sessionsBySubject),
//       backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
//     }],
//   };

//   // Line: Mock sessions over time (extend with real data later)
//   const lineData = {
//     labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
//     datasets: [{
//       label: 'Sessions',
//       data: [12, 19, 3, 5],  // Mock; fetch real from backend
//       borderColor: 'rgb(75, 192, 192)',
//       backgroundColor: 'rgba(75, 192, 192, 0.2)',
//       tension: 0.1,
//     }],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: { position: 'top' },
//       title: { display: true, text: 'Sessions Over Time' },
//     },
//   };

//   return (
//     <div>
//       <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-lg text-gray-900 font-semibold mb-2">Total Study Time</h3>
//           <p className="text-3xl font-bold text-blue-600">{stats.totalStudyTimeMinutes} min</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-lg text-gray-900 font-semibold mb-2">Avg Productivity</h3>
//           <p className="text-3xl font-bold text-green-600">{stats.avgProductivity}/10</p>
//         </div>
//       </div>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-lg text-gray-900 font-semibold mb-4">Sessions per Subject</h3>
//           <Pie data={pieData} options={options} />
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-lg text-gray-900 font-semibold mb-4">Sessions Over Time</h3>
//           <Line data={lineData} options={options} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Analytics;



import { useState } from 'react';
import { useApiQuery } from '../hooks/useApi';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, Target, Award, Calendar } from 'lucide-react';
import api from '../services/api';

const Analytics = () => {
  const [period, setPeriod] = useState('week'); // 'week', 'month', 'all'
  
  const { data: analyticsData, isLoading } = useApiQuery(
    ['analytics', period],
    () => api.get(`/study-sessions/analytics?period=${period}`)
  );

  const analytics = analyticsData?.data || {
    totalSessions: 0,
    totalStudyTimeMinutes: 0,
    avgProductivity: 0,
    sessionsBySubject: {}
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const subjectData = Object.entries(analytics.sessionsBySubject).map(([subject, count]) => ({
    name: subject,
    sessions: count
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Study Analytics</h1>
            <p className="text-lg text-gray-600">Track your progress and performance</p>
          </div>
          <div className="flex gap-2">
            {['week', 'month', 'all'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  period === p
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {p === 'week' ? 'Week' : p === 'month' ? 'Month' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white transform hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium opacity-80">Total Study Time</span>
            </div>
            <div className="text-3xl font-bold mb-1">{formatTime(analytics.totalStudyTimeMinutes)}</div>
            <p className="text-sm opacity-80">Keep up the great work!</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white transform hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium opacity-80">Total Sessions</span>
            </div>
            <div className="text-3xl font-bold mb-1">{analytics.totalSessions}</div>
            <p className="text-sm opacity-80">Pomodoros completed</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white transform hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium opacity-80">Avg Productivity</span>
            </div>
            <div className="text-3xl font-bold mb-1">{analytics.avgProductivity.toFixed(1)}/10</div>
            <p className="text-sm opacity-80">
              {analytics.avgProductivity >= 7 ? 'Excellent!' : analytics.avgProductivity >= 5 ? 'Good job!' : 'Keep pushing!'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white transform hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 opacity-80" />
              <span className="text-sm font-medium opacity-80">Avg Session</span>
            </div>
            <div className="text-3xl font-bold mb-1">
              {analytics.totalSessions > 0 
                ? formatTime(Math.round(analytics.totalStudyTimeMinutes / analytics.totalSessions))
                : '0m'
              }
            </div>
            <p className="text-sm opacity-80">Per session duration</p>
          </div>
        </div>

        {/* Charts */}
        {subjectData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Bar Chart - Sessions by Subject */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                Sessions by Subject
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="sessions" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart - Subject Distribution */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-purple-500 rounded-full"></div>
                Study Distribution
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="sessions"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center mb-8 border border-gray-100">
            <Target className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Study Data Yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start using the Pomodoro timer to track your study sessions and see your analytics here!
            </p>
            <a
              href="/pomodoro"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
            >
              Start Studying
            </a>
          </div>
        )}

        {/* Study Insights & Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-green-500 rounded-full"></div>
              Study Insights
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Most Studied Subject</p>
                  <p className="text-lg font-bold text-gray-900">
                    {subjectData.length > 0 
                      ? subjectData.reduce((prev, current) => 
                          prev.sessions > current.sessions ? prev : current
                        ).name
                      : 'N/A'
                    }
                  </p>
                </div>
                <Award className="w-8 h-8 text-blue-600" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Daily Average</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatTime(
                      period === 'week' 
                        ? Math.round(analytics.totalStudyTimeMinutes / 7)
                        : period === 'month'
                        ? Math.round(analytics.totalStudyTimeMinutes / 30)
                        : Math.round(analytics.totalStudyTimeMinutes / 90)
                    )}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-green-600" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Focus Sessions</p>
                  <p className="text-lg font-bold text-gray-900">{analytics.totalSessions}</p>
                </div>
                <Target className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Productivity Tips */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
              Productivity Tips
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl border border-blue-100">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700">
                  Take regular breaks every 25-30 minutes to maintain focus and prevent burnout.
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-transparent rounded-xl border border-green-100">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700">
                  Study difficult subjects when you're most alert - usually in the morning.
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-xl border border-purple-100">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700">
                  Mix up subjects throughout the day to keep your brain engaged and active.
                </p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-transparent rounded-xl border border-orange-100">
                <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700">
                  Aim for at least 2-3 hours of focused study daily for optimal learning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;