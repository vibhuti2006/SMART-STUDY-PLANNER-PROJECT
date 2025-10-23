// import { useState, useEffect } from 'react';
// import { useApiMutation } from '../hooks/useApi';
// import { studySessionsAPI } from '../services/api';
// import { PlayIcon, PauseIcon, StopIcon, ClockIcon } from '@heroicons/react/24/outline';

// const PomodoroTimer = ({ subjectId, examId }) => {
//   const [time, setTime] = useState(25 * 60);
//   const [isRunning, setIsRunning] = useState(false);
//   const [isBreak, setIsBreak] = useState(false);
//   const [startTime, setStartTime] = useState(null);
//   const [topicsCovered, setTopicsCovered] = useState(['General Review']);

//   const createSessionMutation = useApiMutation(studySessionsAPI.create, {
//     onSuccess: () => console.log('Session logged!'),
//     onError: (err) => console.error('Log error:', err),
//   });

//   useEffect(() => {
//     let interval;
//     if (isRunning && time > 0) {
//       interval = setInterval(() => setTime((t) => t - 1), 1000);
//     } else if (time === 0 && isRunning) {
//       setIsRunning(false);
//       const endTime = new Date();
//       setIsBreak(!isBreak);
//       setTime(isBreak ? 5 * 60 : 25 * 60);
//       if (startTime) {
//         createSessionMutation.mutate({
//           subjectId,
//           examId,
//           startTime: startTime.toISOString(),
//           endTime: endTime.toISOString(),
//           topicsCovered,
//           productivity: 7,
//         });
//       }
//     }
//     return () => clearInterval(interval);
//   }, [isRunning, time, isBreak, startTime, topicsCovered, subjectId, examId, createSessionMutation]);

//   const toggleTimer = () => {
//     setIsRunning(!isRunning);
//     if (!isRunning && !startTime) setStartTime(new Date());
//   };

//   const resetTimer = () => {
//     setIsRunning(false);
//     setTime(isBreak ? 5 * 60 : 25 * 60);
//     setStartTime(null);
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const progress = ((25 * 60 - time) / (25 * 60)) * 100;  // % complete

//   return (
//     <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl shadow-lg border border-green-200 text-center max-w-sm mx-auto">
//       <h2 className="text-xl font-bold mb-4 flex items-center justify-center text-gray-800">
//         <ClockIcon className="h-5 w-5 mr-2" />
//         {isBreak ? 'Break Time' : 'Pomodoro'}
//       </h2>
//       {/* FIXED: Ring progress + large time */}
//       <div className="relative mb-6">
//         <div className="flex items-center justify-center">
//           <div className="relative">
//             <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
//               <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
//                 <span className="text-3xl font-bold text-gray-800">{formatTime(time)}</span>
//               </div>
//             </div>
//             <div 
//               className="absolute top-2 left-2 w-28 h-28 border-4 border-green-500 rounded-full"
//               style={{ 
//                 background: `conic-gradient(green ${progress}%, transparent 0%)`,
//                 mask: `radial-gradient(circle at center, transparent ${time / (25 * 60) * 100}%, black 0%)`
//               }}
//             />
//           </div>
//         </div>
//       </div>
//       <div className="space-x-4 mb-4">
//         <button onClick={toggleTimer} className="bg-green-500 text-white p-4 rounded-full hover:bg-green-600 shadow-md transition-all" disabled={time === 0}>
//           {isRunning ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
//         </button>
//         <button onClick={resetTimer} className="bg-gray-500 text-white p-4 rounded-full hover:bg-gray-600 shadow-md transition-all">
//           <StopIcon className="h-6 w-6" />
//         </button>
//       </div>
//       <input
//         type="text"
//         placeholder="Topics (comma separated)"
//         value={topicsCovered.join(', ')}
//         onChange={(e) => setTopicsCovered(e.target.value.split(',').map(t => t.trim()).filter(t => t))}
//         className="w-full p-3 border border-gray-300 rounded-lg text-left bg-gray-500 shadow-sm focus:ring-2 focus:ring-green-500"
//         disabled={isRunning}
//       />
//     </div>
//   );
// };

// export default PomodoroTimer;



import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Coffee } from 'lucide-react';

