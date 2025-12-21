import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { upazilaApi } from '../../services/api';

export default function ManageUpazilas() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const queryClient = useQueryClient();

  const { data: upazilas = [], isLoading } = useQuery({
    queryKey: ['admin-upazilas'],
    queryFn: async () => {
      const response = await upazilaApi.getAll();
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => upazilaApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-upazilas']);
      alert('Upazila deleted successfully!');
    },
    onError: (error) => alert('Error: ' + error.response?.data?.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => upazilaApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-upazilas']);
      setShowForm(false);
      setEditingItem(null);
      alert('Upazila updated successfully!');
    },
    onError: (error) => alert('Error: ' + error.response?.data?.message),
  });

  const seedMutation = useMutation({
    mutationFn: () => upazilaApi.seed(),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-upazilas']);
      alert('Upazilas seeded successfully!');
    },
    onError: (error) => alert('Error: ' + error.response?.data?.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      nameBn: formData.get('nameBn'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      descriptionBn: formData.get('descriptionBn'),
      isActive: formData.get('isActive') === 'true',
      displayOrder: parseInt(formData.get('displayOrder')),
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this upazila? This may affect related content.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Upazilas</h1>
        <button
          onClick={() => seedMutation.mutate()}
          className="btn"
          disabled={seedMutation.isLoading || upazilas.length > 0}
        >
          {seedMutation.isLoading ? 'Seeding...' : 'Seed Upazilas'}
        </button>
      </div>

      {showForm && editingItem && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">Edit Upazila</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Name (English)</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingItem?.name}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Name (Bengali)</label>
                <input
                  type="text"
                  name="nameBn"
                  defaultValue={editingItem?.nameBn}
                  className="input"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">Slug</label>
              <input
                type="text"
                name="slug"
                defaultValue={editingItem?.slug}
                className="input"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Description (English)</label>
              <textarea
                name="description"
                defaultValue={editingItem?.description}
                className="input"
                rows="3"
              />
            </div>

            <div>
              <label className="block mb-2">Description (Bengali)</label>
              <textarea
                name="descriptionBn"
                defaultValue={editingItem?.descriptionBn}
                className="input"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Status</label>
                <select
                  name="isActive"
                  defaultValue={editingItem?.isActive?.toString()}
                  className="input"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Display Order</label>
                <input
                  type="number"
                  name="displayOrder"
                  defaultValue={editingItem?.displayOrder}
                  className="input"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">
                Update
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingItem(null);
                }}
                className="btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Name (English)</th>
              <th className="text-left p-3">Name (Bengali)</th>
              <th className="text-left p-3">Slug</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Order</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {upazilas.map((upazila) => (
              <tr key={upazila.id} className="border-b">
                <td className="p-3">{upazila.id}</td>
                <td className="p-3">{upazila.name}</td>
                <td className="p-3">{upazila.nameBn}</td>
                <td className="p-3">{upazila.slug}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      upazila.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {upazila.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-3">{upazila.displayOrder}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(upazila)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(upazila.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {upazilas.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No upazilas found. Click "Seed Upazilas" to add the 7 Satkhira upazilas.
          </div>
        )}
      </div>
    </div>
  );
}
