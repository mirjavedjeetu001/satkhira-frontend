import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { tutorApi } from '../services/api';
import UpazilaFilter from '../components/UpazilaFilter';

export default function HomeTutors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedUpazila, setSelectedUpazila] = useState(searchParams.get('upazila') || '');

  const { data: tutors, isLoading } = useQuery({
    queryKey: ['tutors', selectedUpazila],
    queryFn: () => {
      const params = {};
      if (selectedUpazila) params.upazilaId = selectedUpazila;
      return tutorApi.getAll(params).then(res => res.data);
    },
  });

  const handleUpazilaChange = (upazilaId) => {
    setSelectedUpazila(upazilaId);
    if (upazilaId) {
      setSearchParams({ upazila: upazilaId });
    } else {
      setSearchParams({});
    }
  };

  if (isLoading) return <div className="container py-8">Loading...</div>;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Home Tutors</h1>
      
      <UpazilaFilter value={selectedUpazila} onChange={handleUpazilaChange} />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors?.map((tutor) => (
          <div key={tutor.id} className="card">
            <h2 className="text-xl font-semibold mb-2">{tutor.tutorName}</h2>
            <p className="text-gray-600 mb-2">{tutor.tutorNameBn}</p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-medium">Subjects:</span> {tutor.subjects}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-medium">Classes:</span> {tutor.classes}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-medium">Upazila:</span> {tutor.upazila?.name} ({tutor.upazila?.nameBn})
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-medium">Experience:</span> {tutor.experienceYears} years
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-medium">Phone:</span> {tutor.phone}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
