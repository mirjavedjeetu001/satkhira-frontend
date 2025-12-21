import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { accessRequestApi } from '../services/api';

export default function Profile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedNewTypes, setSelectedNewTypes] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestNote, setRequestNote] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const allUserTypes = [
    { 
      value: 'GENERAL_USER', 
      label: 'General User', 
      icon: '👤', 
      color: 'blue',
      description: 'Browse and view all district information',
    },
    { 
      value: 'HOME_TUTOR', 
      label: 'Home Tutor', 
      icon: '👨‍🏫', 
      color: 'green',
      description: 'Offer tutoring services and create tutor profile',
    },
    { 
      value: 'TO_LET_OWNER', 
      label: 'To-Let Owner', 
      icon: '🏠', 
      color: 'purple',
      description: 'List rental properties for rent',
    },
    { 
      value: 'BUSINESS_OWNER', 
      label: 'Business Owner', 
      icon: '🏪', 
      color: 'orange',
      description: 'Promote and list your local business',
    },
    { 
      value: 'CONTENT_VOLUNTEER', 
      label: 'Content Volunteer', 
      icon: '✍️', 
      color: 'pink',
      description: 'Write blogs and submit tourist places',
    },
  ];

  const systemRoles = [
    { 
      value: 'SUPER_ADMIN', 
      label: 'Super Admin', 
      icon: '👑', 
      color: 'red',
      description: 'Full system access and control',
    },
    { 
      value: 'ADMIN', 
      label: 'Admin', 
      icon: '⚙️', 
      color: 'indigo',
      description: 'Administrative access to manage content',
    },
    { 
      value: 'AREA_MODERATOR', 
      label: 'Area Moderator', 
      icon: '🛡️', 
      color: 'teal',
      description: 'Moderate content for specific areas',
    },
    { 
      value: 'CONTENT_VOLUNTEER', 
      label: 'Content Volunteer', 
      icon: '✏️', 
      color: 'purple',
      description: 'Create and submit content for approval',
    },
  ];

  const currentUserTypes = user?.userTypes || [];
  const currentSystemRoles = user?.roles || [];
  const allCurrentRoles = [...currentUserTypes, ...currentSystemRoles];
  
  const availableTypes = allUserTypes.filter(
    type => !currentUserTypes.includes(type.value)
  );

  const handleRequestAccess = () => {
    if (selectedNewTypes.length === 0) {
      setError('Please select at least one user type to request');
      return;
    }
    setShowRequestModal(true);
  };

  const submitAccessRequest = async () => {
    try {
      setError('');
      setSuccess('');
      
      await accessRequestApi.create({ 
        userTypes: selectedNewTypes, 
        note: requestNote 
      });
      
      setSuccess(`Access request submitted for: ${selectedNewTypes.map(t => 
        allUserTypes.find(type => type.value === t)?.label
      ).join(', ')}. Admin will review your request.`);
      
      setSelectedNewTypes([]);
      setRequestNote('');
      setShowRequestModal(false);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request');
    }
  };

  const toggleNewType = (typeValue) => {
    setSelectedNewTypes(prev => 
      prev.includes(typeValue)
        ? prev.filter(t => t !== typeValue)
        : [...prev, typeValue]
    );
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { color: 'yellow', text: 'Pending Approval', icon: '⏳' },
      APPROVED: { color: 'green', text: 'Active', icon: '✅' },
      REJECTED: { color: 'red', text: 'Rejected', icon: '❌' },
      SUSPENDED: { color: 'gray', text: 'Suspended', icon: '🚫' },
    };
    const badge = badges[status] || badges.PENDING;
    return (
      <span className={`badge badge-${badge.color} text-xs`}>
        {badge.icon} {badge.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-5xl">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-8 text-white shadow-2xl mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl font-bold">
              {user?.fullName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-4xl font-black mb-1">My Profile</h1>
              <p className="text-primary-100 text-lg">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border-2 border-green-200 text-green-700 px-6 py-4 rounded-2xl mb-6 animate-fade-in flex items-center">
            <span className="text-2xl mr-3">✅</span>
            <span className="font-medium">{success}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6 animate-fade-in flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="card card-premium">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-3xl mr-3">📋</span>
                Personal Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Full Name</label>
                  <p className="text-lg text-gray-900 mt-1">{user?.fullName}</p>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-600">Email Address</label>
                  <p className="text-lg text-gray-900 mt-1">{user?.email}</p>
                </div>
                
                {user?.phone && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Phone Number</label>
                    <p className="text-lg text-gray-900 mt-1">{user?.phone}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-semibold text-gray-600">Account Status</label>
                  <div className="mt-2">
                    {!user?.approvalStatus || user?.approvalStatus === 'APPROVED' ? (
                      <span className="badge badge-success text-xs">
                        ✅ Active
                      </span>
                    ) : user?.approvalStatus === 'PENDING' ? (
                      <span className="badge badge-warning text-xs">
                        ⏳ Pending Approval
                      </span>
                    ) : user?.approvalStatus === 'REJECTED' ? (
                      <span className="badge badge-danger text-xs">
                        ❌ Rejected
                      </span>
                    ) : (
                      <span className="badge badge-info text-xs">
                        {user?.approvalStatus}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Access/Roles */}
            <div className="card card-premium">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-3xl mr-3">🎭</span>
                Current Access & Roles
              </h2>
              
              {allCurrentRoles.length > 0 ? (
                <div className="space-y-6">
                  {/* System Roles */}
                  {currentSystemRoles.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-600 uppercase mb-3 flex items-center">
                        <span className="mr-2">⚡</span>
                        System Roles
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {currentSystemRoles.map((roleValue) => {
                          const roleInfo = systemRoles.find(r => r.value === roleValue);
                          if (!roleInfo) return null;
                          
                          return (
                            <div
                              key={roleValue}
                              className={`p-4 rounded-xl border-2 border-${roleInfo.color}-200 bg-${roleInfo.color}-50 shadow-sm`}
                            >
                              <div className="flex items-center">
                                <span className="text-3xl mr-3">{roleInfo.icon}</span>
                                <div>
                                  <p className="font-bold text-gray-900">{roleInfo.label}</p>
                                  <p className="text-xs text-gray-600">{roleInfo.description}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* User Types */}
                  {currentUserTypes.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-gray-600 uppercase mb-3 flex items-center">
                        <span className="mr-2">👥</span>
                        User Types
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {currentUserTypes.map((typeValue) => {
                          const typeInfo = allUserTypes.find(t => t.value === typeValue);
                          if (!typeInfo) return null;
                          
                          return (
                            <div
                              key={typeValue}
                              className={`p-4 rounded-xl border-2 border-${typeInfo.color}-200 bg-${typeInfo.color}-50`}
                            >
                              <div className="flex items-center">
                                <span className="text-3xl mr-3">{typeInfo.icon}</span>
                                <div>
                                  <p className="font-bold text-gray-900">{typeInfo.label}</p>
                                  <p className="text-xs text-gray-600">{typeInfo.description}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg">No roles assigned yet</p>
                  <p className="text-sm mt-2">Request access below to get started</p>
                </div>
              )}
            </div>

            {/* My Content & Actions */}
            {currentUserTypes.length > 0 && (
              <div className="card card-premium">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-3xl mr-3">📝</span>
                  My Content & Actions
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {currentUserTypes.includes('HOME_TUTOR') && (
                    <a
                      href="/profile/add-home-tutor"
                      className="p-6 rounded-xl border-2 border-green-200 bg-green-50 hover:bg-green-100 transition-all hover:shadow-lg group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-4xl mr-4">👨‍🏫</span>
                          <div>
                            <p className="font-bold text-gray-900 text-lg">Add Home Tutor</p>
                            <p className="text-sm text-gray-600">Post your tutoring services</p>
                          </div>
                        </div>
                        <span className="text-2xl text-green-500 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </a>
                  )}
                  
                  {currentUserTypes.includes('TO_LET_OWNER') && (
                    <a
                      href="/profile/add-to-let"
                      className="p-6 rounded-xl border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 transition-all hover:shadow-lg group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-4xl mr-4">🏠</span>
                          <div>
                            <p className="font-bold text-gray-900 text-lg">Add To-Let</p>
                            <p className="text-sm text-gray-600">List your rental property</p>
                          </div>
                        </div>
                        <span className="text-2xl text-purple-500 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </a>
                  )}
                  
                  {currentUserTypes.includes('BUSINESS_OWNER') && (
                    <a
                      href="/profile/add-business"
                      className="p-6 rounded-xl border-2 border-orange-200 bg-orange-50 hover:bg-orange-100 transition-all hover:shadow-lg group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-4xl mr-4">🏪</span>
                          <div>
                            <p className="font-bold text-gray-900 text-lg">Add Business</p>
                            <p className="text-sm text-gray-600">Promote your business</p>
                          </div>
                        </div>
                        <span className="text-2xl text-orange-500 group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </a>
                  )}
                  
                  {currentUserTypes.includes('CONTENT_VOLUNTEER') && (
                    <>
                      <a
                        href="/profile/add-blog"
                        className="p-6 rounded-xl border-2 border-pink-200 bg-pink-50 hover:bg-pink-100 transition-all hover:shadow-lg group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-4xl mr-4">✍️</span>
                            <div>
                              <p className="font-bold text-gray-900 text-lg">Write Blog</p>
                              <p className="text-sm text-gray-600">Share your stories</p>
                            </div>
                          </div>
                          <span className="text-2xl text-pink-500 group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </a>
                      
                      <a
                        href="/profile/add-tourist-place"
                        className="p-6 rounded-xl border-2 border-pink-200 bg-pink-50 hover:bg-pink-100 transition-all hover:shadow-lg group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-4xl mr-4">🏞️</span>
                            <div>
                              <p className="font-bold text-gray-900 text-lg">Add Tourist Place</p>
                              <p className="text-sm text-gray-600">Submit tourist spots</p>
                            </div>
                          </div>
                          <span className="text-2xl text-pink-500 group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </a>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Request Additional Access */}
            {availableTypes.length > 0 && (
              <div className="card card-premium">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-3xl mr-3">➕</span>
                  Request Additional Access
                </h2>
                
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start space-x-2">
                    <span className="text-xl">💡</span>
                    <div className="text-sm text-blue-800">
                      <p className="font-semibold mb-1">Need more access?</p>
                      <p className="text-xs">Select additional user types below and submit a request. An administrator will review and approve your request.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {availableTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedNewTypes.includes(type.value)
                          ? `border-${type.color}-500 bg-${type.color}-50 shadow-lg`
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedNewTypes.includes(type.value)}
                        onChange={() => toggleNewType(type.value)}
                        className="sr-only"
                      />
                      <span className="text-3xl mr-3">{type.icon}</span>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{type.label}</p>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                      {selectedNewTypes.includes(type.value) && (
                        <span className="text-green-500 text-2xl">✓</span>
                      )}
                    </label>
                  ))}
                </div>

                <button
                  onClick={handleRequestAccess}
                  disabled={selectedNewTypes.length === 0}
                  className="btn btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Access Request ({selectedNewTypes.length} selected)
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Quick Stats */}
          <div className="space-y-6">
            {/* Account Summary */}
            <div className="card bg-gradient-to-br from-blue-500 to-blue-700 text-white">
              <h3 className="text-lg font-bold mb-4">Account Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Active Roles</span>
                  <span className="text-2xl font-bold">{allCurrentRoles.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Account Status</span>
                  <span className="text-sm font-semibold">
                    {!user?.approvalStatus || user?.approvalStatus === 'APPROVED' ? '✅ Active' : user?.approvalStatus === 'PENDING' ? '⏳ Pending' : '❌ Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Help & Support */}
            <div className="card card-premium">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <span className="mr-2">❓</span>
                Need Help?
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  <strong>Role Approval Time:</strong> Usually within 24-48 hours
                </p>
                <p>
                  <strong>Contact Admin:</strong> For urgent requests, contact the administrator
                </p>
                <p>
                  <strong>Multiple Roles:</strong> You can have multiple roles at the same time
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="modal-overlay" onClick={() => setShowRequestModal(false)}>
          <div className="modal-content max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">Confirm Access Request</h3>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  You are requesting access for:
                </p>
                <div className="space-y-2">
                  {selectedNewTypes.map(typeValue => {
                    const type = allUserTypes.find(t => t.value === typeValue);
                    return (
                      <div key={typeValue} className="flex items-center p-3 bg-gray-50 rounded-xl">
                        <span className="text-2xl mr-3">{type?.icon}</span>
                        <span className="font-medium">{type?.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mb-6">
                <label className="label">
                  Additional Note (Optional)
                </label>
                <textarea
                  value={requestNote}
                  onChange={(e) => setRequestNote(e.target.value)}
                  className="input min-h-24"
                  placeholder="Why do you need this access? (helps admin approve faster)"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={submitAccessRequest}
                  className="btn btn-primary flex-1"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
