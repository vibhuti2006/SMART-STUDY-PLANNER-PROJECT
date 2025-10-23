// import { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { Bars3Icon, XMarkIcon, UserCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline';  // ADD ChartBarIcon

// const Layout = ({ children }) => {
//   const { user, logout } = useAuth();
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out`}>
//         <div className="flex items-center justify-between p-4 border-b">
//           <h2 className="text-xl font-bold text-gray-900">Smart Study</h2>
//           <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
//             <XMarkIcon className="h-6 w-6 text-gray-500" />
//           </button>
//         </div>
//         <nav className="mt-6 px-4">
//           <a href="/dashboard" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100">
//             <span className="ml-3">Dashboard</span>
//           </a>
//           <a href="/subjects" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 mt-2">
//             <span className="ml-3">Subjects</span>
//           </a>
//           <a href="/exams" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 mt-2">
//             <span className="ml-3">Exams</span>
//           </a>
//           <a href="/schedule" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 mt-2">
//             <span className="ml-3">Schedule</span>
//           </a>
//           <a href="/analytics" className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 mt-2"> 
//             <ChartBarIcon className="h-5 w-5 mr-3" />
//             <span className="ml-1">Analytics</span>
//           </a>
//         </nav>
//       </div>
//       {/* Mobile sidebar overlay */}
//       {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40" onClick={() => setSidebarOpen(false)} />}
//       {/* Main content */}
//       <div className="lg:ml-64">
//         {/* Header */}
//         <header className="bg-white shadow-sm p-4 flex items-center justify-between">
//           <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
//             <Bars3Icon className="h-6 w-6 text-gray-500" />
//           </button>
//           <h1 className="text-2xl font-bold text-gray-900">{children.props?.title || 'Dashboard'}</h1>
//           <div className="flex items-center space-x-4">
//             <UserCircleIcon className="h-8 w-8 text-gray-500" />
//             <span className="text-sm text-gray-700">{user?.email || 'User'}</span>
//             <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
//               Logout
//             </button>
//           </div>
//         </header>
//         {/* Page content */}
//         <main className="p-6">{children}</main>
//       </div>
//     </div>
//   );
// };

// export default Layout;


import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  CalendarCheck, 
  BarChart3, 
  Clock,
  LogOut, 
  User,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/subjects', icon: BookOpen, label: 'Subjects' },
    { path: '/exams', icon: Calendar, label: 'Exams' },
    { path: '/schedule', icon: CalendarCheck, label: 'Schedule' },
    { path: '/pomodoro', icon: Clock, label: 'Pomodoro' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Smart Study</h1>
              <p className="text-xs text-gray-500">Planner</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? '' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-3 mb-3 px-4 py-2">
            <div className="p-2 bg-gray-100 rounded-full">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
              <p className="text-xs text-gray-500">{user?.email || "Student"}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm border-b border-gray-100 px-4 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Smart Study</h1>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;