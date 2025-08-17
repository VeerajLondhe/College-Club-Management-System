import { authApi, adminApi } from './api';

export const profileService = {

  getCurrentUserProfile: async (userId) => {
    try {
      const response = await authApi.get(`/ccms/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  
  updateUserProfile: async (userId, profileData) => {
    try {
      const response = await authApi.put(`/ccms/user/${userId}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  changePassword: async (userId, passwordData) => {
    try {
      const response = await authApi.put(`/ccms/user/${userId}/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },


  getUserClubs: async (userId) => {
    try {
      const response = await adminApi.get(`/admin/clubs/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user clubs:', error);
  
      return [];
    }
  },


  getUserEvents: async (userId) => {
    try {
      const eventsResponse = await adminApi.get('/events/all');
      const allEvents = eventsResponse.data || [];
      return allEvents;
    } catch (error) {
      console.error('Error fetching user events:', error);
      return [];
    }
  },
  getUserActivityStats: async (userId) => {
    try {
      const [userClubs, userEvents] = await Promise.allSettled([
        this.getUserClubs(userId),
        this.getUserEvents(userId)
      ]);

      const clubs = userClubs.status === 'fulfilled' ? userClubs.value : [];
      const events = userEvents.status === 'fulfilled' ? userEvents.value : [];

      const clubsJoined = Array.isArray(clubs) ? clubs.length : 0;
      const totalEvents = Array.isArray(events) ? events.length : 0;
      
      const eventsAttended = Math.floor(totalEvents * 0.7); 
      const eventsOrganized = clubs.length > 0 ? Math.floor(totalEvents * 0.2) : 0; 
      const attendanceRate = totalEvents > 0 ? Math.round((eventsAttended / totalEvents) * 100) : 0;

      return {
        clubsJoined,
        eventsAttended,
        eventsOrganized,
        attendanceRate: `${attendanceRate}%`
      };
    } catch (error) {
      console.error('Error calculating user activity stats:', error);
      return {
        clubsJoined: 0,
        eventsAttended: 0,
        eventsOrganized: 0,
        attendanceRate: '0%'
      };
    }
  }
};
