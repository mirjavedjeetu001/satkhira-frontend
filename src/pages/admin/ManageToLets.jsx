import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toLetApi, upazilaApi } from '../../services/api';

export default function ManageToLets() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const queryClient = useQueryClient();

  const { data: tolets = [], isLoading } = useQuery({
    queryKey: ['admin-tolets'],
    queryFn: async () => {
      const response = await toLetApi.getAll();
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
    mutationFn: (id) => toLetApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-tolets']);
      alert('To-Let deleted successfully!');
    },
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, data }) => id ? toLetApi.update(id, data) : toLetApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-tolets']);
      setShowForm(false);
      setEditingItem(null);
      alert('To-Let saved successfully!');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      titleBn: formData.get('titleBn'),
      propertyType: formData.get('propertyType'),
      rent: parseFloat(formData.get('rent')),
      address: formData.get('address'),
      addressBn: formData.get('addressBn'),
      upazilaId: parseInt(formData.get('upazilaId')),
      area: formData.get('area'),
      bedrooms: formData.get('bedrooms') ? parseInt(formData.get('bedrooms')) : null,
      bathrooms: formData.get('bathrooms') ? parseInt(formData.get('bathrooms')) : null,
      facilities: formData.get('facilities'),
      facilitiesBn: formData.get('facilitiesBn'),
      description: formData.get('description'),
      contactName: formData.get('contactName'),
      contactPhone: formData.get('contactPhone'),
      contactEmail: formData.get('contactEmail'),
    };

    saveMutation.mutate({ id: editingItem?.id, data });
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage To-Let Properties</h1>
        <button onClick={() => { setEditingItem(null); setShowForm(true); }} className="btn btn-primary">
          + Add Property
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">{editingItem ? 'Edit Property' : 'Add New Property'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input name="title" defaultValue={editingItem?.title} placeholder="Title (English)" className="input" required />
              <input name="titleBn" defaultValue={editingItem?.titleBn} placeholder="Title (Bengali)" className="input" required />
              <select name="propertyType" defaultValue={editingItem?.propertyType} className="input" required>
                <option value="">Select Type</option>
                <option value="ROOM">Room</option>
                <option value="FLAT">Flat</option>
                <option value="HOUSE">House</option>
                <option value="SHOP">Shop</option>
              </select>
              <input name="rent" type="number" step="0.01" defaultValue={editingItem?.rent} placeholder="Rent (BDT)" className="input" required />
              <input name="area" defaultValue={editingItem?.area} placeholder="Area (sq ft)" className="input" />
              <input name="bedrooms" type="number" defaultValue={editingItem?.bedrooms} placeholder="Bedrooms" className="input" />
              <input name="bathrooms" type="number" defaultValue={editingItem?.bathrooms} placeholder="Bathrooms" className="input" />
              <select name="upazilaId" defaultValue={editingItem?.upazilaId} className="input" required>
                <option value="">Select Upazila</option>
                {upazilas.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <input name="address" defaultValue={editingItem?.address} placeholder="Address (English)" className="input" required />
            <input name="addressBn" defaultValue={editingItem?.addressBn} placeholder="Address (Bengali)" className="input" />
            <textarea name="facilities" defaultValue={editingItem?.facilities} placeholder="Facilities (English)" className="input" rows="2" />
            <textarea name="facilitiesBn" defaultValue={editingItem?.facilitiesBn} placeholder="Facilities (Bengali)" className="input" rows="2" />
            <textarea name="description" defaultValue={editingItem?.description} placeholder="Description" className="input" rows="3" />
            <div className="grid grid-cols-3 gap-4">
              <input name="contactName" defaultValue={editingItem?.contactName} placeholder="Contact Name" className="input" required />
              <input name="contactPhone" defaultValue={editingItem?.contactPhone} placeholder="Contact Phone" className="input" required />
              <input name="contactEmail" type="email" defaultValue={editingItem?.contactEmail} placeholder="Contact Email" className="input" />
            </div>
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
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">Rent</th>
              <th className="text-left p-3">Location</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tolets.map((tolet) => (
              <tr key={tolet.id} className="border-b">
                <td className="p-3">{tolet.id}</td>
                <td className="p-3">{tolet.title}</td>
                <td className="p-3">{tolet.propertyType}</td>
                <td className="p-3">৳{tolet.rent}</td>
                <td className="p-3">{tolet.upazila?.name || '-'}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${tolet.status === 'APPROVED' ? 'bg-green-100 text-green-800' : tolet.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {tolet.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingItem(tolet); setShowForm(true); }} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => window.confirm('Delete?') && deleteMutation.mutate(tolet.id)} className="text-red-600 hover:underline">Delete</button>
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
