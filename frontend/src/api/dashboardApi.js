import api from '../services/api';

export async function getAdminDashboard() {
  const response = await api.rawClient.get('/admin/dashboard');
  return response.data;
}