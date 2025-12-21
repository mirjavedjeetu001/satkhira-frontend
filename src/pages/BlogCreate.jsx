import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { blogApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function BlogCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    titleBn: '',
    content: '',
    contentBn: '',
    excerpt: '',
    featuredImage: '',
    tags: '',
  });
  const [errors, setErrors] = useState({});

  const createMutation = useMutation({
    mutationFn: (data) => blogApi.create(data),
    onSuccess: () => {
      navigate('/blogs');
      alert('Blog submitted successfully! It will be published after admin approval.');
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || 'Failed to create blog. Please try again.';
      alert(message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const blogData = {
      ...formData,
      tags: formData.tags
        ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [],
    };

    // Remove empty optional fields
    Object.keys(blogData).forEach((key) => {
      if (!blogData[key] || (Array.isArray(blogData[key]) && blogData[key].length === 0)) {
        delete blogData[key];
      }
    });

    createMutation.mutate(blogData);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Login Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to write a blog
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Write Your Story
            </h1>
            <p className="text-gray-600 mb-8">
              Share your experiences, insights, and stories about Satkhira District.
              Your blog will be published after admin approval.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title (English) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`input ${errors.title ? 'border-red-500' : ''}`}
                  placeholder="Enter blog title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* Title (Bangla) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (Bangla)
                </label>
                <input
                  type="text"
                  name="titleBn"
                  value={formData.titleBn}
                  onChange={handleChange}
                  className="input"
                  placeholder="শিরোনাম"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt (Short summary)
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows="2"
                  className="input"
                  placeholder="A brief summary of your blog (optional, max 200 characters)"
                  maxLength={200}
                />
              </div>

              {/* Content (English) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content (English) <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="12"
                  className={`input ${errors.content ? 'border-red-500' : ''}`}
                  placeholder="Write your blog content here..."
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-500">{errors.content}</p>
                )}
              </div>

              {/* Content (Bangla) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content (Bangla)
                </label>
                <textarea
                  name="contentBn"
                  value={formData.contentBn}
                  onChange={handleChange}
                  rows="12"
                  className="input"
                  placeholder="বাংলায় কন্টেন্ট..."
                />
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  name="featuredImage"
                  value={formData.featuredImage}
                  onChange={handleChange}
                  className="input"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Optional: Provide a URL to an image for your blog
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="input"
                  placeholder="satkhira, tourism, culture (comma separated)"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Separate multiple tags with commas
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/blogs')}
                  className="btn btn-outline flex-1"
                  disabled={createMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Submitting...' : 'Submit Blog'}
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Your blog will be reviewed by administrators
                  before being published. You'll be able to see your published blogs
                  once they're approved.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
