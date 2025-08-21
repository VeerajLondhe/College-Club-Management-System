import { authApi, adminApi, studentApi } from './api';


export const integratedApiService = {

  auth: {
    login: (credentials) => {
      return authApi.post('/ccms/user/login', credentials);
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

    getCurrentUser: (id) => {
      return authApi.get(`/ccms/user/me?id=${id}`);
    },

    logout: () => {
      return authApi.post('/ccms/user/logout');
    },

    getAllUsers: () => {
      return authApi.get('/ccms/user/all');
    },

    getUserById: (id) => {
      return authApi.get(`/ccms/user/getbyid?id=${id}`);
    }
  },

  
  admin: {
    clubs: {
      getAllClubs: () => {
        return adminApi.get('/admin/clubs/all');
      },

      getActiveClubs: () => {
        return adminApi.get('/admin/clubs/active');
      },

      getBasicActiveClubs: () => {
        return adminApi.get('/admin/clubs/basic-active');
      },

      getClubsByStatus: (status) => {
        return adminApi.get(`/admin/clubs/status/${status}`);
      },

      getClubById: (id) => {
        return adminApi.get(`/admin/clubs/${id}`);
      },

      approveClub: (id) => {
        return adminApi.put(`/admin/clubs/approve/${id}`);
      },

      deleteClub: (id) => {
        return adminApi.delete(`/admin/clubs/delete/${id}`);
      },

      createClub: (clubData) => {
        return adminApi.post('/admin/clubs', clubData);
      },

      updateClub: (id, clubData) => {
        return adminApi.put(`/admin/clubs/${id}`, clubData);
      },

      getClubMembers: (clubId) => {
        return adminApi.get(`/admin/clubs/${clubId}/members`);
      },

      addMemberToClub: (clubId, memberId) => {
        return adminApi.post(`/admin/clubs/${clubId}/members`, { memberId });
      },

      removeMemberFromClub: (clubId, memberId) => {
        return adminApi.delete(`/admin/clubs/${clubId}/members/${memberId}`);
      },

      getClubEvents: (clubId) => {
        return adminApi.get(`/admin/clubs/${clubId}/events`);
      },

      getClubByHead: (userId) => {
        return adminApi.get(`/admin/clubs/head/${userId}`);
      }
    },

    events: {
      getAllEvents: () => {
        return adminApi.get('/events/all');
      },

      getEventById: (id) => {
        return adminApi.get(`/events/${id}`);
      },

      getActiveEventsByClub: (clubId) => {
        return adminApi.get(`/events/club/${clubId}`);
      },

      getAllPendingEvents: () => {
        return adminApi.get('/events/pending');
      },

      approveEvent: (eventId) => {
        return adminApi.put(`/events/approve/${eventId}`);
      },

      deleteEvent: (eventId) => {
        return adminApi.delete(`/events/delete/${eventId}`);
      },

      createEvent: (eventData) => {
        return adminApi.post('/events', eventData);
      },

      updateEvent: (id, eventData) => {
        return adminApi.put(`/events/${id}`, eventData);
      },

      getEventAttendees: (eventId) => {
        return adminApi.get(`/events/${eventId}/attendees`);
      },

      registerForEvent: (eventId, memberId) => {
        return adminApi.post(`/events/${eventId}/register`, { memberId });
      },

      unregisterFromEvent: (eventId, memberId) => {
        return adminApi.delete(`/events/${eventId}/register/${memberId}`);
      },

      getUpcomingEvents: () => {
        return adminApi.get('/events/upcoming');
      },

      searchEvents: (query) => {
        return adminApi.get(`/events/search?q=${encodeURIComponent(query)}`);
      },

      getUserRegisteredEvents: (userId) => {
        return adminApi.get(`/events/user/${userId}/registered`);
      },

      submitEventForApproval: (eventData) => {
        return adminApi.post('/events/submit-for-approval', eventData);
      },

      getPendingEvents: () => {
        return adminApi.get('/events/pending-approval');
      },

      approveEventById: (eventId) => {
        return adminApi.put(`/events/${eventId}/approve`);
      },

      rejectEvent: (eventId, reason) => {
        return adminApi.put(`/events/${eventId}/reject`, { reason });
      },

      getEventsByApprovalStatus: (status) => {
        return adminApi.get(`/events/approval-status/${status}`);
      },

      getClubHeadSubmittedEvents: (userId) => {
        return adminApi.get(`/events/club-head/${userId}/submitted`);
      }
    }
  },

  
  student: {
    members: {
      getAllMembers: () => {
        return studentApi.get('/members/all');
      },

      getMemberById: (id) => {
        return studentApi.get(`/members/${id}`);
      },

      createMember: (memberData) => {
        return studentApi.post('/members', memberData);
      },

      updateMember: (id, memberData) => {
        return studentApi.put(`/members/${id}`, memberData);
      },

      deleteMember: (id) => {
        return studentApi.delete(`/members/delete/${id}`);
      },

      getMemberClubs: (memberId) => {
        return studentApi.get(`/members/${memberId}/clubs`);
      },

      getMemberEvents: (memberId) => {
        return studentApi.get(`/members/${memberId}/events`);
      },

      searchMembers: (query) => {
        return studentApi.get(`/members/search?q=${encodeURIComponent(query)}`);
      }
    },

    clubs: {
      
      getUserJoinedClubs: (userId) => {
        return studentApi.get(`/api/Club/user/joined/${userId}`);
      },

      
      getAvailableClubs: (userId) => {
        return studentApi.get(`/api/Club/available/${userId}`);
      },

      
      requestClubCreation: (clubData) => {
        return studentApi.post('/api/Student/request', clubData);
      },

      
      sendJoinRequest: (joinData) => {
        return studentApi.post('/api/Student/join', joinData);
      },

      
      getPendingJoinRequests: (headUserId) => {
        return studentApi.get(`/api/Student/requests/${headUserId}`);
      },

      
      approveJoinRequest: (approveData) => {
        return studentApi.put('/api/Student/approve', approveData);
      },

      
      getMyClubMembers: (headUserId) => {
        return studentApi.get(`/members/${headUserId}`);
      },

      
      removeMember: (removeData) => {
        return studentApi.delete('/api/Student/remove', { data: removeData });
      },

     
      getMyClub: (headUserId) => {
        return studentApi.get(`/api/Student/my-club/${headUserId}`);
      },

      
      getAllClubs: () => {
        return studentApi.get('/api/Student');
      }
    },

    events: {
      
      requestEventCreation: (headUserId, eventData) => {
        return studentApi.post(`/api/Events/request?headUserId=${headUserId}`, eventData);
      },

      
      getMyClubApprovedEvents: (headUserId) => {
        return studentApi.get(`/api/Events/my-club/approved/${headUserId}`);
      },

      
      getAvailableEvents: () => {
        return studentApi.get('/api/Events/available');
      },

      
      getAllTasks: () => {
        return studentApi.get('/api/Events/all');
      },

      
      assignSingleTask: (assignData) => {
        return studentApi.post('/api/Events/assign-single', assignData);
      }
    }
  }
};


export const apiTestFunctions = {
  
  testAuthEndpoints: async () => {
    const results = {};
    try {
      console.log('Testing Auth Service endpoints...');
      
      
      results.getAllUsers = await integratedApiService.auth.getAllUsers();
      
      console.log('Auth endpoints test completed');
    } catch (error) {
      console.error('Auth endpoints test failed:', error);
      results.error = error.message;
    }
    return results;
  },


  testAdminEndpoints: async () => {
    const results = {};
    try {
      console.log('Testing Admin Service endpoints...');
      
      
      results.getAllClubs = await integratedApiService.admin.clubs.getAllClubs();
      
      
      results.getAllEvents = await integratedApiService.admin.events.getAllEvents();
      
      console.log('Admin endpoints test completed');
    } catch (error) {
      console.error('Admin endpoints test failed:', error);
      results.error = error.message;
    }
    return results;
  },

  testStudentEndpoints: async () => {
    const results = {};
    try {
      console.log('Testing Student Service endpoints...');
      
      
      results.getAllMembers = await integratedApiService.student.members.getAllMembers();
      
      
      results.getAllClubs = await integratedApiService.student.clubs.getAllClubs();
      
      
      results.getAvailableEvents = await integratedApiService.student.events.getAvailableEvents();
      
      console.log('Student endpoints test completed');
    } catch (error) {
      console.error('Student endpoints test failed:', error);
      results.error = error.message;
    }
    return results;
  },

  
  testAllEndpoints: async () => {
    console.log('Starting comprehensive API test...');
    
    const authResults = await apiTestFunctions.testAuthEndpoints();
    const adminResults = await apiTestFunctions.testAdminEndpoints();
    const studentResults = await apiTestFunctions.testStudentEndpoints();
    
    return {
      auth: authResults,
      admin: adminResults,
      student: studentResults,
      timestamp: new Date().toISOString()
    };
  }
};
