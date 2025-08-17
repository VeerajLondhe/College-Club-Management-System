import { authApi } from './api';


export const authService = {
 
  login: (credentials) => {
    return authApi.post('/ccms/user/login', {
      username: credentials.username || credentials.email,
      password: credentials.password
    });
  },

 
  register: (userData) => {
    return authApi.post('/ccms/user/register', userData);
  },

  
  forgotPassword: (email) => {
    return authApi.post('/ccms/user/forgot-password', { email });
  },

 
  resetPassword: (token, newPassword) => {
    return authApi.post('/ccms/user/reset-password', { token, newPassword });
  },

  getCurrentUser: (userId) => {
    return authApi.get(`/ccms/user/getbyid?id=${userId}`);
  },

  logout: () => {
    return authApi.post('/ccms/user/logout');
  },


  getAllUsers: () => {
    return authApi.get('/ccms/user/all');
  }
};
