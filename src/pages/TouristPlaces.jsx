import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { touristPlaceApi } from '../services/api';

export default function TouristPlaces() {
  const [selectedType, setSelectedType] = useState('');
  const [selectedUpazila, setSelectedUpazila] = useState('');

  const { data: touristPlaces = [], isLoading } = useQuery({
    queryKey: ['tourist-places', selectedType, selectedUpazila],
    queryFn: async () => {
      const params = {};
      if (selectedType) params.placeType = selectedType;
      if (selectedUpazila) params.upazilaId = selectedUpazila;
      const response = await touristPlaceApi.getAll(params);
      return response.data;
    },
  });

  const placeTypes = [
    { value: 'TOURIST_SPOT', label: 'Tourist Spot', icon: '🏖️' },
    { value: 'RESORT', label: 'Resort', icon: '🏨' },
    { value: 'HISTORICAL', label: 'Historical', icon: '🏛️' },
    { value: 'RELIGIOUS', label: 'Religious', icon: '🕌' },
    { value: 'NATURAL', label: 'Natural', icon: '🌳' },
    { value: 'PARK', label: 'Park', icon: '🌲' },
    { value: 'OTHER', label: 'Other', icon: '📍' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">
            Explore Satkhira
          </h1>
          <p className="text-xl">
            Discover the beautiful places, resorts, and attractions in Satkhira District
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow-md sticky top-16 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="input w-full"
              >
                <option value="">All Types</option>
                {placeTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-gray-600">
              Found {touristPlaces.length} place{touristPlaces.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading places...</p>
          </div>
        ) : touristPlaces.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No places found
            </h2>
            <p className="text-gray-600">
              Try adjusting your filters or check back later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {touristPlaces.map((place) => (
              <Link
                key={place.id}
                to={`/tourist-places/${place.id}`}
                className="group"
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="h-56 bg-gradient-to-br from-teal-400 to-blue-500 relative">
                    {place.images && place.images[0] ? (
                      <img
                        src={place.images[0]}
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white text-6xl">
                        {placeTypes.find((t) => t.value === place.placeType)?.icon || '🌴'}
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                      {place.placeType.replace('_', ' ')}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                      {place.name}
                    </h3>
                    {place.nameBn && (
                      <p className="text-sm text-gray-500 mb-3">{place.nameBn}</p>
                    )}
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {place.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <svg
                        className="w-4 h-4 mr-2"
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
                      {place.upazila?.name || 'Satkhira'}
                    </div>
                    {place.entryFee && (
                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Entry Fee: {place.entryFee}
                      </div>
                    )}
                    <div className="mt-4 text-primary-600 font-semibold flex items-center">
                      View Details
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
        )}
      </div>
    </div>
  );
}
