import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { touristPlaceApi, upazilaApi } from '../../services/api';

export default function ManageTouristPlaces() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    nameBn: '',
    placeType: 'TOURIST_SPOT',
    description: '',
    descriptionBn: '',
    address: '',
    upazilaId: '',
    phone: '',
    email: '',
    website: '',
    features: '',
    entryFee: '',
    openingHours: '',
    bestTimeToVisit: '',
    latitude: '',
    longitude: '',
    images: '',
  });

  const { data: places = [], isLoading } = useQuery({
    queryKey: ['admin-tourist-places'],
    queryFn: async () => {
      const response = await touristPlaceApi.getAll();
      return response.data;
    },
  });

  const { data: upazilas = [] } = useQuery({
    queryKey: ['upazilas'],
    queryFn: async () => {
      const response = await upazilaApi.getAll();
      return response.data;
    },
  });

  const { data: pendingPlaces = [] } = useQuery({
    queryKey: ['pending-tourist-places'],
    queryFn: async () => {
      const response = await touristPlaceApi.getPending();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => touristPlaceApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-tourist-places']);
      queryClient.invalidateQueries(['pending-tourist-places']);
      resetForm();
      alert('Tourist place created successfully! Awaiting approval.');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to create tourist place');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => touristPlaceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-tourist-places']);
      queryClient.invalidateQueries(['pending-tourist-places']);
      resetForm();
      alert('Tourist place updated successfully!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to update tourist place');
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id) => touristPlaceApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-tourist-places']);
      queryClient.invalidateQueries(['pending-tourist-places']);
      alert('Tourist place approved successfully!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to approve');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => touristPlaceApi.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-tourist-places']);
      queryClient.invalidateQueries(['pending-tourist-places']);
      alert('Tourist place rejected.');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to reject');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => touristPlaceApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-tourist-places']);
      queryClient.invalidateQueries(['pending-tourist-places']);
      alert('Tourist place deleted successfully!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to delete');
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      nameBn: '',
      placeType: 'TOURIST_SPOT',
      description: '',
      descriptionBn: '',
      address: '',
      upazilaId: '',
      phone: '',
      email: '',
      website: '',
      features: '',
      entryFee: '',
      openingHours: '',
      bestTimeToVisit: '',
      latitude: '',
      longitude: '',
      images: '',
    });
    setEditingPlace(null);
    setIsModalOpen(false);
  };

  const handleEdit = (place) => {
    setEditingPlace(place);
    setFormData({
      name: place.name,
      nameBn: place.nameBn || '',
      placeType: place.placeType,
      description: place.description,
      descriptionBn: place.descriptionBn || '',
      address: place.address || '',
      upazilaId: place.upazilaId || '',
      phone: place.phone || '',
      email: place.email || '',
      website: place.website || '',
      features: place.features ? place.features.join(', ') : '',
      entryFee: place.entryFee || '',
      openingHours: place.openingHours || '',
      bestTimeToVisit: place.bestTimeToVisit || '',
      latitude: place.latitude || '',
      longitude: place.longitude || '',
      images: place.images ? place.images.join(', ') : '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this tourist place?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      features: formData.features
        ? formData.features.split(',').map((f) => f.trim()).filter(Boolean)
        : [],
      images: formData.images
        ? formData.images.split(',').map((i) => i.trim()).filter(Boolean)
        : [],
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      upazilaId: formData.upazilaId ? parseInt(formData.upazilaId) : null,
    };

    // Remove empty fields
    Object.keys(submitData).forEach((key) => {
      if (submitData[key] === '' || submitData[key] === null) {
        delete submitData[key];
      }
    });

    if (editingPlace) {
      updateMutation.mutate({ id: editingPlace.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const placeTypes = [
    'TOURIST_SPOT',
    'RESORT',
    'HISTORICAL',
    'RELIGIOUS',
    'NATURAL',
    'PARK',
    'OTHER',
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Tourist Places</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          + Add Tourist Place
        </button>
      </div>

      {/* Pending Approvals */}
      {pendingPlaces.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-orange-600">
            Pending Approvals ({pendingPlaces.length})
          </h2>
          <div className="grid gap-4">
            {pendingPlaces.map((place) => (
              <div key={place.id} className="card bg-orange-50 border-2 border-orange-200">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{place.name}</h3>
                    {place.nameBn && <p className="text-sm text-gray-600">{place.nameBn}</p>}
                    <p className="text-sm text-gray-600 mt-2">{place.description.substring(0, 150)}...</p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span className="font-semibold">{place.placeType.replace('_', ' ')}</span>
                      <span>{place.upazila?.name}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => approveMutation.mutate(place.id)}
                      className="btn btn-success btn-sm"
                      disabled={approveMutation.isPending}
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => rejectMutation.mutate(place.id)}
                      className="btn btn-danger btn-sm"
                      disabled={rejectMutation.isPending}
                    >
                      ✗ Reject
                    </button>
                    <button onClick={() => handleEdit(place)} className="btn btn-outline btn-sm">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Tourist Places */}
      <h2 className="text-xl font-bold mb-4">
        All Tourist Places ({places.length})
      </h2>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : places.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🌴</div>
          <h2 className="text-xl font-semibold mb-2">No tourist places yet</h2>
          <p className="text-gray-600">Add your first tourist attraction</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {places.map((place) => (
            <div key={place.id} className="card">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{place.name}</h3>
                      {place.nameBn && <p className="text-sm text-gray-600">{place.nameBn}</p>}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        place.approvalStatus === 'APPROVED'
                          ? 'bg-green-100 text-green-700'
                          : place.approvalStatus === 'REJECTED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {place.approvalStatus}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{place.description.substring(0, 150)}...</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-semibold">{place.placeType.replace('_', ' ')}</span>
                    <span>📍 {place.upazila?.name || 'No upazila'}</span>
                    {place.entryFee && <span>💰 {place.entryFee}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => handleEdit(place)} className="btn btn-primary btn-sm">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(place.id)}
                    className="btn btn-danger btn-sm"
                    disabled={deleteMutation.isPending}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingPlace ? 'Edit Tourist Place' : 'Add Tourist Place'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name (English) *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Name (Bangla)</label>
                    <input
                      type="text"
                      value={formData.nameBn}
                      onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Place Type *</label>
                    <select
                      value={formData.placeType}
                      onChange={(e) => setFormData({ ...formData, placeType: e.target.value })}
                      className="input"
                      required
                    >
                      {placeTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Upazila</label>
                    <select
                      value={formData.upazilaId}
                      onChange={(e) => setFormData({ ...formData, upazilaId: e.target.value })}
                      className="input"
                    >
                      <option value="">Select Upazila</option>
                      {upazilas.map((upazila) => (
                        <option key={upazila.id} value={upazila.id}>
                          {upazila.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description (English) *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input"
                    rows="3"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description (Bangla)</label>
                  <textarea
                    value={formData.descriptionBn}
                    onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                    className="input"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Features (comma separated)</label>
                  <input
                    type="text"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    className="input"
                    placeholder="Parking, Restaurant, Guide Available"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Entry Fee</label>
                    <input
                      type="text"
                      value={formData.entryFee}
                      onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                      className="input"
                      placeholder="Free or 50 BDT"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Opening Hours</label>
                    <input
                      type="text"
                      value={formData.openingHours}
                      onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                      className="input"
                      placeholder="9 AM - 6 PM"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Best Time to Visit</label>
                    <input
                      type="text"
                      value={formData.bestTimeToVisit}
                      onChange={(e) => setFormData({ ...formData, bestTimeToVisit: e.target.value })}
                      className="input"
                      placeholder="Winter"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="input"
                      placeholder="22.7196"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      className="input"
                      placeholder="89.0704"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Image URLs (comma separated)</label>
                  <textarea
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    className="input"
                    rows="2"
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={resetForm} className="btn btn-outline flex-1">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? 'Saving...'
                      : editingPlace
                      ? 'Update'
                      : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
