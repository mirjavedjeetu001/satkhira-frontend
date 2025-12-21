import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '../../services/api';

export default function ManageBlogs() {
  const queryClient = useQueryClient();
  const [selectedBlog, setSelectedBlog] = useState(null);

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['admin-blogs'],
    queryFn: async () => {
      const response = await blogApi.getAll();
      return response.data;
    },
  });

  const { data: pendingBlogs = [] } = useQuery({
    queryKey: ['pending-blogs'],
    queryFn: async () => {
      const response = await blogApi.getPending();
      return response.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id) => blogApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-blogs']);
      queryClient.invalidateQueries(['pending-blogs']);
      alert('Blog approved and published successfully!');
      setSelectedBlog(null);
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to approve blog');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => blogApi.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-blogs']);
      queryClient.invalidateQueries(['pending-blogs']);
      alert('Blog rejected.');
      setSelectedBlog(null);
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to reject blog');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => blogApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-blogs']);
      queryClient.invalidateQueries(['pending-blogs']);
      alert('Blog deleted successfully!');
      setSelectedBlog(null);
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to delete blog');
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleApprove = (id) => {
    if (window.confirm('Approve this blog and publish it?')) {
      approveMutation.mutate(id);
    }
  };

  const handleReject = (id) => {
    if (window.confirm('Reject this blog? It will not be published.')) {
      rejectMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Blogs</h1>
        <div className="text-sm text-gray-600">
          Total: {blogs.length} | Pending: {pendingBlogs.length}
        </div>
      </div>

      {/* Pending Approvals */}
      {pendingBlogs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-orange-600">
            🔔 Pending Approvals ({pendingBlogs.length})
          </h2>
          <div className="grid gap-4">
            {pendingBlogs.map((blog) => (
              <div key={blog.id} className="card bg-orange-50 border-2 border-orange-200">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{blog.title}</h3>
                    {blog.titleBn && (
                      <p className="text-sm text-gray-600 mb-2">{blog.titleBn}</p>
                    )}
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            blog.author?.fullName || 'User'
                          )}&background=random`}
                          alt={blog.author?.fullName}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                        {blog.author?.fullName}
                      </span>
                      <span>•</span>
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>👁️ {blog.viewCount || 0} views</span>
                    </div>
                    <p className="text-gray-700 mb-3">
                      {blog.excerpt || blog.content.substring(0, 200)}...
                    </p>
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {blog.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 min-w-[120px]">
                    <button
                      onClick={() => setSelectedBlog(blog)}
                      className="btn btn-outline btn-sm"
                    >
                      👁️ View Full
                    </button>
                    <button
                      onClick={() => handleApprove(blog.id)}
                      className="btn btn-success btn-sm"
                      disabled={approveMutation.isPending}
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => handleReject(blog.id)}
                      className="btn btn-danger btn-sm"
                      disabled={rejectMutation.isPending}
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Blogs */}
      <h2 className="text-xl font-bold mb-4">All Blogs ({blogs.length})</h2>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-semibold mb-2">No blogs yet</h2>
          <p className="text-gray-600">
            Users can submit blogs from the public blog page
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="card">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{blog.title}</h3>
                      {blog.titleBn && (
                        <p className="text-sm text-gray-600">{blog.titleBn}</p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        blog.status === 'APPROVED'
                          ? 'bg-green-100 text-green-700'
                          : blog.status === 'REJECTED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {blog.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                    <span className="flex items-center">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          blog.author?.fullName || 'User'
                        )}&background=random`}
                        alt={blog.author?.fullName}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      {blog.author?.fullName}
                    </span>
                    <span>•</span>
                    <span>
                      {blog.publishedAt
                        ? new Date(blog.publishedAt).toLocaleDateString()
                        : new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span>👁️ {blog.viewCount || 0} views</span>
                  </div>
                  <p className="text-gray-700 mb-2">
                    {blog.excerpt || blog.content.substring(0, 150)}...
                  </p>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.slice(0, 5).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 min-w-[120px]">
                  <button
                    onClick={() => setSelectedBlog(blog)}
                    className="btn btn-outline btn-sm"
                  >
                    👁️ View
                  </button>
                  {blog.approvedBy && (
                    <div className="text-xs text-gray-500">
                      Approved by: {blog.approvedByUser?.fullName}
                    </div>
                  )}
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="btn btn-danger btn-sm"
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Blog Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{selectedBlog.title}</h2>
                  {selectedBlog.titleBn && (
                    <p className="text-xl text-gray-600 mb-3">{selectedBlog.titleBn}</p>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        selectedBlog.author?.fullName || 'User'
                      )}&background=random`}
                      alt={selectedBlog.author?.fullName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-semibold">{selectedBlog.author?.fullName}</span>
                    <span>•</span>
                    <span>{new Date(selectedBlog.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>👁️ {selectedBlog.viewCount || 0} views</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedBlog.status === 'APPROVED'
                      ? 'bg-green-100 text-green-700'
                      : selectedBlog.status === 'REJECTED'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {selectedBlog.status}
                </span>
              </div>

              {selectedBlog.featuredImage && (
                <div className="mb-6">
                  <img
                    src={selectedBlog.featuredImage}
                    alt={selectedBlog.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedBlog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="prose max-w-none mb-6">
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {selectedBlog.content}
                </div>
                {selectedBlog.contentBn && (
                  <div className="mt-6 pt-6 border-t text-gray-700 whitespace-pre-line leading-relaxed">
                    {selectedBlog.contentBn}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-6 border-t">
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="btn btn-outline flex-1"
                >
                  Close
                </button>
                {selectedBlog.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleApprove(selectedBlog.id)}
                      className="btn btn-success flex-1"
                      disabled={approveMutation.isPending}
                    >
                      ✓ Approve & Publish
                    </button>
                    <button
                      onClick={() => handleReject(selectedBlog.id)}
                      className="btn btn-danger flex-1"
                      disabled={rejectMutation.isPending}
                    >
                      ✗ Reject
                    </button>
                  </>
                )}
                {selectedBlog.status !== 'PENDING' && (
                  <button
                    onClick={() => handleDelete(selectedBlog.id)}
                    className="btn btn-danger flex-1"
                    disabled={deleteMutation.isPending}
                  >
                    Delete Blog
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
