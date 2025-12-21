import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { upazilaApi } from '../services/api';

export default function UpazilaList() {
  const { data: upazilas, isLoading } = useQuery({
    queryKey: ['upazilas'],
    queryFn: () => upazilaApi.getAll().then(res => res.data),
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-3">Upazilas of Satkhira</h1>
          <h2 className="text-3xl mb-4">সাতক্ষীরার উপজেলা</h2>
          <p className="text-lg text-primary-100 max-w-2xl">
            Explore the {upazilas?.length || 7} upazilas of Satkhira District. 
            Click on any upazila to see hospitals, tutors, businesses, and more.
          </p>
        </div>
      </div>

      {/* Upazilas Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {upazilas?.map((upazila, index) => {
            const colors = [
              'from-blue-500 to-blue-600',
              'from-green-500 to-green-600',
              'from-purple-500 to-purple-600',
              'from-orange-500 to-orange-600',
              'from-teal-500 to-teal-600',
              'from-red-500 to-red-600',
              'from-indigo-500 to-indigo-600',
            ];
            const gradient = colors[index % colors.length];

            return (
              <Link
                key={upazila.id}
                to={`/upazilas/${upazila.slug}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden h-full">
                  <div className={`h-2 bg-gradient-to-r ${gradient}`} />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">📍</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded bg-gradient-to-r ${gradient} text-white`}>
                        Upazila
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                      {upazila.name}
                    </h2>
                    <p className="text-xl text-gray-600 mb-3">{upazila.nameBn}</p>
                    {upazila.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {upazila.description}
                      </p>
                    )}
                    <div className="mt-4 text-primary-600 group-hover:text-primary-700 font-medium text-sm flex items-center">
                      Explore <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
