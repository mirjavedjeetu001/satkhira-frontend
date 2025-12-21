import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hospitalApi, tutorApi, toLetApi, businessApi } from '../../services/api';

export default function AdminApprovals() {
  const [activeTab, setActiveTab] = useState('hospitals');
  const queryClient = useQueryClient();

  const { data: hospitals } = useQuery({
    queryKey: ['pending-hospitals'],
    queryFn: () => hospitalApi.getPending().then(res => res.data),
    enabled: activeTab === 'hospitals',
  });

  const { data: tutors } = useQuery({
    queryKey: ['pending-tutors'],
    queryFn: () => tutorApi.getPending().then(res => res.data),
    enabled: activeTab === 'tutors',
  });

  const { data: tolets } = useQuery({
    queryKey: ['pending-tolets'],
    queryFn: () => toLetApi.getPending().then(res => res.data),
    enabled: activeTab === 'tolets',
  });

  const { data: businesses } = useQuery({
    queryKey: ['pending-businesses'],
    queryFn: () => businessApi.getPending().then(res => res.data),
    enabled: activeTab === 'businesses',
  });

  const approveMutation = useMutation({
    mutationFn: ({ type, id }) => {
      switch (type) {
        case 'hospitals': return hospitalApi.approve(id);
        case 'tutors': return tutorApi.approve(id);
        case 'tolets': return toLetApi.approve(id);
        case 'businesses': return businessApi.approve(id);
      }
    },
    onSuccess: (_, { type }) => {
      queryClient.invalidateQueries([`pending-${type}`]);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ type, id }) => {
      switch (type) {
        case 'hospitals': return hospitalApi.reject(id);
        case 'tutors': return tutorApi.reject(id);
        case 'tolets': return toLetApi.reject(id);
        case 'businesses': return businessApi.reject(id);
      }
    },
    onSuccess: (_, { type }) => {
      queryClient.invalidateQueries([`pending-${type}`]);
    },
  });

  const tabs = [
    { id: 'hospitals', label: 'Hospitals', data: hospitals },
    { id: 'tutors', label: 'Home Tutors', data: tutors },
    { id: 'tolets', label: 'To-Let', data: tolets },
    { id: 'businesses', label: 'Businesses', data: businesses },
  ];

  const renderContent = () => {
    let data;
    switch (activeTab) {
      case 'hospitals': data = hospitals; break;
      case 'tutors': data = tutors; break;
      case 'tolets': data = tolets; break;
      case 'businesses': data = businesses; break;
    }

    if (!data || data.length === 0) {
      return <p className="text-gray-500">No pending approvals</p>;
    }

    return (
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">
                  {item.name || item.tutorName || item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.nameBn || item.tutorNameBn || item.titleBn}
                </p>
                <p className="text-gray-500 text-sm mt-2">{item.address}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => approveMutation.mutate({ type: activeTab, id: item.id })}
                  className="btn btn-primary text-sm"
                  disabled={approveMutation.isPending}
                >
                  Approve
                </button>
                <button
                  onClick={() => rejectMutation.mutate({ type: activeTab, id: item.id })}
                  className="btn btn-secondary text-sm"
                  disabled={rejectMutation.isPending}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Content Approvals</h1>

      <div className="card">
        <div className="flex space-x-4 border-b mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 px-4 transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary-600 text-primary-600 font-medium'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label} {tab.data && `(${tab.data.length})`}
            </button>
          ))}
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
