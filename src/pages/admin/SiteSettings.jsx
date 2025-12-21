import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../../services/api';

export default function SiteSettings() {
  const queryClient = useQueryClient();
  const [editedSettings, setEditedSettings] = useState({});

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await settingsApi.getAll();
      return response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (updates) => settingsApi.bulkUpdate(updates),
    onSuccess: () => {
      queryClient.invalidateQueries(['settings']);
      setEditedSettings({});
      alert('Settings updated successfully!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to update settings');
    },
  });

  const handleChange = (key, value) => {
    setEditedSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    const updates = Object.entries(editedSettings).map(([key, value]) => ({
      key,
      value,
    }));

    if (updates.length === 0) {
      alert('No changes to save');
      return;
    }

    updateMutation.mutate(updates);
  };

  const handleReset = () => {
    setEditedSettings({});
  };

  const getValue = (key) => {
    if (editedSettings[key] !== undefined) {
      return editedSettings[key];
    }
    const setting = settings.find((s) => s.key === key);
    return setting ? setting.value : '';
  };

  const settingsGroups = [
    {
      title: 'Site Identity',
      settings: ['site_name', 'site_name_en', 'site_tagline'],
    },
    {
      title: 'Footer About',
      settings: ['footer_about', 'footer_about_bn'],
    },
    {
      title: 'Footer Contact',
      settings: ['footer_address', 'footer_email', 'footer_phone'],
    },
    {
      title: 'Footer Copyright',
      settings: ['footer_copyright'],
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Site Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage navbar logo, footer content, and site information
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="btn btn-outline"
            disabled={Object.keys(editedSettings).length === 0}
          >
            Reset Changes
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary"
            disabled={
              Object.keys(editedSettings).length === 0 || updateMutation.isPending
            }
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {settingsGroups.map((group) => (
            <div key={group.title} className="card">
              <h2 className="text-xl font-bold mb-4">{group.title}</h2>
              <div className="space-y-4">
                {group.settings.map((key) => {
                  const setting = settings.find((s) => s.key === key);
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {setting?.description || key}
                      </label>
                      <div className="flex gap-2">
                        {key.includes('about') ? (
                          <textarea
                            value={getValue(key)}
                            onChange={(e) => handleChange(key, e.target.value)}
                            className="input flex-1"
                            rows="3"
                            placeholder={setting?.description || key}
                          />
                        ) : (
                          <input
                            type="text"
                            value={getValue(key)}
                            onChange={(e) => handleChange(key, e.target.value)}
                            className="input flex-1"
                            placeholder={setting?.description || key}
                          />
                        )}
                        {editedSettings[key] !== undefined && (
                          <span className="flex items-center px-3 py-2 bg-yellow-100 text-yellow-700 rounded text-sm font-semibold">
                            Modified
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Key: {key}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Preview Section */}
          <div className="card bg-blue-50 border-2 border-blue-200">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <svg
                className="w-6 h-6 mr-2"
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
              Preview
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  Navbar Logo:
                </h3>
                <div className="bg-white p-4 rounded border">
                  <span className="text-2xl font-bold text-primary-600">
                    {getValue('site_name')}
                  </span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  Footer Content:
                </h3>
                <div className="bg-gray-800 text-white p-6 rounded">
                  <h4 className="text-xl font-bold mb-2">
                    {getValue('site_name')}
                  </h4>
                  <p className="text-gray-300 mb-2 text-sm">
                    {getValue('footer_about')}
                  </p>
                  <div className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-700">
                    <p>{getValue('footer_copyright')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
