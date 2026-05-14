import api from './axiosConfig';

export async function getAbout() {
  const response = await api.get('/about');
  return response.data.data;
}

export async function updateAbout(payload) {
  const response = await api.put('/about', payload);
  return response.data.data;
}
