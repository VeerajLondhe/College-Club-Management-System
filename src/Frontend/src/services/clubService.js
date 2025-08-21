import { serviceRouter, getApiForRole } from "./serviceRouter";
import { adminApi, studentApi } from "./api";


export const clubService = {
  
  getAllClubs: () => {
    
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    

    
    if (!userData || !token) {
      return adminApi.get("/admin/clubs/all");
    }

    return serviceRouter.clubs.getAll();
  },

  createClub: (clubData) => {
    return serviceRouter.clubs.create(clubData);
  },

  updateClub: (id, clubData) => {
    return serviceRouter.clubs.update(id, clubData);
  },

  deleteClub: (id) => {
    
    const userData = localStorage.getItem("user");
    const userRole = userData
      ? JSON.parse(userData).role?.rname || JSON.parse(userData).role
      : null;

    

    if (!userData) {

      
      return adminApi.delete(`/admin/clubs/delete/${id}`);
    }

    return serviceRouter.clubs.delete(id);
  },

  
  getClubById: (id) => {
    return adminApi.get(`/admin/clubs/${id}`);
  },

  approveClub: (id) => {
    return adminApi.put(`/admin/clubs/approve/${id}`);
  },

  getStatus: (bool) => {
    return adminApi.get(`/admin/clubs/status/${bool}`);
  },

  getActiveClubs: () => {
    return adminApi.get("/admin/clubs/active");
  },

  getBasicActiveClubs: () => {
    return adminApi.get("/admin/clubs/basic-active");
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
  },

  getUserJoinedClubs: (userId) => {
    return studentApi.get(`/api/Club/user/joined/${userId}`);
  },

  getAvailableClubs: (userId) => {
    return studentApi.get(`/api/Club/available/${userId}`);
  },

  requestClubCreation: (clubData) => {
    return studentApi.post("/api/Student/request", clubData);
  },

  sendJoinRequest: (joinData) => {
    return studentApi.post("/api/Student/join", joinData);
  },

  getPendingJoinRequests: (headUserId) => {
    return studentApi.get(`/api/Student/requests/${headUserId}`);
  },

  approveJoinRequest: (approveData) => {
    return studentApi.put("/api/Student/approve", approveData);
  },

  getMyClubMembers: (headUserId) => {
    return studentApi.get(`/members/${headUserId}`);
  },

  removeMember: (removeData) => {
    return studentApi.delete("/api/Student/remove", { data: removeData });
  },

  getMyClub: (headUserId) => {
    return studentApi.get(`/api/Student/my-club/${headUserId}`);
  },

  leaveClub: (clubId, userId) => {
    
    
    return studentApi.delete(`/api/Club/leave`, {
      data: { UserId: userId, ClubId: clubId },
    }).catch(error => {
     
      throw error; 
    });
  },

  isUserMemberOfClub: (clubId, userId) => {
    return studentApi.get(`/api/Club/${clubId}/is-member/${userId}`);
  },

  getUserClubMemberships: (userId) => {
    return studentApi.get(`/api/Club/user/${userId}/memberships`);
  },
};
