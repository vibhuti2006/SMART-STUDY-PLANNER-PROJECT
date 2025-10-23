import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Subjects from './pages/Subjects';
import Exams from './pages/Exams';
import Schedule from './pages/Schedule';
import Analytics from './pages/Analytics';
import Pomodoro from './pages/Pomodoro';

const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Outlet />
        </div>
      </AuthProvider>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <Layout>
              <Outlet />
            </Layout>
          </ProtectedRoute>
        ),
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/subjects', element: <Subjects /> },
          { path: '/exams', element: <Exams /> },
          { path: '/schedule', element: <Schedule /> },
          {path: '/analytics',element: <ProtectedRoute><Analytics /></ProtectedRoute>},
          {path: '/pomodoro',element: <ProtectedRoute><Pomodoro /></ProtectedRoute>}
        ],
      },
    ],
  },
]);

export default router;