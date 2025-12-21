import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { blogApi } from '../services/api';

export default function BlogList() {
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const response = await blogApi.getAll();
      return response.data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">Satkhira Stories</h1>
          <p className="text-xl mb-6">
            Explore stories, experiences, and insights about Satkhira District
          </p>
          <Link to="/blogs/create" className="btn btn-lg bg-white text-purple-600 hover:bg-gray-100">
            ✍️ Write Your Story
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No blogs yet
            </h2>
            <p className="text-gray-600 mb-6">
              Be the first to share your story about Satkhira!
            </p>
            <Link to="/blogs/create" className="btn btn-primary">
              Write First Blog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blogs/${blog.slug}`}
                className="group"
              >
                <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="h-56 bg-gradient-to-br from-purple-400 to-pink-500 relative">
                    {blog.featuredImage ? (
                      <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white text-6xl">
                        📝
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          blog.author?.fullName || 'User'
                        )}&background=random`}
                        alt={blog.author?.fullName}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="mr-2">{blog.author?.fullName}</span>
                      <span>•</span>
                      <span className="ml-2">
                        {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    {blog.titleBn && (
                      <p className="text-sm text-gray-500 mb-3">{blog.titleBn}</p>
                    )}
                    <p className="text-gray-600 line-clamp-3">
                      {blog.excerpt || blog.content.substring(0, 150) + '...'}
                    </p>
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {blog.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center text-primary-600 font-semibold">
                        Read More
                        <svg
                          className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          className="w-4 h-4 mr-1"
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
                        {blog.viewCount || 0}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
