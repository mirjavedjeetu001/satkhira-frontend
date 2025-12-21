import { useQuery } from '@tanstack/react-query';
import { upazilaApi } from '../services/api';

export default function UpazilaFilter({ value, onChange, showAll = true }) {
  const { data: upazilas, isLoading } = useQuery({
    queryKey: ['upazilas'],
    queryFn: () => upazilaApi.getAll().then(res => res.data),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="mb-6">
        <select className="input w-full md:w-64" disabled>
          <option>Loading...</option>
        </select>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <select 
        className="input w-full md:w-64"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      >
        {showAll && <option value="">All Upazilas</option>}
        {upazilas?.map((upazila) => (
          <option key={upazila.id} value={upazila.id}>
            {upazila.name} ({upazila.nameBn})
          </option>
        ))}
      </select>
    </div>
  );
}
