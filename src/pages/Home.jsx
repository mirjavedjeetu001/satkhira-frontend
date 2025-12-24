import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import HeroSlider from '../components/HeroSlider';
import { touristPlaceApi, blogApi } from '../services/api';

export default function Home() {
  const { data: touristPlaces = [] } = useQuery({
    queryKey: ['tourist-places-featured'],
    queryFn: async () => {
      const response = await touristPlaceApi.getAll();
      const data = Array.isArray(response.data) ? response.data : [];
      return data.slice(0, 6);
    },
  });

  const { data: blogs = [] } = useQuery({
    queryKey: ['blogs-featured'],
    queryFn: async () => {
      const response = await blogApi.getAll();
      const data = Array.isArray(response.data) ? response.data : [];
      return data.slice(0, 3);
    },
  });

  const categories = [
    {
      title: 'Hospitals',
      titleBn: 'হাসপাতাল',
      icon: '🏥',
      path: '/hospitals',
      description: 'Find healthcare facilities',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Home Tutors',
      titleBn: 'হোম টিউটর',
      icon: '👨‍🏫',
      path: '/home-tutors',
      description: 'Connect with educators',
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'To-Let',
      titleBn: 'টু-লেট',
      icon: '🏠',
      path: '/to-lets',
      description: 'Rent properties',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Businesses',
      titleBn: 'ব্যবসা',
      icon: '🏪',
      path: '/businesses',
      description: 'Explore local businesses',
      gradient: 'from-orange-500 to-orange-600',
    },
    {
      title: 'Tourist Places',
      titleBn: 'পর্যটন স্থান',
      icon: '🌴',
      path: '/tourist-places',
      description: 'Discover attractions',
      gradient: 'from-teal-500 to-teal-600',
    },
    {
      title: 'Upazilas',
      titleBn: 'উপজেলা',
      icon: '📍',
      path: '/upazilas',
      description: 'Browse by location',
      gradient: 'from-red-500 to-red-600',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Explore Satkhira
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about Satkhira District
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.path}
                to={category.path}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${category.gradient}`} />
                  <div className="p-8">
                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{category.titleBn}</p>
                    <p className="text-gray-600">{category.description}</p>
                    <div className="mt-4 flex items-center text-primary-600 font-semibold">
                      Explore
                      <svg
                        className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform"
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tourist Places Section */}
      {touristPlaces.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-2">
                  Popular Places
                </h2>
                <p className="text-xl text-gray-600">
                  Visit the most beautiful spots in Satkhira
                </p>
              </div>
              <Link
                to="/tourist-places"
                className="btn btn-primary hidden md:block"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {touristPlaces.map((place) => (
                <div
                  key={place.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  <div className="h-48 bg-gradient-to-br from-teal-400 to-blue-500 relative">
                    {place.images && place.images[0] ? (
                      <img
                        src={place.images[0]}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white text-6xl">
                        🌴
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                      {place.placeType.replace('_', ' ')}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {place.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {place.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {place.upazila?.name}
                    </div>
                    <Link
                      to={`/tourist-places/${place.id}`}
                      className="text-primary-600 font-semibold hover:text-primary-700"
                    >
                      Learn More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 md:hidden">
              <Link to="/tourist-places" className="btn btn-primary">
                View All Places
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Blogs Section */}
      {blogs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-2">
                  Latest Stories
                </h2>
                <p className="text-xl text-gray-600">
                  Read about Satkhira from our community
                </p>
              </div>
              <Link to="/blogs" className="btn btn-primary hidden md:block">
                View All Blogs
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link
                  key={blog.id}
                  to={`/blogs/${blog.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-500 relative">
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
                        <span className="mr-2">By {blog.author?.fullName}</span>
                        <span>•</span>
                        <span className="ml-2">
                          {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-3">
                        {blog.excerpt || blog.content.substring(0, 150)}
                      </p>
                      <div className="mt-4 flex items-center text-primary-600 font-semibold">
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
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8 md:hidden">
              <Link to="/blogs" className="btn btn-primary">
                View All Blogs
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Share your stories, contribute information, and help build a comprehensive
            resource for Satkhira District
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="btn btn-lg bg-white text-primary-600 hover:bg-gray-100">
              Create Account
            </Link>
            <Link to="/blogs/create" className="btn btn-lg btn-outline border-white text-white hover:bg-white/10">
              Write a Blog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
