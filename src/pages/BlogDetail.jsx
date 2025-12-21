import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { blogApi } from '../services/api';

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const response = await blogApi.getBySlug(slug);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Blog not found</h2>
          <Link to="/blogs" className="btn btn-primary">
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Featured Image */}
      {blog.featuredImage && (
        <div className="bg-black">
          <div className="container mx-auto">
            <div className="h-[400px] relative">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/blogs"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blogs
          </Link>

          <article className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            {/* Header */}
            <div className="border-b pb-6 mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                {blog.title}
              </h1>
              {blog.titleBn && (
                <h2 className="text-2xl text-gray-600 mb-4">{blog.titleBn}</h2>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      blog.author?.fullName || 'User'
                    )}&background=random`}
                    alt={blog.author?.fullName}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                  <div>
                    <div className="font-semibold">{blog.author?.fullName}</div>
                    <div className="text-sm">
                      {blog.author?.role?.replace('_', ' ')}
                    </div>
                  </div>
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(
                    'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  {blog.viewCount} views
                </div>
              </div>

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {blog.content}
              </div>

              {blog.contentBn && (
                <div className="mt-8 pt-8 border-t">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {blog.contentBn}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/blogs')}
                  className="btn btn-outline"
                >
                  ← More Stories
                </button>
                <button
                  onClick={() => navigate('/blogs/create')}
                  className="btn btn-primary"
                >
                  ✍️ Write Your Story
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
