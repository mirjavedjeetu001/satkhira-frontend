import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toLetApi, upazilaApi } from '../services/api';

export default function ToLetCreate() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    titleBn: '',
    propertyType: 'APARTMENT',
    rent: '',
    address: '',
    addressBn: '',
    upazilaId: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    facilities: '',
    facilitiesBn: '',
    description: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
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
    mutationFn: toLetApi.create,
    onSuccess: () => {
      setSuccess('To-Let listing submitted successfully! It will be visible after admin approval.');
      setError('');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Failed to submit to-let listing');
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
    
    if (!formData.title || !formData.rent || !formData.address || !formData.contactPhone) {
      setError('Please fill in all required fields');
      return;
    }

    const submitData = {
      ...formData,
      rent: formData.rent ? parseFloat(formData.rent) : 0,
      area: formData.area ? parseFloat(formData.area) : null,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
      upazilaId: formData.upazilaId ? parseInt(formData.upazilaId) : null,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
    };

    createMutation.mutate(submitData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="card card-premium">
          <div className="flex items-center mb-8">
            <button onClick={() => navigate('/profile')} className="btn btn-secondary mr-4">
              ← Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="text-4xl mr-3">🏠</span>
                Add To-Let Listing
              </h1>
              <p className="text-gray-600 mt-2">List your rental property</p>
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
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📝</span>
                Basic Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Title (English) <span className="text-red-500">*</span></label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className="input" placeholder="2 Bedroom Apartment" required />
                </div>
                <div>
                  <label className="label">Title (Bangla)</label>
                  <input type="text" name="titleBn" value={formData.titleBn} onChange={handleChange} className="input" placeholder="২ বেডরুমের অ্যাপার্টমেন্ট" />
                </div>
                <div>
                  <label className="label">Property Type <span className="text-red-500">*</span></label>
                  <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="input" required>
                    <option value="APARTMENT">Apartment</option>
                    <option value="HOUSE">House</option>
                    <option value="ROOM">Room</option>
                    <option value="SHOP">Shop</option>
                    <option value="OFFICE">Office</option>
                  </select>
                </div>
                <div>
                  <label className="label">Monthly Rent (BDT) <span className="text-red-500">*</span></label>
                  <input type="number" name="rent" value={formData.rent} onChange={handleChange} className="input" placeholder="15000" required />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🏡</span>
                Property Details
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Area (sq ft)</label>
                  <input type="number" name="area" value={formData.area} onChange={handleChange} className="input" placeholder="1200" />
                </div>
                <div>
                  <label className="label">Bedrooms</label>
                  <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="input" placeholder="2" />
                </div>
                <div>
                  <label className="label">Bathrooms</label>
                  <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="input" placeholder="1" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="label">Facilities (English)</label>
                  <textarea name="facilities" value={formData.facilities} onChange={handleChange} className="input min-h-24" placeholder="Gas, Water, Electricity, Security" />
                </div>
                <div>
                  <label className="label">Facilities (Bangla)</label>
                  <textarea name="facilitiesBn" value={formData.facilitiesBn} onChange={handleChange} className="input min-h-24" placeholder="গ্যাস, পানি, বিদ্যুৎ, নিরাপত্তা" />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📍</span>
                Location
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Address (English) <span className="text-red-500">*</span></label>
                  <textarea name="address" value={formData.address} onChange={handleChange} className="input min-h-24" placeholder="House 10, Road 5, Satkhira Sadar" required />
                </div>
                <div>
                  <label className="label">Address (Bangla)</label>
                  <textarea name="addressBn" value={formData.addressBn} onChange={handleChange} className="input min-h-24" placeholder="বাড়ি ১০, রোড ৫, সাতক্ষীরা সদর" />
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

            {/* Contact Information */}
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📞</span>
                Contact Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Contact Name</label>
                  <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} className="input" placeholder="John Doe" />
                </div>
                <div>
                  <label className="label">Contact Phone <span className="text-red-500">*</span></label>
                  <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="input" placeholder="+880 1234-567890" required />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Contact Email</label>
                  <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="input" placeholder="contact@example.com" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">ℹ️</span>
                Description
              </h2>
              <textarea name="description" value={formData.description} onChange={handleChange} className="input min-h-32" placeholder="Additional details about the property..." />
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
