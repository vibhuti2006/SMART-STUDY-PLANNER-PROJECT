import { useApiQuery, useApiMutation } from '../hooks/useApi';
import { subjectsAPI } from '../services/api';
import PomodoroTimer from '../components/PomodoroTimer';
import api from '../services/api';
import { format } from 'date-fns';
import { Clock, CheckCircle, TrendingUp, Calendar } from 'lucide-react';

const Pomodoro = () => {
  const { data: subjectsData } = useApiQuery(['subjects'], subjectsAPI.getAll);
  const subjects = subjectsData?.data || [];

  // Fetch recent sessions
  const { data: sessionsData, refetch: refetchSessions } = useApiQuery(
    ['sessions', 'recent'],
    () => api.get('/study-sessions')
  );
  const allSessions = sessionsData?.data || [];
  const recentSessions = allSessions.slice(0, 5);

  // Mutation for creating sessions
  const createSessionMutation = useApiMutation(
    (sessionData) => api.post('/study-sessions', sessionData),
    {
      onSuccess: () => {
        refetchSessions();
      }
    }
  );

  const handleSessionComplete = async (sessionData) => {
    try {
      await createSessionMutation.mutateAsync(sessionData);
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Calculate today's stats
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todaySessions = allSessions.filter(s => 
    new Date(s.startTime) >= todayStart
  );

  const todayStudyTime = todaySessions.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
  const todayAvgProductivity = todaySessions.length > 0
    ? todaySessions.reduce((sum, s) => sum + (s.productivity || 5), 0) / todaySessions.length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Pomodoro Timer</h1>
          <p className="text-lg text-gray-600">Stay focused and track your study sessions</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium opacity-90">Today's Sessions</h3>
            </div>
            <p className="text-3xl font-bold">{todaySessions.length}</p>
            <p className="text-sm opacity-80 mt-1">Completed</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium opacity-90">Study Time</h3>
            </div>
            <p className="text-3xl font-bold">{formatDuration(todayStudyTime)}</p>
            <p className="text-sm opacity-80 mt-1">Today</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-medium opacity-90">Avg Productivity</h3>
            </div>
            <p className="text-3xl font-bold">{todayAvgProductivity.toFixed(1)}/10</p>
            <p className="text-sm opacity-80 mt-1">Today's average</p>
          </div>
        </div>

        {/* Main Timer */}
        <div className="max-w-2xl mx-auto mb-8">
          <PomodoroTimer 
            subjects={subjects}
            onSessionComplete={handleSessionComplete}
          />
        </div>

        {/* Recent Sessions */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                Recent Sessions
              </h2>
              <Clock className="w-6 h-6 text-gray-400" />
            </div>

            {recentSessions.length > 0 ? (
              <div className="space-y-4">
                {recentSessions.map((session) => (
                  <div
                    key={session._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl hover:from-gray-100 transition-all border border-gray-100"
                  >
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {session.subjectId?.name || 'General Study'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {session.topicsCovered?.join(', ') || 'No topics specified'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(session.startTime), 'MMM dd, yyyy • hh:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:text-right">
                      <div>
                        <div className="text-lg font-bold text-gray-900">
                          {formatDuration(session.durationMinutes)}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <TrendingUp className="w-4 h-4" />
                          <span>{session.productivity || 5}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <p className="text-lg text-gray-600">No study sessions yet</p>
                <p className="text-sm text-gray-500 mt-1">Start your first Pomodoro above!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;