import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tutorApi, upazilaApi } from '../../services/api';

export default function ManageTutors() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const queryClient = useQueryClient();

  const { data: tutors = [], isLoading } = useQuery({
    queryKey: ['admin-tutors'],
    queryFn: async () => {
      const response = await tutorApi.getAll();
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
    mutationFn: (id) => tutorApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-tutors']);
      alert('Tutor deleted successfully!');
    },
  });

  const saveMutation = useMutation({
    mutationFn: ({ id, data }) => id ? tutorApi.update(id, data) : tutorApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-tutors']);
      setShowForm(false);
      setEditingItem(null);
      alert('Tutor saved successfully!');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      tutorName: formData.get('tutorName'),
      tutorNameBn: formData.get('tutorNameBn'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      subjects: formData.get('subjects'),
      subjectsBn: formData.get('subjectsBn'),
      classes: formData.get('classes'),
      experienceYears: parseInt(formData.get('experienceYears')),
      qualification: formData.get('qualification'),
      qualificationBn: formData.get('qualificationBn'),
      preferredArea: formData.get('preferredArea'),
      upazilaId: parseInt(formData.get('upazilaId')),
      expectedFee: parseFloat(formData.get('expectedFee')),
      additionalInfo: formData.get('additionalInfo'),
    };

    saveMutation.mutate({ id: editingItem?.id, data });
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Home Tutors</h1>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowForm(true);
          }}
          className="btn btn-primary"
        >
          + Add Tutor
        </button>
      </div>

      {showForm && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingItem ? 'Edit Tutor' : 'Add New Tutor'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input name="tutorName" defaultValue={editingItem?.tutorName} placeholder="Name (English)" className="input" required />
              <input name="tutorNameBn" defaultValue={editingItem?.tutorNameBn} placeholder="Name (Bengali)" className="input" required />
              <input name="phone" defaultValue={editingItem?.phone} placeholder="Phone" className="input" required />
              <input name="email" defaultValue={editingItem?.email} type="email" placeholder="Email" className="input" />
              <input name="subjects" defaultValue={editingItem?.subjects} placeholder="Subjects" className="input" required />
              <input name="subjectsBn" defaultValue={editingItem?.subjectsBn} placeholder="Subjects (Bengali)" className="input" />
              <input name="classes" defaultValue={editingItem?.classes} placeholder="Classes (e.g., 6-10)" className="input" required />
              <input name="experienceYears" type="number" defaultValue={editingItem?.experienceYears} placeholder="Experience (years)" className="input" required />
              <input name="qualification" defaultValue={editingItem?.qualification} placeholder="Qualification" className="input" />
              <input name="qualificationBn" defaultValue={editingItem?.qualificationBn} placeholder="Qualification (Bengali)" className="input" />
              <input name="preferredArea" defaultValue={editingItem?.preferredArea} placeholder="Preferred Area" className="input" required />
              <select name="upazilaId" defaultValue={editingItem?.upazilaId} className="input" required>
                <option value="">Select Upazila</option>
                {upazilas.map((u) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
              <input name="expectedFee" type="number" step="0.01" defaultValue={editingItem?.expectedFee} placeholder="Expected Fee" className="input" />
            </div>
            <textarea name="additionalInfo" defaultValue={editingItem?.additionalInfo} placeholder="Additional Info" className="input" rows="3" />
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
              <th className="text-left p-3">Subjects</th>
              <th className="text-left p-3">Classes</th>
              <th className="text-left p-3">Experience</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tutors.map((tutor) => (
              <tr key={tutor.id} className="border-b">
                <td className="p-3">{tutor.id}</td>
                <td className="p-3">{tutor.tutorName}</td>
                <td className="p-3">{tutor.subjects}</td>
                <td className="p-3">{tutor.classes}</td>
                <td className="p-3">{tutor.experienceYears} years</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${tutor.status === 'APPROVED' ? 'bg-green-100 text-green-800' : tutor.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {tutor.status}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingItem(tutor); setShowForm(true); }} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => window.confirm('Delete?') && deleteMutation.mutate(tutor.id)} className="text-red-600 hover:underline">Delete</button>
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
