import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { businessApi } from '../services/api';
import UpazilaFilter from '../components/UpazilaFilter';

export default function Businesses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedUpazila, setSelectedUpazila] = useState(searchParams.get('upazila') || '');

  const { data: businesses, isLoading } = useQuery({
    queryKey: ['businesses', selectedUpazila],
    queryFn: () => {
      const params = {};
      if (selectedUpazila) params.upazilaId = selectedUpazila;
      return businessApi.getAll(params).then(res => res.data);
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
      <h1 className="text-3xl font-bold mb-8">Local Businesses</h1>
      
      <UpazilaFilter value={selectedUpazila} onChange={handleUpazilaChange} />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businesses?.map((business) => (
          <div key={business.id} className="card">
            <h2 className="text-xl font-semibold mb-2">{business.name}</h2>
            <p className="text-gray-600 mb-2">{business.nameBn}</p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-medium">Type:</span> {business.businessType}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-medium">Upazila:</span> {business.upazila?.name} ({business.upazila?.nameBn})
            </p>
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-medium">Address:</span> {business.address}
            </p>
            <p className="text-sm text-gray-500">
              <span className="font-medium">Phone:</span> {business.phone}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
