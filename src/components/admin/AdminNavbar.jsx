import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminNavbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-white via-primary-50 to-white shadow-lg border-b-2 border-primary-100">
      <div className="px-8 py-5 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-xl">🏛️</span>
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">Admin Panel</h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {user?.fullName?.[0]?.toUpperCase() || 'A'}
            </div>
            <span className="text-sm font-semibold text-gray-700">{user?.fullName}</span>
          </div>
          <Link to="/" className="flex items-center space-x-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            <span>🌐</span>
            <span>View Site</span>
          </Link>
          <button onClick={logout} className="btn btn-primary text-sm shadow-md hover:shadow-lg transition-all">
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
