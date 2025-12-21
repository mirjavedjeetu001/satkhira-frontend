import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    userTypes: [],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const userTypeOptions = [
    { 
      value: 'GENERAL_USER', 
      label: 'General User', 
      icon: '👤', 
      color: 'blue',
      description: 'Browse and view all district information. Access hospitals, tutors, businesses, and tourist places.',
      benefits: ['View all content', 'No posting abilities', 'Read blogs & reviews']
    },
    { 
      value: 'HOME_TUTOR', 
      label: 'Home Tutor', 
      icon: '👨‍🏫', 
      color: 'green',
      description: 'Register as an educator to offer tutoring services. Create your tutor profile visible to parents.',
      benefits: ['Create tutor profile', 'List subjects & classes', 'Receive student inquiries']
    },
    { 
      value: 'TO_LET_OWNER', 
      label: 'To-Let Owner', 
      icon: '🏠', 
      color: 'purple',
      description: 'Property owners can list rental properties. Post house, flat, or commercial space listings.',
      benefits: ['Post rental properties', 'Add photos & details', 'Connect with renters']
    },
    { 
      value: 'BUSINESS_OWNER', 
      label: 'Business Owner', 
      icon: '🏪', 
      color: 'orange',
      description: 'Promote your local business. List shops, restaurants, services in the district directory.',
      benefits: ['List your business', 'Add contact details', 'Reach local customers']
    },
    { 
      value: 'CONTENT_VOLUNTEER', 
      label: 'Content Volunteer', 
      icon: '✍️', 
      color: 'pink',
      description: 'Help build district content. Write blogs, submit tourist places, and contribute information.',
      benefits: ['Write blog posts', 'Submit tourist places', 'Help community']
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await registerUser(formData);
      setSuccess('Registration successful! Please wait for admin approval.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckbox = (value) => {
    setFormData(prev => ({
      ...prev,
      userTypes: prev.userTypes.includes(value)
        ? prev.userTypes.filter(t => t !== value)
        : [...prev.userTypes, value]
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-2xl w-full space-y-8 relative z-10 animate-fade-in">
        {/* Logo Section */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-600 to-purple-800 rounded-2xl flex items-center justify-center shadow-2xl mb-4 transform hover:rotate-6 transition-transform">
            <span className="text-4xl text-white">🏛️</span>
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-2">
            Join Our Community
          </h2>
          <p className="text-gray-600">
            Create your account on Satkhira District Portal
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">
              Sign in →
            </Link>
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-2xl flex items-center animate-fade-in">
                <span className="text-2xl mr-3">⚠️</span>
                <span className="font-medium">{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-2xl flex items-center animate-fade-in">
                <span className="text-2xl mr-3">✅</span>
                <span className="font-medium">{success}</span>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="label flex items-center">
                  <span className="text-xl mr-2">👤</span>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="input focus-ring"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="label flex items-center">
                  <span className="text-xl mr-2">📱</span>
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="input focus-ring"
                  placeholder="01XXXXXXXXX (Optional)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label flex items-center">
                <span className="text-xl mr-2">📧</span>
                Email Address
              </label>
              <input
                type="email"
                required
                className="input focus-ring"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Password */}
            <div>
              <label className="label flex items-center">
                <span className="text-xl mr-2">🔒</span>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input focus-ring pr-12"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

            {/* User Types */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="label mb-0">
                  Register as (select all that apply):
                </label>
                <span className="text-xs text-gray-500 italic">Multiple selections allowed</span>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                <div className="flex items-start space-x-2">
                  <span className="text-lg">💡</span>
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Choose your account type(s):</p>
                    <p className="text-xs text-blue-700">Select what you want to do on this platform. You can select multiple types if needed (e.g., be both a General User and Business Owner).</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-1 gap-3">
                {userTypeOptions.map((option) => (
                  <label 
                    key={option.value}
                    className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.userTypes.includes(option.value)
                        ? `border-${option.color}-500 bg-${option.color}-50 shadow-lg`
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.userTypes.includes(option.value)}
                      onChange={() => handleCheckbox(option.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center mb-2">
                      <span className="text-3xl mr-3">{option.icon}</span>
                      <div className="flex-1">
                        <span className="font-bold text-gray-900 text-lg">{option.label}</span>
                      </div>
                      {formData.userTypes.includes(option.value) && (
                        <span className="text-green-500 text-2xl">✓</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {option.benefits.map((benefit, idx) => (
                        <span key={idx} className="text-xs bg-white/50 px-2 py-1 rounded-full text-gray-700">
                          ✓ {benefit}
                        </span>
                      ))}
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * Your account will be reviewed by administrators before activation
              </p>
            </div>

            {/* Submit Button */}
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
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <span className="ml-2">→</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Section */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            By creating an account, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}
