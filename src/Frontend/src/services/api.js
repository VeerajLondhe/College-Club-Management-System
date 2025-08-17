import axios from 'axios';
const SERVICE_URLS = {
  AUTH: process.env.REACT_APP_AUTH_SERVICE_URL || 'http://localhost:8081',
  ADMIN: process.env.REACT_APP_ADMIN_SERVICE_URL || 'http://localhost:8083',
  STUDENT: 'https://localhost:7173',
  STUDENT_HTTP_FALLBACK: 'http://localhost:5170',
};

const createApiInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (baseURL.startsWith('https://localhost')) {
    instance.defaults.httpsAgent = undefined; 
  }

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const authApi = createApiInstance(SERVICE_URLS.AUTH);
export const adminApi = createApiInstance(SERVICE_URLS.ADMIN);
export const studentApi = createApiInstance(SERVICE_URLS.STUDENT);

const api = authApi;
export default api;
