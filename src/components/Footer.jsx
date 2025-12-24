import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '../services/api';

export default function Footer() {
  const { data: settings = [] } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await settingsApi.getAll();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const getSetting = (key, defaultValue = '') => {
    if (!Array.isArray(settings)) return defaultValue;
    const setting = settings.find((s) => s.key === key);
    return setting ? setting.value : defaultValue;
  };

  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">
              {getSetting('site_name', 'সাতক্ষীরা')}
            </h3>
            <p className="text-gray-300 mb-4">
              {getSetting('footer_about', 'Satkhira Community Platform')}
            </p>
            <p className="text-gray-400 text-sm">
              {getSetting('footer_about_bn', 'সাতক্ষীরা কমিউনিটি প্ল্যাটফর্ম')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/hospitals" className="text-gray-300 hover:text-white transition-colors">
                  Hospitals
                </Link>
              </li>
              <li>
                <Link to="/home-tutors" className="text-gray-300 hover:text-white transition-colors">
                  Home Tutors
                </Link>
              </li>
              <li>
                <Link to="/to-lets" className="text-gray-300 hover:text-white transition-colors">
                  To-Let
                </Link>
              </li>
              <li>
                <Link to="/businesses" className="text-gray-300 hover:text-white transition-colors">
                  Businesses
                </Link>
              </li>
              <li>
                <Link to="/tourist-places" className="text-gray-300 hover:text-white transition-colors">
                  Tourist Places
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-gray-300 hover:text-white transition-colors">
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 mr-2 mt-1 flex-shrink-0"
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
                <span>{getSetting('footer_address', 'Satkhira, Bangladesh')}</span>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href={`mailto:${getSetting('footer_email', 'info@satkhira.com')}`}
                  className="hover:text-white transition-colors"
                >
                  {getSetting('footer_email', 'info@satkhira.com')}
                </a>
              </li>
              <li className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href={`tel:${getSetting('footer_phone', '+880 1234-567890').replace(/\s/g, '')}`}
                  className="hover:text-white transition-colors"
                >
                  {getSetting('footer_phone', '+880 1234-567890')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>
            {getSetting('footer_copyright', '© 2024 Satkhira Community. All rights reserved.')}
          </p>
        </div>
      </div>
    </footer>
  );
}
