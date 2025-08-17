import { authApi, adminApi, studentApi } from './api';

const getUserRole = () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      const role = user.role?.rname || user.role;
      
      return role || 'student'; 
    } catch (error) {
      
      return 'student'; 
    }
  }
  return null;
};

export const getApiForRole = () => {
  const userRole = getUserRole();
  
  if (!userRole) {
    
    return authApi;
  }

  
  switch (userRole.toLowerCase()) {
    case 'admin':
      return adminApi;
    case 'student':
    default:
      return studentApi;
  }
};


export const serviceRouter = {
  
  auth: {
    login: (credentials) => authApi.post('/ccms/user/login', credentials),
    register: (userData) => authApi.post('/ccms/user/register', userData),
    forgotPassword: (email) => authApi.post('/ccms/user/forgot-password', { email }),
    resetPassword: (token, newPassword) => authApi.post('/ccms/user/reset-password', { token, newPassword }),
    logout: () => authApi.post('/ccms/user/logout'),
    getCurrentUser: (userId) => authApi.get(`/ccms/user/getbyid?id=${userId}`),
    getAllUsers: () => authApi.get('/ccms/user/all'),
  },

  
  clubs: {
    getAll: () => {
      const api = getApiForRole();
      const userRole = getUserRole();
      
      if (userRole === 'admin') {
        return api.get('/admin/clubs/all');
      } else {
        return api.get('/api/clubs'); 
      }
    },
    
    create: (clubData) => {
      const api = getApiForRole();
      const userRole = getUserRole();
      
      if (userRole === 'admin') {
        return api.post('/admin/clubs', clubData);
      } else {
        return api.post('/api/clubs', clubData);
      }
    },

    update: (id, clubData) => {
      const api = getApiForRole();
      const userRole = getUserRole();
      
      if (userRole === 'admin') {
        return api.put(`/admin/clubs/${id}`, clubData);
      } else {
        return api.put(`/api/clubs/${id}`, clubData);
      }
    },

    delete: (id) => {
      const api = getApiForRole();
      const userRole = getUserRole();
      
      
      if (userRole === 'admin') {
      
        return api.delete(`/admin/clubs/delete/${id}`);
      } else {
      
        return api.delete(`/api/clubs/${id}`);
      }
    }
  },

  events: {
    getAll: () => {
      const api = getApiForRole();
      const userRole = getUserRole();
      
      if (userRole === 'admin') {
        return api.get('/events/all');
      } else {
        return api.get('/api/Events/available');
      }
    },
    
    create: (eventData) => {
      const api = getApiForRole();
      const userRole = getUserRole();
      
      if (userRole === 'admin') {
        return api.post('/events', eventData);
      } else {
        return api.post('/api/Events', eventData);
      }
    },

    update: (id, eventData) => {
      const api = getApiForRole();
      const userRole = getUserRole();
      
      if (userRole === 'admin') {
        return api.put(`/events/${id}`, eventData);
      } else {
        return api.put(`/api/Events/${id}`, eventData);
      }
    },

    delete: (id) => {
      const api = getApiForRole();
      const userRole = getUserRole();
      
      if (userRole === 'admin') {
        return api.delete(`/events/${id}`);
      } else {
        return api.delete(`/api/Events/${id}`);
      }
    }
  },

  members: {
    getAll: () => {
      const api = getApiForRole();
      const userRole = getUserRole();
      
      if (userRole === 'admin') {
        return api.get('/admin/members/all');
      } else {
        return api.get('/members/all');
      }
    }
  }
};

export default serviceRouter;
