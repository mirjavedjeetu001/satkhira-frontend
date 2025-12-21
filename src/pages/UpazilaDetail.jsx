import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { upazilaApi, hospitalApi, tutorApi, toLetApi, businessApi, touristPlaceApi } from '../services/api';

export default function UpazilaDetail() {
  const { slug } = useParams();

  // Fetch upazila info
  const { data: upazila, isLoading: upazilaLoading } = useQuery({
    queryKey: ['upazila', slug],
    queryFn: () => upazilaApi.getBySlug(slug).then(res => res.data),
  });

  // Fetch all content for this upazila
  const { data: hospitals = [] } = useQuery({
    queryKey: ['hospitals', upazila?.id],
    queryFn: () => hospitalApi.getAll({ upazilaId: upazila.id }).then(res => res.data),
    enabled: !!upazila?.id,
  });

  const { data: tutors = [] } = useQuery({
    queryKey: ['tutors', upazila?.id],
    queryFn: () => tutorApi.getAll({ upazilaId: upazila.id }).then(res => res.data),
    enabled: !!upazila?.id,
  });

  const { data: tolets = [] } = useQuery({
    queryKey: ['tolets', upazila?.id],
    queryFn: () => toLetApi.getAll({ upazilaId: upazila.id }).then(res => res.data),
    enabled: !!upazila?.id,
  });

  const { data: businesses = [] } = useQuery({
    queryKey: ['businesses', upazila?.id],
    queryFn: () => businessApi.getAll({ upazilaId: upazila.id }).then(res => res.data),
    enabled: !!upazila?.id,
  });

  const { data: touristPlaces = [] } = useQuery({
    queryKey: ['tourist-places', upazila?.id],
    queryFn: () => touristPlaceApi.getAll({ upazilaId: upazila.id }).then(res => res.data),
    enabled: !!upazila?.id,
  });

  if (upazilaLoading) return <div className="container py-8">Loading...</div>;
  if (!upazila) return <div className="container py-8">Upazila not found</div>;

  const categories = [
    {
      title: 'Hospitals',
      titleBn: 'হাসপাতাল',
      data: hospitals,
      icon: '🏥',
      color: 'blue',
      renderItem: (item) => (
        <div key={item.id} className="card hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{item.nameBn}</p>
          <p className="text-xs text-gray-500"><span className="font-medium">Type:</span> {item.type}</p>
          <p className="text-xs text-gray-500"><span className="font-medium">Address:</span> {item.address}</p>
          {item.phone && <p className="text-xs text-gray-500"><span className="font-medium">Phone:</span> {item.phone}</p>}
        </div>
      ),
    },
    {
      title: 'Home Tutors',
      titleBn: 'হোম টিউটর',
      data: tutors,
      icon: '👨‍🏫',
      color: 'green',
      renderItem: (item) => (
        <div key={item.id} className="card hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-1">{item.tutorName}</h3>
          <p className="text-gray-600 text-sm mb-2">{item.tutorNameBn}</p>
          <p className="text-xs text-gray-500"><span className="font-medium">Subjects:</span> {item.subjects}</p>
          <p className="text-xs text-gray-500"><span className="font-medium">Classes:</span> {item.classes}</p>
          <p className="text-xs text-gray-500"><span className="font-medium">Experience:</span> {item.experienceYears} years</p>
          <p className="text-xs text-gray-500"><span className="font-medium">Phone:</span> {item.phone}</p>
        </div>
      ),
    },
    {
      title: 'To-Let Properties',
      titleBn: 'টু-লেট',
      data: tolets,
      icon: '🏠',
      color: 'purple',
      renderItem: (item) => (
        <div key={item.id} className="card hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
          <p className="text-xl font-bold text-primary-600 mb-2">৳{item.rent}/month</p>
          <p className="text-xs text-gray-500"><span className="font-medium">Type:</span> {item.propertyType}</p>
          <p className="text-xs text-gray-500"><span className="font-medium">Address:</span> {item.address}</p>
          <p className="text-xs text-gray-500"><span className="font-medium">Contact:</span> {item.contactPhone}</p>
        </div>
      ),
    },
    {
      title: 'Local Businesses',
      titleBn: 'ব্যবসা',
      data: businesses,
      icon: '🏪',
      color: 'orange',
      renderItem: (item) => (
        <div key={item.id} className="card hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{item.nameBn}</p>
          <p className="text-xs text-gray-500"><span className="font-medium">Type:</span> {item.businessType}</p>
          <p className="text-xs text-gray-500"><span className="font-medium">Address:</span> {item.address}</p>
          <p className="text-xs text-gray-500"><span className="font-medium">Phone:</span> {item.phone}</p>
        </div>
      ),
    },
    {
      title: 'Tourist Places',
      titleBn: 'পর্যটন স্থান',
      data: touristPlaces,
      icon: '🌴',
      color: 'teal',
      renderItem: (item) => (
        <div key={item.id} className="card hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{item.nameBn}</p>
          <p className="text-xs text-gray-500"><span className="font-medium">Type:</span> {item.placeType}</p>
          {item.description && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{item.description}</p>
          )}
        </div>
      ),
    },
  ];

  const totalItems = hospitals.length + tutors.length + tolets.length + businesses.length + touristPlaces.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="container mx-auto px-6">
          <Link to="/upazilas" className="text-white hover:text-primary-200 mb-4 inline-block">
            ← Back to Upazilas
          </Link>
          <h1 className="text-4xl font-bold mb-2">{upazila.name}</h1>
          <h2 className="text-3xl mb-4">{upazila.nameBn}</h2>
          {upazila.description && (
            <p className="text-lg text-primary-100 max-w-2xl">{upazila.description}</p>
          )}
          <div className="mt-4 text-sm text-primary-100">
            Total {totalItems} items found in this upazila
          </div>
        </div>
      </div>

      {/* Content Categories */}
      <div className="container mx-auto px-6 py-8">
        {categories.map((category) => (
          <section key={category.title} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span>{category.icon}</span>
                  <span>{category.title}</span>
                  <span className="text-gray-500">({category.titleBn})</span>
                </h2>
                <p className="text-gray-600">
                  {category.data.length} {category.data.length === 1 ? 'item' : 'items'} found
                </p>
              </div>
              {category.data.length > 0 && (
                <Link
                  to={`/${category.title.toLowerCase().replace(' ', '-')}?upazila=${upazila.id}`}
                  className={`text-${category.color}-600 hover:text-${category.color}-700 text-sm font-medium`}
                >
                  View All →
                </Link>
              )}
            </div>

            {category.data.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                <p>No {category.title.toLowerCase()} found in this upazila yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.data.slice(0, 6).map(category.renderItem)}
              </div>
            )}

            {category.data.length > 6 && (
              <div className="text-center mt-4">
                <Link
                  to={`/${category.title.toLowerCase().replace(' ', '-')}?upazila=${upazila.id}`}
                  className={`text-${category.color}-600 hover:text-${category.color}-700 font-medium`}
                >
                  View all {category.data.length} {category.title.toLowerCase()} →
                </Link>
              </div>
            )}
          </section>
        ))}

        {totalItems === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-xl text-gray-600 mb-4">
              No content available for {upazila.name} yet.
            </p>
            <p className="text-gray-500">
              Check back later for updates!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
