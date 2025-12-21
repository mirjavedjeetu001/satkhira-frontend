import api from '../lib/api';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const upazilaApi = {
  getAll: () => api.get('/upazilas'),
  getBySlug: (slug) => api.get(`/upazilas/${slug}`),
  seed: () => api.post('/upazilas/seed'),
  update: (id, data) => api.put(`/upazilas/${id}`, data),
  delete: (id) => api.delete(`/upazilas/${id}`),
};

export const hospitalApi = {
  getAll: (params) => api.get('/hospitals', { params }),
  getOne: (id) => api.get(`/hospitals/${id}`),
  getPending: () => api.get('/hospitals/pending'),
  create: (data) => api.post('/hospitals', data),
  update: (id, data) => api.put(`/hospitals/${id}`, data),
  delete: (id) => api.delete(`/hospitals/${id}`),
  approve: (id) => api.patch(`/hospitals/${id}/approve`),
  reject: (id) => api.patch(`/hospitals/${id}/reject`),
};

export const tutorApi = {
  getAll: (params) => api.get('/home-tutors', { params }),
  getOne: (id) => api.get(`/home-tutors/${id}`),
  getPending: () => api.get('/home-tutors/pending'),
  create: (data) => api.post('/home-tutors', data),
  update: (id, data) => api.put(`/home-tutors/${id}`, data),
  delete: (id) => api.delete(`/home-tutors/${id}`),
  approve: (id) => api.patch(`/home-tutors/${id}/approve`),
  reject: (id) => api.patch(`/home-tutors/${id}/reject`),
};

export const toLetApi = {
  getAll: (params) => api.get('/to-lets', { params }),
  getOne: (id) => api.get(`/to-lets/${id}`),
  getPending: () => api.get('/to-lets/pending'),
  create: (data) => api.post('/to-lets', data),
  update: (id, data) => api.put(`/to-lets/${id}`, data),
  delete: (id) => api.delete(`/to-lets/${id}`),
  approve: (id) => api.patch(`/to-lets/${id}/approve`),
  reject: (id) => api.patch(`/to-lets/${id}/reject`),
};

export const businessApi = {
  getAll: (params) => api.get('/businesses', { params }),
  getOne: (id) => api.get(`/businesses/${id}`),
  getPending: () => api.get('/businesses/pending'),
  create: (data) => api.post('/businesses', data),
  update: (id, data) => api.put(`/businesses/${id}`, data),
  delete: (id) => api.delete(`/businesses/${id}`),
  approve: (id) => api.patch(`/businesses/${id}/approve`),
  reject: (id) => api.patch(`/businesses/${id}/reject`),
};

export const userApi = {
  getAll: () => api.get('/users'),
  getPending: () => api.get('/users/pending'),
  approve: (id) => api.patch(`/users/${id}/approve`),
  suspend: (id) => api.patch(`/users/${id}/suspend`),
  getProfile: () => api.get('/users/me'),
  requestAccess: (data) => api.post('/users/request-access', data),
};

export const accessRequestApi = {
  create: (data) => api.post('/access-requests', data),
  getMyRequests: () => api.get('/access-requests/my-requests'),
  getAll: () => api.get('/access-requests'),
  getPending: () => api.get('/access-requests/pending'),
  approve: (id, adminNote) => api.patch(`/access-requests/${id}/approve`, { adminNote }),
  reject: (id, adminNote) => api.patch(`/access-requests/${id}/reject`, { adminNote }),
};

export const sliderApi = {
  getAll: () => api.get('/sliders'),
  getOne: (id) => api.get(`/sliders/${id}`),
  create: (data) => api.post('/sliders', data),
  update: (id, data) => api.put(`/sliders/${id}`, data),
  delete: (id) => api.delete(`/sliders/${id}`),
};

export const touristPlaceApi = {
  getAll: (params) => api.get('/tourist-places', { params }),
  getOne: (id) => api.get(`/tourist-places/${id}`),
  getPending: () => api.get('/tourist-places/pending'),
  create: (data) => api.post('/tourist-places', data),
  update: (id, data) => api.put(`/tourist-places/${id}`, data),
  delete: (id) => api.delete(`/tourist-places/${id}`),
  approve: (id) => api.patch(`/tourist-places/${id}/approve`),
  reject: (id) => api.patch(`/tourist-places/${id}/reject`),
};

export const blogApi = {
  getAll: () => api.get('/blogs'),
  getOne: (id) => api.get(`/blogs/${id}`),
  getBySlug: (slug) => api.get(`/blogs/slug/${slug}`),
  getPending: () => api.get('/blogs/pending'),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
  approve: (id) => api.patch(`/blogs/${id}/approve`),
  reject: (id) => api.patch(`/blogs/${id}/reject`),
};

// Settings API
export const settingsApi = {
  getAll: () => api.get('/settings'),
  getOne: (key) => api.get(`/settings/${key}`),
  update: (key, value) => api.put(`/settings/${key}`, { value }),
  bulkUpdate: (updates) => api.put('/settings', updates),
};

