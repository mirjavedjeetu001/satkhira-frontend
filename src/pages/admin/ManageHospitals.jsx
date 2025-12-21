import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hospitalApi, upazilaApi } from '../../services/api';
import { Link } from 'react-router-dom';

export default function ManageHospitals() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const queryClient = useQueryClient();

  const { data: hospitals = [], isLoading } = useQuery({
    queryKey: ['admin-hospitals'],
    queryFn: async () => {
      const response = await hospitalApi.getAll();
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
    mutationFn: (id) => hospitalApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-hospitals']);
      alert('Hospital deleted successfully!');
    },
    onError: (error) => alert('Error: ' + error.response?.data?.message),
  });

  const createMutation = useMutation({
    mutationFn: (data) => hospitalApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-hospitals']);
      setShowForm(false);
      alert('Hospital created successfully!');
    },
    onError: (error) => alert('Error: ' + error.response?.data?.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => hospitalApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-hospitals']);
      setShowForm(false);
      setEditingItem(null);
      alert('Hospital updated successfully!');
    },
    onError: (error) => alert('Error: ' + error.response?.data?.message),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      nameBn: formData.get('nameBn'),
      type: formData.get('type'),
      address: formData.get('address'),
      addressBn: formData.get('addressBn'),
      upazilaId: parseInt(formData.get('upazilaId')),
      phone: formData.get('phone'),
      email: formData.get('email'),
      services: formData.get('services'),
      servicesBn: formData.get('servicesBn'),
      website: formData.get('website'),
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this hospital?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Hospitals</h1>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
          className="btn btn-primary"
        >
          + Add Hospital
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingItem ? 'Edit Hospital' : 'Add New Hospital'}
          </h2>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Type</label>
                <select
                  name="type"
                  defaultValue={editingItem?.type}
                  className="input"
                  required
                >
                  <option value="GOVERNMENT">Government</option>
                  <option value="PRIVATE">Private</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Upazila</label>
                <select
                  name="upazilaId"
                  defaultValue={editingItem?.upazilaId}
                  className="input"
                  required
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
              <label className="block mb-2">Address (English)</label>
              <textarea
                name="address"
                defaultValue={editingItem?.address}
                className="input"
                rows="2"
                required
              />
            </div>

            <div>
              <label className="block mb-2">Address (Bengali)</label>
              <textarea
                name="addressBn"
                defaultValue={editingItem?.addressBn}
                className="input"
                rows="2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Phone</label>
                <input
                  type="text"
                  name="phone"
                  defaultValue={editingItem?.phone}
                  className="input"
                />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingItem?.email}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">Services (English)</label>
              <textarea
                name="services"
                defaultValue={editingItem?.services}
                className="input"
                rows="3"
              />
            </div>

            <div>
              <label className="block mb-2">Services (Bengali)</label>
              <textarea
                name="servicesBn"
                defaultValue={editingItem?.servicesBn}
                className="input"
                rows="3"
              />
            </div>

            <div>
              <label className="block mb-2">Website</label>
              <input
                type="url"
                name="website"
                defaultValue={editingItem?.website}
                className="input"
              />
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">
                {editingItem ? 'Update' : 'Create'}
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
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">Upazila</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map((hospital) => (
              <tr key={hospital.id} className="border-b">
                <td className="p-3">{hospital.id}</td>
                <td className="p-3">{hospital.name}</td>
                <td className="p-3">{hospital.type}</td>
                <td className="p-3">{hospital.upazila?.name || '-'}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      hospital.status === 'APPROVED'
                        ? 'bg-green-100 text-green-800'
                        : hospital.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {hospital.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(hospital)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(hospital.id)}
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
      </div>
    </div>
  );
}
