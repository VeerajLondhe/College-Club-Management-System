import { studentApi } from './api';

export const studentService = {
  
  getMyClub: (headUserId) => {
    return studentApi.get(`/api/Student/my-club/${headUserId}`);
  },

  requestClubCreation: (clubData) => {
    return studentApi.post('/api/Student/request', clubData);
  },


  getPendingJoinRequests: (headUserId) => {
    return studentApi.get(`/api/Student/requests/${headUserId}`);
  },

  approveJoinRequest: (approveData) => {
    return studentApi.put('/api/Student/approve', approveData);
  },

  getClubMembers: (headUserId) => {
    return studentApi.get(`/api/Student/members/${headUserId}`);
  },

  removeMember: (removeData) => {
    return studentApi.delete('/api/Student/remove', { data: removeData });
  },

  
  getClubDashboard: (headUserId) => {
    return studentApi.get(`/api/Club/dashboard/${headUserId}`);
  },

  
  getAllClubs: () => {
    return studentApi.get('/api/Student');
  },

  joinClub: (joinData) => {
    return studentApi.post('/api/Student/join', joinData);
  }
};