const PomodoroTimer = ({ subjects = [], onSessionComplete }) => {
  // Timer settings
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work'); // 'work', 'break', 'longBreak'
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  // Session tracking
  const [selectedSubject, setSelectedSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [productivity, setProductivity] = useState(5);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize timer when duration or mode changes
  useEffect(() => {
    if (!isRunning) {
      const duration = mode === 'work' ? workDuration : 
                      mode === 'break' ? breakDuration : longBreakDuration;
      setTimeLeft(duration * 60);
    }
  }, [workDuration, breakDuration, longBreakDuration, mode, isRunning]);

  // Timer countdown
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleTimerComplete();
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    // Play sound
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log('Audio play failed:', err));
    }
    
    // Handle work session completion
    if (mode === 'work') {
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);
      
      // Save session to backend
      if (selectedSubject && sessionStartTime) {
        saveSession();
      }
      
      // Switch to break
      if (newSessionsCompleted % 4 === 0) {
        setMode('longBreak');
      } else {
        setMode('break');
      }
    } else {
      // Break complete, back to work
      setMode('work');
    }
    
    setIsRunning(false);
  };

  const saveSession = async () => {
    try {
      const sessionData = {
        subjectId: selectedSubject,
        startTime: sessionStartTime,
        endTime: new Date().toISOString(),
        topicsCovered: notes.split(',').map(t => t.trim()).filter(Boolean),
        notes: notes,
        productivity: productivity
      };
      
      if (onSessionComplete) {
        await onSessionComplete(sessionData);
      }
      
      // Reset for next session
      setNotes('');
      setSessionStartTime(null);
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const toggleTimer = () => {
    if (!isRunning && mode === 'work' && !sessionStartTime) {
      setSessionStartTime(new Date().toISOString());
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    const duration = mode === 'work' ? workDuration : 
                    mode === 'break' ? breakDuration : longBreakDuration;
    setTimeLeft(duration * 60);
    if (mode === 'work') {
      setSessionStartTime(null);
    }
  };

  const skipSession = () => {
    setIsRunning(false);
    if (mode === 'work') {
      setMode('break');
    } else {
      setMode('work');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalDuration = mode === 'work' ? workDuration * 60 : 
                         mode === 'break' ? breakDuration * 60 : longBreakDuration * 60;
    return ((totalDuration - timeLeft) / totalDuration) * 100;
  };

  const getModeColor = () => {
    if (mode === 'work') return '#ef4444';
    if (mode === 'break') return '#10b981';
    return '#3b82f6';
  };
//   console.log("subjects", subjects);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      {/* Mode indicator */}
      <div className="text-center mb-6">
        <div className="flex justify-center gap-2 mb-4">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            mode === 'work' ? 'bg-red-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600'
          }`}>
            Work
          </span>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            mode === 'break' ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600'
          }`}>
            Break
          </span>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            mode === 'longBreak' ? 'bg-blue-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600'
          }`}>
            Long Break
          </span>
        </div>
        <div className="text-sm text-gray-600">
          Sessions completed: {sessionsCompleted} {sessionsCompleted % 4 === 3 && '🎉 (Long break next!)'}
        </div>
      </div>

      {/* Timer display */}
      <div className="relative mb-8">
        <svg className="w-64 h-64 mx-auto transform -rotate-90">
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="128"
            cy="128"
            r="120"
            stroke={getModeColor()}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 120}`}
            strokeDashoffset={`${2 * Math.PI * 120 * (1 - getProgressPercentage() / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-800 mb-2">
              {formatTime(timeLeft)}
            </div>
            {mode !== 'work' && (
              <Coffee className="w-6 h-6 mx-auto text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={toggleTimer}
          className={`p-4 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-110 ${
            isRunning 
              ? 'bg-yellow-500 hover:bg-yellow-600' 
              : 'bg-green-500 hover:bg-green-600'
          } text-white`}
        >
          {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-110"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
        <button
          onClick={skipSession}
          className="p-4 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-110"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      {/* Session details (only show during work mode) */}
      {mode === 'work' && (
        <div className="space-y-4 border-t border-gray-200 pt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={isRunning}
            >
              <option value="">Choose a subject...</option>
              {subjects.data.map(subject => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topics covered (comma-separated)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Linear Algebra, Matrices"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Productivity Rating: {productivity}/10
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="10"
                value={productivity}
                onChange={(e) => setProductivity(parseInt(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${productivity * 10}%, #e5e7eb ${productivity * 10}%, #e5e7eb 100%)`
                }}
              />
              <span className="text-lg font-bold text-blue-600 min-w-[3rem] text-center">
                {productivity}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <details className="cursor-pointer group">
          <summary className="text-sm font-medium text-gray-700 mb-3 hover:text-blue-600 transition-colors list-none flex items-center justify-between">
            <span>⚙️ Timer Settings</span>
            <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="space-y-3 mt-3 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-600">Work Duration (min)</label>
              <input
                type="number"
                value={workDuration}
                onChange={(e) => setWorkDuration(parseInt(e.target.value) || 25)}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isRunning}
                min="1"
                max="60"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-600">Break Duration (min)</label>
              <input
                type="number"
                value={breakDuration}
                onChange={(e) => setBreakDuration(parseInt(e.target.value) || 5)}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isRunning}
                min="1"
                max="30"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-600">Long Break (min)</label>
              <input
                type="number"
                value={longBreakDuration}
                onChange={(e) => setLongBreakDuration(parseInt(e.target.value) || 15)}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isRunning}
                min="1"
                max="60"
              />
            </div>
          </div>
        </details>
      </div>

      {/* Hidden audio element for notification */}
      <audio 
        ref={audioRef} 
        src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZUA0PVanm77FgGAg+ltryxnMpBSp+zPLaizsIGGS57OihUhENT6Xh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDaizsIG2W67OihUhAOUKPh8bllHAU2jdXxxHUsBC1+zPDai" 
      />
    </div>
  );
};

export default PomodoroTimer;