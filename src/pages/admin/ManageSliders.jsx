import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sliderApi } from '../../services/api';

export default function ManageSliders() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    titleBn: '',
    description: '',
    descriptionBn: '',
    imageUrl: '',
    linkUrl: '',
    buttonText: '',
    isActive: true,
    displayOrder: 0,
  });

  const { data: sliders = [], isLoading } = useQuery({
    queryKey: ['sliders'],
    queryFn: async () => {
      const response = await sliderApi.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => sliderApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['sliders']);
      resetForm();
      alert('Slider created successfully!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to create slider');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => sliderApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['sliders']);
      resetForm();
      alert('Slider updated successfully!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to update slider');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => sliderApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['sliders']);
      alert('Slider deleted successfully!');
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Failed to delete slider');
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      titleBn: '',
      description: '',
      descriptionBn: '',
      imageUrl: '',
      linkUrl: '',
      buttonText: '',
      isActive: true,
      displayOrder: 0,
    });
    setEditingSlider(null);
    setIsModalOpen(false);
  };

  const handleEdit = (slider) => {
    setEditingSlider(slider);
    setFormData({
      title: slider.title,
      titleBn: slider.titleBn || '',
      description: slider.description || '',
      descriptionBn: slider.descriptionBn || '',
      imageUrl: slider.imageUrl,
      linkUrl: slider.linkUrl || '',
      buttonText: slider.buttonText || '',
      isActive: slider.isActive,
      displayOrder: slider.displayOrder,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this slider?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingSlider) {
      updateMutation.mutate({ id: editingSlider.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Hero Sliders</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          + Add New Slide
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : sliders.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🖼️</div>
          <h2 className="text-xl font-semibold mb-2">No sliders yet</h2>
          <p className="text-gray-600">Create your first hero slider</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sliders
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((slider) => (
              <div key={slider.id} className="card">
                <div className="flex gap-4">
                  <div className="w-48 h-32 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    {slider.imageUrl ? (
                      <img
                        src={slider.imageUrl}
                        alt={slider.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold">{slider.title}</h3>
                        {slider.titleBn && (
                          <p className="text-sm text-gray-600">{slider.titleBn}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            slider.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {slider.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                          Order: {slider.displayOrder}
                        </span>
                      </div>
                    </div>
                    {slider.description && (
                      <p className="text-gray-600 mb-2">{slider.description}</p>
                    )}
                    {slider.buttonText && slider.linkUrl && (
                      <p className="text-sm text-gray-500">
                        Button: "{slider.buttonText}" → {slider.linkUrl}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEdit(slider)}
                      className="btn btn-primary btn-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(slider.id)}
                      className="btn btn-danger btn-sm"
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingSlider ? 'Edit Slider' : 'Add New Slider'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title (Bangla)
                  </label>
                  <input
                    type="text"
                    value={formData.titleBn}
                    onChange={(e) =>
                      setFormData({ ...formData, titleBn: e.target.value })
                    }
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description (English)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="input"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description (Bangla)
                  </label>
                  <textarea
                    value={formData.descriptionBn}
                    onChange={(e) =>
                      setFormData({ ...formData, descriptionBn: e.target.value })
                    }
                    className="input"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="input"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Link URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, linkUrl: e.target.value })
                    }
                    className="input"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) =>
                      setFormData({ ...formData, buttonText: e.target.value })
                    }
                    className="input"
                    placeholder="Learn More"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          displayOrder: parseInt(e.target.value),
                        })
                      }
                      className="input"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={formData.isActive}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isActive: e.target.value === 'true',
                        })
                      }
                      className="input"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn btn-outline flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? 'Saving...'
                      : editingSlider
                      ? 'Update'
                      : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
