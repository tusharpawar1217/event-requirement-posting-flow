import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function createRequirement(payload) {
  const response = await api.post('/requirements', payload);
  return response.data;
}

export default api;
