import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accessRequestApi } from '../../services/api';

export default function ManageAccessRequests() {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['access-requests'],
    queryFn: () => accessRequestApi.getAll().then(res => res.data),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => accessRequestApi.approve(id, adminNote),
    onSuccess: () => {
      queryClient.invalidateQueries(['access-requests']);
      setShowModal(false);
      setAdminNote('');
      setSelectedRequest(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => accessRequestApi.reject(id, adminNote),
    onSuccess: () => {
      queryClient.invalidateQueries(['access-requests']);
      setShowModal(false);
      setAdminNote('');
      setSelectedRequest(null);
    },
  });

  const handleAction = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setShowModal(true);
  };

  const confirmAction = () => {
    if (actionType === 'approve') {
      approveMutation.mutate(selectedRequest.id);
    } else {
      rejectMutation.mutate(selectedRequest.id);
    }
  };

  const userTypeLabels = {
    GENERAL_USER: { label: 'General User', icon: '👤' },
    HOME_TUTOR: { label: 'Home Tutor', icon: '👨‍🏫' },
    TO_LET_OWNER: { label: 'To-Let Owner', icon: '🏠' },
    BUSINESS_OWNER: { label: 'Business Owner', icon: '🏪' },
    CONTENT_VOLUNTEER: { label: 'Content Volunteer', icon: '✍️' },
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { color: 'warning', text: 'Pending', icon: '⏳' },
      APPROVED: { color: 'success', text: 'Approved', icon: '✅' },
      REJECTED: { color: 'danger', text: 'Rejected', icon: '❌' },
    };
    const badge = badges[status] || badges.PENDING;
    return (
      <span className={`badge badge-${badge.color} text-xs`}>
        {badge.icon} {badge.text}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const processedRequests = requests.filter(r => r.status !== 'PENDING');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Access Requests Management</h1>
        <p className="page-subtitle">Review and manage user access requests</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="stat-card bg-gradient-to-br from-yellow-400 to-orange-500">
          <div className="text-white/90 text-sm font-medium mb-1">Pending Requests</div>
          <div className="text-white text-3xl font-bold">{pendingRequests.length}</div>
        </div>
        <div className="stat-card bg-gradient-to-br from-green-400 to-emerald-500">
          <div className="text-white/90 text-sm font-medium mb-1">Approved</div>
          <div className="text-white text-3xl font-bold">
            {requests.filter(r => r.status === 'APPROVED').length}
          </div>
        </div>
        <div className="stat-card bg-gradient-to-br from-red-400 to-pink-500">
          <div className="text-white/90 text-sm font-medium mb-1">Rejected</div>
          <div className="text-white text-3xl font-bold">
            {requests.filter(r => r.status === 'REJECTED').length}
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">⏳</span>
            Pending Requests ({pendingRequests.length})
          </h2>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="border border-gray-200 rounded-xl p-6 bg-white hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{request.user?.fullName}</h3>
                    <p className="text-sm text-gray-600">{request.user?.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Requested: {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Requested Access:</p>
                  <div className="flex flex-wrap gap-2">
                    {request.requestedUserTypes?.map((type) => {
                      const typeInfo = userTypeLabels[type] || { label: type, icon: '📋' };
                      return (
                        <span
                          key={type}
                          className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-sm font-medium"
                        >
                          <span className="mr-1">{typeInfo.icon}</span>
                          {typeInfo.label}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {request.note && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-700 mb-1">User Note:</p>
                    <p className="text-sm text-gray-600">{request.note}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(request, 'approve')}
                    className="btn btn-success text-sm"
                    disabled={approveMutation.isPending}
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleAction(request, 'reject')}
                    className="btn btn-danger text-sm"
                    disabled={rejectMutation.isPending}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">📋</span>
            Processed Requests ({processedRequests.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Requested Access</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Admin Note</th>
                </tr>
              </thead>
              <tbody>
                {processedRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <div>
                        <div className="font-semibold text-gray-900">{request.user?.fullName}</div>
                        <div className="text-sm text-gray-600">{request.user?.email}</div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {request.requestedUserTypes?.map((type) => {
                          const typeInfo = userTypeLabels[type] || { label: type, icon: '📋' };
                          return (
                            <span key={type} className="badge badge-info text-xs">
                              {typeInfo.icon} {typeInfo.label}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td className="text-sm text-gray-600">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="text-sm text-gray-600">
                      {request.adminNote || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {requests.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No access requests yet</p>
        </div>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {actionType === 'approve' ? '✅ Approve' : '❌ Reject'} Access Request
            </h3>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-2">User:</p>
              <p className="text-gray-900">{selectedRequest?.user?.fullName}</p>
              <p className="text-sm text-gray-600">{selectedRequest?.user?.email}</p>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-2">Requested Access:</p>
              <div className="flex flex-wrap gap-2">
                {selectedRequest?.requestedUserTypes?.map((type) => {
                  const typeInfo = userTypeLabels[type] || { label: type, icon: '📋' };
                  return (
                    <span key={type} className="badge badge-primary text-xs">
                      {typeInfo.icon} {typeInfo.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Note (Optional)
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="input"
                rows="3"
                placeholder="Add a note about this decision..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmAction}
                className={`btn ${actionType === 'approve' ? 'btn-success' : 'btn-danger'} flex-1`}
                disabled={approveMutation.isPending || rejectMutation.isPending}
              >
                {approveMutation.isPending || rejectMutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Confirm ${actionType === 'approve' ? 'Approval' : 'Rejection'}`
                )}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setAdminNote('');
                }}
                className="btn btn-secondary flex-1"
                disabled={approveMutation.isPending || rejectMutation.isPending}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
