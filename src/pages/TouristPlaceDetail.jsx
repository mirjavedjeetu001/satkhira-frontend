import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { touristPlaceApi } from '../services/api';

export default function TouristPlaceDetail() {
  const { id } = useParams();

  const { data: place, isLoading, error } = useQuery({
    queryKey: ['tourist-place', id],
    queryFn: async () => {
      const response = await touristPlaceApi.getOne(id);
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

  if (error || !place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Place not found</h2>
          <Link to="/tourist-places" className="btn btn-primary">
            Back to Places
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="bg-black">
        <div className="container mx-auto">
          <div className="h-[500px] bg-gradient-to-br from-teal-400 to-blue-500 relative">
            {place.images && place.images[0] ? (
              <img
                src={place.images[0]}
                alt={place.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white text-9xl">
                🌴
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="container mx-auto">
                <Link
                  to="/tourist-places"
                  className="inline-flex items-center text-white/90 hover:text-white mb-4"
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
                  Back to Places
                </Link>
                <h1 className="text-5xl font-bold mb-2">{place.name}</h1>
                {place.nameBn && (
                  <p className="text-xl text-white/90">{place.nameBn}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-semibold">
                  {place.placeType.replace('_', ' ')}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">About</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {place.description}
              </p>

              {place.descriptionBn && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {place.descriptionBn}
                  </p>
                </div>
              )}
            </div>

            {/* Features */}
            {place.features && place.features.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Features</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {place.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-700">
                      <svg
                        className="w-5 h-5 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 sticky top-20">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Info</h3>

              {place.upazila && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Location</div>
                  <div className="flex items-center text-gray-700">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-400"
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
                    <span>{place.upazila.name}, Satkhira</span>
                  </div>
                </div>
              )}

              {place.address && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Address</div>
                  <p className="text-gray-700">{place.address}</p>
                </div>
              )}

              {place.phone && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Phone</div>
                  <a
                    href={`tel:${place.phone}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {place.phone}
                  </a>
                </div>
              )}

              {place.email && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Email</div>
                  <a
                    href={`mailto:${place.email}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {place.email}
                  </a>
                </div>
              )}

              {place.website && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Website</div>
                  <a
                    href={place.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Visit Website
                  </a>
                </div>
              )}

              {place.entryFee && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Entry Fee</div>
                  <div className="text-gray-700 font-semibold">{place.entryFee}</div>
                </div>
              )}

              {place.openingHours && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Opening Hours</div>
                  <div className="text-gray-700">{place.openingHours}</div>
                </div>
              )}

              {place.bestTimeToVisit && (
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">Best Time to Visit</div>
                  <div className="text-gray-700">{place.bestTimeToVisit}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
