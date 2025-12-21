import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { userApi } from '../../services/api';

export default function AdminUsers() {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => userApi.getAll().then(res => res.data),
  });

  const { data: pendingUsers } = useQuery({
    queryKey: ['pending-users'],
    queryFn: () => userApi.getPending().then(res => res.data),
  });

  const approveMutation = useMutation({
    mutationFn: userApi.approve,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users', 'pending-users']);
    },
  });

  const suspendMutation = useMutation({
    mutationFn: userApi.suspend,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Link to="/admin/users/create" className="btn btn-primary">
          <span className="mr-2">➕</span>
          Create New User
        </Link>
      </div>

      {pendingUsers?.length > 0 && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4">Pending Approvals ({pendingUsers.length})</h2>
          <div className="space-y-4">
            {pendingUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-medium">{user.fullName}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">
                    Types: {user.userTypes?.join(', ') || 'None'}
                  </p>
                </div>
                <button
                  onClick={() => approveMutation.mutate(user.id)}
                  className="btn btn-primary text-sm"
                  disabled={approveMutation.isPending}
                >
                  Approve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">All Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-3">{user.fullName}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        user.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-800'
                          : user.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3">
                    {user.status === 'ACTIVE' && (
                      <button
                        onClick={() => suspendMutation.mutate(user.id)}
                        className="text-sm text-red-600 hover:underline"
                        disabled={suspendMutation.isPending}
                      >
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
