import { studentApi } from './api';

export const memberService = {
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
};
