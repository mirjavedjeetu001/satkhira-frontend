import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(credentials);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-md w-full space-y-8 relative z-10 animate-fade-in">
        {/* Logo Section */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl flex items-center justify-center shadow-2xl mb-4 transform hover:rotate-6 transition-transform">
            <span className="text-4xl text-white">🏛️</span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to Satkhira District Portal
          </p>
          <p className="mt-2 text-sm text-gray-500">
            New here?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">
              Create an account →
            </Link>
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center animate-fade-in">
                <span className="text-2xl mr-3">⚠️</span>
                <span className="font-medium">{error}</span>
              </div>
            )}
            
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="label flex items-center">
                <span className="text-xl mr-2">📧</span>
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input focus-ring"
                  placeholder="your@email.com"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="label flex items-center">
                <span className="text-xl mr-2">🔒</span>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="input focus-ring pr-12"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full flex items-center justify-center text-lg py-4"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <span className="ml-2">→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Official Portal of Satkhira District
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Managed by District Administration
          </p>
        </div>
      </div>
    </div>
  );
}
