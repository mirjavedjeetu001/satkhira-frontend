import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../../services/api';

export default function CreateUser() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userTypes: [],
    roles: [],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const userTypeOptions = [
    { value: 'GENERAL_USER', label: 'General User', icon: '👤', description: 'Browse all content' },
    { value: 'HOME_TUTOR', label: 'Home Tutor', icon: '👨‍🏫', description: 'Create tutor profile' },
    { value: 'TO_LET_OWNER', label: 'To-Let Owner', icon: '🏠', description: 'List properties' },
    { value: 'BUSINESS_OWNER', label: 'Business Owner', icon: '🏪', description: 'List businesses' },
    { value: 'CONTENT_VOLUNTEER', label: 'Content Volunteer', icon: '✍️', description: 'Write blogs' },
  ];

  const roleOptions = [
    { value: 'GENERAL_USER', label: 'General User', icon: '👤' },
    { value: 'CONTENT_VOLUNTEER', label: 'Content Volunteer', icon: '✍️' },
    { value: 'AREA_MODERATOR', label: 'Area Moderator', icon: '👮' },
    { value: 'ADMIN', label: 'Admin', icon: '⚙️' },
    { value: 'SUPER_ADMIN', label: 'Super Admin', icon: '👑' },
  ];

  const createUserMutation = useMutation({
    mutationFn: (data) => authApi.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setSuccess('User created successfully!');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        userTypes: [],
        roles: [],
      });
      setError('');
      setTimeout(() => setSuccess(''), 5000);
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to create user');
      setSuccess('');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleUserType = (type) => {
    setFormData(prev => ({
      ...prev,
      userTypes: prev.userTypes.includes(type)
        ? prev.userTypes.filter(t => t !== type)
        : [...prev.userTypes, type]
    }));
  };

  const toggleRole = (role) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.userTypes.length === 0) {
      setError('Please select at least one user type');
      return;
    }

    // Submit
    const submitData = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      userTypes: formData.userTypes,
      roles: formData.roles.length > 0 ? formData.roles : ['GENERAL_USER'],
    };

    createUserMutation.mutate(submitData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Create New User</h1>
        <p className="page-subtitle">Add a new user to the system with roles and permissions</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl">
          ❌ {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="card max-w-4xl">
        {/* Basic Information */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">👤</span>
            Basic Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="input"
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="user@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input"
                placeholder="+880 1XXX-XXXXXX"
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">🔒</span>
            Password
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="Minimum 6 characters"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
                placeholder="Re-enter password"
                required
              />
            </div>
          </div>
        </div>

        {/* User Types */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">🎭</span>
            User Types <span className="text-red-500 ml-1">*</span>
          </h2>
          <p className="text-sm text-gray-600 mb-4">Select one or more user types</p>
          <div className="grid md:grid-cols-2 gap-4">
            {userTypeOptions.map((type) => (
              <label
                key={type.value}
                className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.userTypes.includes(type.value)
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.userTypes.includes(type.value)}
                  onChange={() => toggleUserType(type.value)}
                  className="sr-only"
                />
                <div className="flex items-start w-full">
                  <span className="text-3xl mr-3">{type.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 mb-1">{type.label}</p>
                    <p className="text-xs text-gray-600">{type.description}</p>
                  </div>
                  {formData.userTypes.includes(type.value) && (
                    <span className="text-blue-600 text-xl">✓</span>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Roles */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">🛡️</span>
            System Roles (Optional)
          </h2>
          <p className="text-sm text-gray-600 mb-4">Assign administrative roles if needed</p>
          <div className="grid md:grid-cols-3 gap-4">
            {roleOptions.map((role) => (
              <label
                key={role.value}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.roles.includes(role.value)
                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.roles.includes(role.value)}
                  onChange={() => toggleRole(role.value)}
                  className="sr-only"
                />
                <span className="text-2xl mr-2">{role.icon}</span>
                <span className="font-bold text-gray-900 flex-1">{role.label}</span>
                {formData.roles.includes(role.value) && (
                  <span className="text-purple-600 text-xl">✓</span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={createUserMutation.isPending}
            className="btn btn-primary flex-1"
          >
            {createUserMutation.isPending ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating User...
              </span>
            ) : (
              <>
                <span className="mr-2">➕</span>
                Create User
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
