import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { businessApi, upazilaApi } from '../services/api';

export default function BusinessCreate() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    nameBn: '',
    businessType: '',
    address: '',
    addressBn: '',
    upazilaId: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    descriptionBn: '',
    openingHours: '',
    specialties: '',
    latitude: '',
    longitude: '',
  });

  // Fetch upazilas
  const { data: upazilaData } = useQuery({
    queryKey: ['upazilas'],
    queryFn: upazilaApi.getAll,
  });

  const upazilas = Array.isArray(upazilaData) ? upazilaData : (upazilaData?.data || []);

  const createMutation = useMutation({
    mutationFn: businessApi.create,
    onSuccess: () => {
      setSuccess('Business listing submitted successfully! It will be visible after admin approval.');
      setError('');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Failed to submit business listing');
      setSuccess('');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.businessType || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }

    const submitData = {
      ...formData,
      upazilaId: formData.upazilaId ? parseInt(formData.upazilaId) : null,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
    };

    createMutation.mutate(submitData);
  };

  const businessTypes = [
    'RESTAURANT',
    'SHOP',
    'HOTEL',
    'PHARMACY',
    'ELECTRONICS',
    'CLOTHING',
    'GROCERY',
    'BAKERY',
    'SERVICE',
    'OTHER',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="card card-premium">
          <div className="flex items-center mb-8">
            <button onClick={() => navigate('/profile')} className="btn btn-secondary mr-4">
              ← Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="text-4xl mr-3">🏪</span>
                Add Business Listing
              </h1>
              <p className="text-gray-600 mt-2">Promote your local business</p>
            </div>
          </div>

          {success && (
            <div className="alert alert-success mb-6">
              <span className="text-2xl mr-2">✅</span>
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-danger mb-6">
              <span className="text-2xl mr-2">❌</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📝</span>
                Basic Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Business Name (English) <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="input" placeholder="ABC Restaurant" required />
                </div>
                <div>
                  <label className="label">Business Name (Bangla)</label>
                  <input type="text" name="nameBn" value={formData.nameBn} onChange={handleChange} className="input" placeholder="এবিসি রেস্তোরাঁ" />
                </div>
                <div>
                  <label className="label">Business Type <span className="text-red-500">*</span></label>
                  <select name="businessType" value={formData.businessType} onChange={handleChange} className="input" required>
                    <option value="">Select Type</option>
                    {businessTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📞</span>
                Contact Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Phone <span className="text-red-500">*</span></label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input" placeholder="+880 1234-567890" required />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="input" placeholder="business@example.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Website</label>
                  <input type="url" name="website" value={formData.website} onChange={handleChange} className="input" placeholder="https://example.com" />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📍</span>
                Location
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Address (English)</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} className="input min-h-24" placeholder="123 Main Street, Satkhira" />
                </div>
                <div>
                  <label className="label">Address (Bangla)</label>
                  <textarea name="addressBn" value={formData.addressBn} onChange={handleChange} className="input min-h-24" placeholder="১২৩ মেইন স্ট্রিট, সাতক্ষীরা" />
                </div>
                <div>
                  <label className="label">Upazila</label>
                  <select name="upazilaId" value={formData.upazilaId} onChange={handleChange} className="input">
                    <option value="">Select Upazila</option>
                    {upazilas.map((upazila) => (
                      <option key={upazila.id} value={upazila.id}>
                        {upazila.name} ({upazila.nameBn})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">ℹ️</span>
                Business Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Opening Hours</label>
                  <input type="text" name="openingHours" value={formData.openingHours} onChange={handleChange} className="input" placeholder="9 AM - 9 PM" />
                </div>
                <div>
                  <label className="label">Specialties</label>
                  <input type="text" name="specialties" value={formData.specialties} onChange={handleChange} className="input" placeholder="Fast Food, Delivery" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="label">Description (English)</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className="input min-h-32" placeholder="Tell customers about your business..." />
                </div>
                <div>
                  <label className="label">Description (Bangla)</label>
                  <textarea name="descriptionBn" value={formData.descriptionBn} onChange={handleChange} className="input min-h-32" placeholder="আপনার ব্যবসা সম্পর্কে বলুন..." />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex space-x-4">
              <button type="button" onClick={() => navigate('/profile')} className="btn btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" disabled={createMutation.isPending} className="btn btn-primary flex-1">
                {createMutation.isPending ? 'Submitting...' : 'Submit for Approval'}
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-2">
                <span className="text-xl">ℹ️</span>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Note</p>
                  <p>Your listing will be reviewed by an administrator before it becomes publicly visible.</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
