import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { toLetApi } from '../services/api';
import UpazilaFilter from '../components/UpazilaFilter';

export default function ToLets() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedUpazila, setSelectedUpazila] = useState(searchParams.get('upazila') || '');

  const { data: tolets, isLoading } = useQuery({
    queryKey: ['tolets', selectedUpazila],
    queryFn: () => {
      const params = {};
      if (selectedUpazila) params.upazilaId = selectedUpazila;
      return toLetApi.getAll(params).then(res => res.data);
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
      <h1 className="text-3xl font-bold mb-8">To-Let Properties</h1>
      
      <UpazilaFilter value={selectedUpazila} onChange={handleUpazilaChange} />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tolets?.map((tolet) => (
          <div key={tolet.id} className="card">
            <h2 className="text-xl font-semibold mb-2">{tolet.title}</h2>
            <p className="text-2xl font-bold text-primary-600 mb-2">৳{tolet.rent}/month</p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-medium">Type:</span> {tolet.propertyType}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-medium">Upazila:</span> {tolet.upazila?.name} ({tolet.upazila?.nameBn})
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-medium">Address:</span> {tolet.address}
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-medium">Contact:</span> {tolet.contactPhone}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
