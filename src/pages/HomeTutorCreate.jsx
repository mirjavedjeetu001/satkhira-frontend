import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { tutorApi, upazilaApi } from '../services/api';

export default function HomeTutorCreate() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    tutorName: '',
    tutorNameBn: '',
    phone: '',
    email: '',
    subjects: '',
    subjectsBn: '',
    classes: '',
    experienceYears: '',
    qualification: '',
    qualificationBn: '',
    preferredArea: '',
    upazilaId: '',
    expectedFee: '',
    additionalInfo: '',
  });

  // Fetch upazilas
  const { data: upazilaData } = useQuery({
    queryKey: ['upazilas'],
    queryFn: upazilaApi.getAll,
  });

  const upazilas = Array.isArray(upazilaData) ? upazilaData : (upazilaData?.data || []);

  const createMutation = useMutation({
    mutationFn: tutorApi.create,
    onSuccess: () => {
      setSuccess('Home tutor listing submitted successfully! It will be visible after admin approval.');
      setError('');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Failed to submit home tutor listing');
      setSuccess('');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.tutorName || !formData.phone || !formData.subjects || !formData.classes) {
      setError('Please fill in all required fields');
      return;
    }

    const submitData = {
      ...formData,
      experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : 0,
      upazilaId: formData.upazilaId ? parseInt(formData.upazilaId) : null,
    };

    createMutation.mutate(submitData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="card card-premium">
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/profile')}
              className="btn btn-secondary mr-4"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="text-4xl mr-3">👨‍🏫</span>
                Add Home Tutor Listing
              </h1>
              <p className="text-gray-600 mt-2">Fill in the details to create your tutoring profile</p>
            </div>
          </div>

          {success && (
            <div className="alert alert-success mb-6">
              <span className="text-2xl mr-2">✅</span>
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-danger mb-6">
              <span className="text-2xl mr-2">❌</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📝</span>
                Basic Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    Tutor Name (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="tutorName"
                    value={formData.tutorName}
                    onChange={handleChange}
                    className="input"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    Tutor Name (Bangla)
                  </label>
                  <input
                    type="text"
                    name="tutorNameBn"
                    value={formData.tutorNameBn}
                    onChange={handleChange}
                    className="input"
                    placeholder="জন ডো"
                  />
                </div>
                <div>
                  <label className="label">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                    placeholder="+880 1234-567890"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    placeholder="tutor@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Teaching Details */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📚</span>
                Teaching Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    Subjects (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subjects"
                    value={formData.subjects}
                    onChange={handleChange}
                    className="input"
                    placeholder="Math, Physics, Chemistry"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple subjects with commas</p>
                </div>
                <div>
                  <label className="label">
                    Subjects (Bangla)
                  </label>
                  <input
                    type="text"
                    name="subjectsBn"
                    value={formData.subjectsBn}
                    onChange={handleChange}
                    className="input"
                    placeholder="গণিত, পদার্থবিজ্ঞান, রসায়ন"
                  />
                </div>
                <div>
                  <label className="label">
                    Classes <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="classes"
                    value={formData.classes}
                    onChange={handleChange}
                    className="input"
                    placeholder="Class 6-10, SSC, HSC"
                    required
                  />
                </div>
                <div>
                  <label className="label">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    className="input"
                    placeholder="5"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Qualifications */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🎓</span>
                Qualifications
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    Qualification (English)
                  </label>
                  <textarea
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className="input min-h-24"
                    placeholder="BSc in Mathematics from Dhaka University"
                  />
                </div>
                <div>
                  <label className="label">
                    Qualification (Bangla)
                  </label>
                  <textarea
                    name="qualificationBn"
                    value={formData.qualificationBn}
                    onChange={handleChange}
                    className="input min-h-24"
                    placeholder="ঢাকা বিশ্ববিদ্যালয় থেকে গণিতে বিএসসি"
                  />
                </div>
              </div>
            </div>

            {/* Location & Fee */}
            <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📍</span>
                Location & Fee
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">
                    Upazila
                  </label>
                  <select
                    name="upazilaId"
                    value={formData.upazilaId}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="">Select Upazila</option>
                    {upazilas.map((upazila) => (
                      <option key={upazila.id} value={upazila.id}>
                        {upazila.name} ({upazila.nameBn})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">
                    Preferred Area
                  </label>
                  <input
                    type="text"
                    name="preferredArea"
                    value={formData.preferredArea}
                    onChange={handleChange}
                    className="input"
                    placeholder="Satkhira Sadar, Tala"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="label">
                    Expected Fee
                  </label>
                  <input
                    type="text"
                    name="expectedFee"
                    value={formData.expectedFee}
                    onChange={handleChange}
                    className="input"
                    placeholder="1000-2000 BDT per month"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">ℹ️</span>
                Additional Information
              </h2>
              <div>
                <label className="label">
                  Additional Info
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  className="input min-h-32"
                  placeholder="Any other relevant information about your tutoring services..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="btn btn-primary flex-1"
              >
                {createMutation.isPending ? 'Submitting...' : 'Submit for Approval'}
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-2">
                <span className="text-xl">ℹ️</span>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Note</p>
                  <p>Your listing will be reviewed by an administrator before it becomes publicly visible. You will be notified once it's approved.</p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
