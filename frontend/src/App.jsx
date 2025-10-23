import { Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, logout } = useAuth();
  return (
    <div className="App">
      <Outlet />
      {user && (
        <nav className="fixed bottom-4 right-4 z-50">
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition">
            Logout
          </button>
        </nav>
      )}
    </div>
  );
}

export default App;