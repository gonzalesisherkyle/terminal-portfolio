import api from './axiosConfig';

export async function submitContact(payload) {
  const response = await api.post('/contact', payload);
  return response.data.data;
}

export async function getContacts() {
  const response = await api.get('/contact');
  return response.data.data || [];
}

export async function markAsRead(id) {
  const response = await api.put(`/contact/${id}`);
  return response.data.data;
}

export async function deleteContact(id) {
  const response = await api.delete(`/contact/${id}`);
  return response.data.data;
}
