import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { businessApi, upazilaApi } from '../../services/api';

export default function ManageBusinesses() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const queryClient = useQueryClient();

  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ['admin-businesses'],
    queryFn: async () => {
      const response = await businessApi.getAll();
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

  const deleteMutation = useMutation({
    mutationFn: (id) => businessApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-businesses']);
      alert('Business deleted successfully!');
    },
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, data }) => id ? businessApi.update(id, data) : businessApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-businesses']);
      setShowForm(false);
      setEditingItem(null);
      alert('Business saved successfully!');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      nameBn: formData.get('nameBn'),
      businessType: formData.get('businessType'),
      address: formData.get('address'),
      addressBn: formData.get('addressBn'),
      upazilaId: parseInt(formData.get('upazilaId')),
      phone: formData.get('phone'),
      email: formData.get('email'),
      website: formData.get('website'),
      description: formData.get('description'),
      descriptionBn: formData.get('descriptionBn'),
      openingHours: formData.get('openingHours'),
      specialties: formData.get('specialties'),
    };

    saveMutation.mutate({ id: editingItem?.id, data });
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Businesses</h1>
        <button onClick={() => { setEditingItem(null); setShowForm(true); }} className="btn btn-primary">
          + Add Business
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">{editingItem ? 'Edit Business' : 'Add New Business'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input name="name" defaultValue={editingItem?.name} placeholder="Name (English)" className="input" required />
              <input name="nameBn" defaultValue={editingItem?.nameBn} placeholder="Name (Bengali)" className="input" required />
              <select name="businessType" defaultValue={editingItem?.businessType} className="input" required>
                <option value="">Select Type</option>
                <option value="RESTAURANT">Restaurant</option>
                <option value="SHOP">Shop</option>
                <option value="SERVICE">Service</option>
                <option value="OTHER">Other</option>
              </select>
              <select name="upazilaId" defaultValue={editingItem?.upazilaId} className="input" required>
                <option value="">Select Upazila</option>
                {upazilas.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
              <input name="phone" defaultValue={editingItem?.phone} placeholder="Phone" className="input" required />
              <input name="email" type="email" defaultValue={editingItem?.email} placeholder="Email" className="input" />
              <input name="website" type="url" defaultValue={editingItem?.website} placeholder="Website" className="input" />
              <input name="openingHours" defaultValue={editingItem?.openingHours} placeholder="Opening Hours" className="input" />
            </div>
            <input name="address" defaultValue={editingItem?.address} placeholder="Address (English)" className="input" required />
            <input name="addressBn" defaultValue={editingItem?.addressBn} placeholder="Address (Bengali)" className="input" />
            <textarea name="description" defaultValue={editingItem?.description} placeholder="Description (English)" className="input" rows="3" />
            <textarea name="descriptionBn" defaultValue={editingItem?.descriptionBn} placeholder="Description (Bengali)" className="input" rows="3" />
            <textarea name="specialties" defaultValue={editingItem?.specialties} placeholder="Specialties" className="input" rows="2" />
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">{editingItem ? 'Update' : 'Create'}</button>
              <button type="button" onClick={() => { setShowForm(false); setEditingItem(null); }} className="btn">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">Location</th>
              <th className="text-left p-3">Phone</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((business) => (
              <tr key={business.id} className="border-b">
                <td className="p-3">{business.id}</td>
                <td className="p-3">{business.name}</td>
                <td className="p-3">{business.businessType}</td>
                <td className="p-3">{business.upazila?.name || '-'}</td>
                <td className="p-3">{business.phone}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${business.status === 'APPROVED' ? 'bg-green-100 text-green-800' : business.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {business.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingItem(business); setShowForm(true); }} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => window.confirm('Delete?') && deleteMutation.mutate(business.id)} className="text-red-600 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
