import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { hospitalApi } from '../services/api';
import UpazilaFilter from '../components/UpazilaFilter';

export default function Hospitals() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedUpazila, setSelectedUpazila] = useState(searchParams.get('upazila') || '');

  const { data: hospitals, isLoading } = useQuery({
    queryKey: ['hospitals', selectedUpazila],
    queryFn: () => {
      const params = {};
      if (selectedUpazila) params.upazilaId = selectedUpazila;
      return hospitalApi.getAll(params).then(res => res.data);
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
      <h1 className="text-3xl font-bold mb-8">Hospitals</h1>
      
      <UpazilaFilter value={selectedUpazila} onChange={handleUpazilaChange} />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals?.map((hospital) => (
          <div key={hospital.id} className="card">
            <h2 className="text-xl font-semibold mb-2">{hospital.name}</h2>
            <p className="text-gray-600 mb-2">{hospital.nameBn}</p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-medium">Type:</span> {hospital.type}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-medium">Upazila:</span> {hospital.upazila?.name} ({hospital.upazila?.nameBn})
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-medium">Address:</span> {hospital.address}
            </p>
            {hospital.phone && (
              <p className="text-sm text-gray-500">
                <span className="font-medium">Phone:</span> {hospital.phone}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
