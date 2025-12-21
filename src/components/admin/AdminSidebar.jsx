import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/users/create', label: 'Create User', icon: '➕' },
    { path: '/admin/approvals', label: 'Approvals', icon: '✅' },
    { path: '/admin/access-requests', label: 'Access Requests', icon: '🔐' },
    { path: '/admin/settings', label: 'Site Settings', icon: '⚙️' },
  ];

  const contentItems = [
    { path: '/admin/hospitals', label: 'Hospitals', icon: '🏥' },
    { path: '/admin/tutors', label: 'Home Tutors', icon: '👨‍🏫' },
    { path: '/admin/tolets', label: 'To-Let', icon: '🏠' },
    { path: '/admin/businesses', label: 'Businesses', icon: '🏪' },
    { path: '/admin/upazilas', label: 'Upazilas', icon: '📍' },
    { path: '/admin/sliders', label: 'Hero Sliders', icon: '🖼️' },
    { path: '/admin/tourist-places', label: 'Tourist Places', icon: '🌴' },
    { path: '/admin/blogs', label: 'Blogs', icon: '📝' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-72 bg-white text-gray-800 min-h-screen shadow-2xl border-r border-gray-200">
      <div className="p-6">
        {/* User Profile */}
        <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-4 mb-6 border border-primary-100 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-md">
              {user?.fullName?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate text-gray-800">{user?.fullName || 'Admin'}</p>
              <p className="text-xs text-gray-600 truncate">{user?.email || 'admin@satkhira.gov'}</p>
            </div>
          </div>
        </div>

        <nav>
          {/* Main Menu */}
          <div className="mb-6">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-xl scale-105'
                        : 'hover:bg-gray-100 hover:translate-x-1 text-gray-700'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Content Management Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="px-4 mb-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Content Management
              </h3>
            </div>

            <ul className="space-y-2">
              {contentItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-xl scale-105'
                        : 'hover:bg-gray-100 hover:translate-x-1 text-gray-700'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}
