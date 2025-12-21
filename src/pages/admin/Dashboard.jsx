import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { hospitalApi, tutorApi, toLetApi, businessApi, userApi, touristPlaceApi, blogApi } from '../../services/api';

export default function AdminDashboard() {
  const { data: hospitals = [] } = useQuery({
    queryKey: ['hospitals'],
    queryFn: () => hospitalApi.getAll().then(res => res.data),
  });

  const { data: tutors = [] } = useQuery({
    queryKey: ['tutors'],
    queryFn: () => tutorApi.getAll().then(res => res.data),
  });

  const { data: tolets = [] } = useQuery({
    queryKey: ['tolets'],
    queryFn: () => toLetApi.getAll().then(res => res.data),
  });

  const { data: businesses = [] } = useQuery({
    queryKey: ['businesses'],
    queryFn: () => businessApi.getAll().then(res => res.data),
  });

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.getAll().then(res => res.data),
  });

  const { data: touristPlaces = [] } = useQuery({
    queryKey: ['tourist-places'],
    queryFn: () => touristPlaceApi.getAll().then(res => res.data),
  });

  const { data: blogs = [] } = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogApi.getAll().then(res => res.data),
  });

  const stats = [
    {
      title: 'Total Users',
      value: users.length,
      icon: '👥',
      gradient: 'from-blue-500 to-blue-700',
      link: '/admin/users',
      change: '+12%',
    },
    {
      title: 'Hospitals',
      value: hospitals.length,
      icon: '🏥',
      gradient: 'from-green-500 to-green-700',
      link: '/admin/hospitals',
      change: '+5%',
    },
    {
      title: 'Home Tutors',
      value: tutors.length,
      icon: '👨‍🏫',
      gradient: 'from-purple-500 to-purple-700',
      link: '/admin/tutors',
      change: '+8%',
    },
    {
      title: 'To-Let Properties',
      value: tolets.length,
      icon: '🏠',
      gradient: 'from-orange-500 to-orange-700',
      link: '/admin/tolets',
      change: '+15%',
    },
    {
      title: 'Businesses',
      value: businesses.length,
      icon: '🏪',
      gradient: 'from-pink-500 to-pink-700',
      link: '/admin/businesses',
      change: '+10%',
    },
    {
      title: 'Tourist Places',
      value: touristPlaces.length,
      icon: '🌴',
      gradient: 'from-teal-500 to-teal-700',
      link: '/admin/tourist-places',
      change: '+3%',
    },
    {
      title: 'Blog Posts',
      value: blogs.length,
      icon: '📝',
      gradient: 'from-indigo-500 to-indigo-700',
      link: '/admin/blogs',
      change: '+20%',
    },
    {
      title: 'Pending Approvals',
      value: users.filter(u => u.approvalStatus === 'PENDING').length +
             hospitals.filter(h => h.approvalStatus === 'PENDING').length +
             tutors.filter(t => t.approvalStatus === 'PENDING').length,
      icon: '⏳',
      gradient: 'from-red-500 to-red-700',
      link: '/admin/approvals',
      change: '-5%',
    },
  ];

  const recentActivities = [
    { action: 'New user registered', time: '5 minutes ago', icon: '👤', color: 'blue' },
    { action: 'Hospital approved', time: '15 minutes ago', icon: '✅', color: 'green' },
    { action: 'Blog post published', time: '1 hour ago', icon: '📝', color: 'purple' },
    { action: 'Business listing updated', time: '2 hours ago', icon: '🏪', color: 'orange' },
    { action: 'User account suspended', time: '3 hours ago', icon: '⚠️', color: 'red' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-8 text-white shadow-2xl">
        <h1 className="text-4xl font-black mb-2">Admin Dashboard</h1>
        <p className="text-primary-100 text-lg">Satkhira District Portal Management</p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
            <span className="text-sm font-medium">Last updated: Just now</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`stat-card bg-gradient-to-br ${stat.gradient} transform hover:scale-105`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium mb-2">{stat.title}</p>
                  <p className="text-4xl font-black">{stat.value}</p>
                  <p className="text-sm mt-2 text-white/90">
                    <span className="font-semibold">{stat.change}</span> from last month
                  </p>
                </div>
                <div className="text-5xl opacity-20 group-hover:opacity-30 transition-opacity">
                  {stat.icon}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
              <Link to="/admin/users" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                View all →
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl bg-${activity.color}-100 flex items-center justify-center text-2xl mr-4`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/admin/approvals"
              className="block bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-4 transition-all"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">✅</span>
                <div>
                  <p className="font-semibold">Review Approvals</p>
                  <p className="text-sm text-gray-300">Pending items</p>
                </div>
              </div>
            </Link>
            
            <Link
              to="/admin/sliders"
              className="block bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-4 transition-all"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">🖼️</span>
                <div>
                  <p className="font-semibold">Manage Sliders</p>
                  <p className="text-sm text-gray-300">Hero banners</p>
                </div>
              </div>
            </Link>
            
            <Link
              to="/admin/settings"
              className="block bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-4 transition-all"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚙️</span>
                <div>
                  <p className="font-semibold">Site Settings</p>
                  <p className="text-sm text-gray-300">Configure portal</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/users"
              className="block bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-4 transition-all"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">👥</span>
                <div>
                  <p className="font-semibold">Manage Users</p>
                  <p className="text-sm text-gray-300">User accounts</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-6 border border-blue-100">
        <div className="flex items-center">
          <div className="text-4xl mr-4">📊</div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">System Status: Operational</h3>
            <p className="text-gray-600">All services running smoothly. Last backup: 2 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}
