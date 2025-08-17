import { serviceRouter } from './serviceRouter';
import { adminApi, studentApi } from './api';
import { clubService } from './clubService';

export const eventService = {
  
  getAllEventsUniversal: () => {
    return serviceRouter.events.getAll();
  },

  createEventUniversal: (eventData) => {
    return serviceRouter.events.create(eventData);
  },

  updateEventUniversal: (id, eventData) => {
    return serviceRouter.events.update(id, eventData);
  },

  deleteEventUniversal: (id) => {
    return serviceRouter.events.delete(id);
  },

  
  getAllEvents: async () => {
    try {
      
      const clubsResponse = await clubService.getActiveClubs();
      const clubs = clubsResponse.data;
      
      
      const eventsWithClubs = [];
      
      clubs.forEach(club => {
        if (club.events && club.events.length > 0) {
          club.events.forEach(event => {
            eventsWithClubs.push({
              ...event,
              club: club 
            });
          });
        }
      });
      
      return {
        data: eventsWithClubs,
        status: 200
      };
    } catch (error) {
      console.error('Error in getAllEvents:', error);
      
      return adminApi.get('/events/all');
    }
  },

 
  getAllEventsBasic: () => {
    return adminApi.get('/events/all');
  },

  getEventById: (id) => {
    
    return adminApi.get(`/events/${id}`);
  },

  createEvent: (eventData) => {
    return adminApi.post('/events', eventData);
  },

  updateEvent: (id, eventData) => {
    
    return adminApi.put(`/events/${id}`, eventData);
  },

  deleteEvent: async (id) => {
    
    const deleteEndpoints = [
      `/events/delete/${id}`, 
      `/events/${id}`,         
      `/admin/events/${id}`, 
    ];
    
    let lastError = null;
    
    for (const endpoint of deleteEndpoints) {
      try {
        console.log(`Attempting delete with endpoint: ${endpoint}`);
        const response = await adminApi.delete(endpoint);
        console.log(`Delete successful with endpoint: ${endpoint}`, response);
        return response;
      } catch (error) {
        console.log(`Delete failed with endpoint: ${endpoint}`, {
          status: error.response?.status,
          message: error.message
        });
        lastError = error;
        
        
        if (error.response?.status === 500) {
          console.log('Got 500 error - likely database constraint issue, not trying other endpoints');
          throw error;
        }
        
       
        continue;
      }
    }
    

    throw lastError;
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

  
  getClubEvents: (clubId) => {
    return adminApi.get(`/events/club/${clubId}`);
  },

  
  getUserRegisteredEvents: (userId) => {
    return studentApi.get(`/api/events/user/${userId}/registered`);
  },


  submitEventForApproval: (eventData) => {
    return adminApi.post('/events/submit-for-approval', eventData);
  },

  
  getPendingEvents: () => {
    return adminApi.get('/events/pending-approval');
  },

  
  approveEvent: (eventId) => {
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
  },

  
  requestEvent: (eventData) => {
    return studentApi.post('/api/events/request', eventData);
  },

 
  getMyClubEvents: (headUserId) => {
    return studentApi.get(`/api/events/my-club/approved/${headUserId}`);
  },

  getMyClubAllEvents: (headUserId) => {
    return studentApi.get(`/api/events/my-club/all/${headUserId}`);
  },

  
  assignTask: (assignData) => {
    return studentApi.post('/api/events/assign-single', assignData);
  },

  registerForEventStudent: (eventId, userId) => {
    return studentApi.post(`/api/events/${eventId}/register`, { userId: userId });
  },

  unregisterFromEventStudent: (eventId, userId) => {
    return studentApi.delete(`/api/events/${eventId}/unregister/${userId}`);
  },

  isUserRegisteredForEvent: (eventId, userId) => {
    return studentApi.get(`/api/events/${eventId}/is-registered/${userId}`);
  },


  getAvailableEventsStudent: () => {
    return studentApi.get('/api/events/available');
  }
};
