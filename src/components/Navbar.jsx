import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { settingsApi } from '../services/api';

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: settingsData = [] } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await settingsApi.getAll();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Ensure settings is always an array
  const settings = Array.isArray(settingsData) ? settingsData : [];

  const getSetting = (key, defaultValue = '') => {
    if (!Array.isArray(settings)) return defaultValue;
    const setting = settings.find((s) => s.key === key);
    return setting ? setting.value : defaultValue;
  };

  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const mainNavigation = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Upazilas', path: '/upazilas', icon: '📍' },
  ];

  const servicesMenu = [
    { name: 'Hospitals', path: '/hospitals', icon: '🏥', desc: 'Healthcare facilities' },
    { name: 'Home Tutors', path: '/home-tutors', icon: '👨‍🏫', desc: 'Find educators' },
    { name: 'To-Let', path: '/to-lets', icon: '🏠', desc: 'Rent properties' },
    { name: 'Businesses', path: '/businesses', icon: '🏪', desc: 'Local businesses' },
  ];

  const otherLinks = [
    { name: 'Tourist Places', path: '/tourist-places', icon: '🌴' },
    { name: 'Blogs', path: '/blogs', icon: '📝' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-primary-600">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow group-hover:scale-105 transition-transform">
              <span className="text-xl">🏛️</span>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                {getSetting('site_name', 'সাতক্ষীরা')}
              </span>
              <p className="text-[10px] text-gray-500 font-medium">District Portal</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {mainNavigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-4 py-2 rounded-xl hover:bg-primary-50 transition-all duration-200 flex items-center space-x-2 font-medium text-gray-700 hover:text-primary-600"
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
            
            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                onBlur={() => setTimeout(() => setIsServicesOpen(false), 200)}
                className="px-4 py-2 rounded-xl hover:bg-primary-50 transition-all duration-200 flex items-center space-x-2 font-medium text-gray-700 hover:text-primary-600"
              >
                <span>📋</span>
                <span>Services</span>
                <span className="text-xs">{isServicesOpen ? '▲' : '▼'}</span>
              </button>
              
              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in">
                  {servicesMenu.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="block px-4 py-3 hover:bg-primary-50 transition-colors"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {otherLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-4 py-2 rounded-xl hover:bg-primary-50 transition-all duration-200 flex items-center space-x-2 font-medium text-gray-700 hover:text-primary-600"
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-xs">
                    {user?.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">{user?.fullName || user?.email || 'User'}</span>
                </Link>
                {isAdmin() && (
                  <Link
                    to="/admin"
                    className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center gap-1 font-medium"
                  >
                    <span>⚙️</span>
                    <span>Admin</span>
                  </Link>
                )}
                <button onClick={logout} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center gap-1 font-medium">
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary text-sm py-2">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary text-sm py-2">
                  Register →
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fade-in">
            <div className="space-y-2">
              {mainNavigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-3 rounded-xl hover:bg-primary-50 transition-colors font-medium text-gray-700"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
              
              <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase">Services</div>
              {servicesMenu.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-3 rounded-xl hover:bg-primary-50 transition-colors font-medium text-gray-700"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {otherLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-3 rounded-xl hover:bg-primary-50 transition-colors font-medium text-gray-700"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="border-t pt-4 mt-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-3 bg-gray-100 rounded-xl font-medium"
                    >
                      <span>👤</span>
                      <span>My Profile</span>
                    </Link>
                    {isAdmin() && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-3 bg-primary-600 text-white rounded-xl font-medium"
                      >
                        ⚙️ Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="w-full text-left px-4 py-3 bg-gray-100 rounded-xl font-medium"
                    >
                      🚪 Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 bg-gray-100 rounded-xl font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 bg-primary-600 text-white rounded-xl font-medium"
                    >
                      Register →
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
