import axios from 'axios';
import { getToken } from './utils/auth';

// Change this to your Render backend URL
const API_URL = 'https://your-backend-on-render.com/api';

const instance = axios.create({
  baseURL: API_URL,
});

instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

export default instance;