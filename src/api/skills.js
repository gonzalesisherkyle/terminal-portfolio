import api from './axiosConfig';

export async function getSkills() {
  const response = await api.get('/skills');
  return response.data.data || [];
}

export async function createSkill(payload) {
  const response = await api.post('/skills', payload);
  return response.data.data;
}

export async function updateSkill(id, payload) {
  const response = await api.put(`/skills/${id}`, payload);
  return response.data.data;
}

export async function deleteSkill(id) {
  const response = await api.delete(`/skills/${id}`);
  return response.data.data;
}
