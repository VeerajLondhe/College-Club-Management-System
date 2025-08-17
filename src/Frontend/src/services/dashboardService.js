import { adminApi, authApi } from './api';

export const dashboardService = {
  
  getDashboardStats: async () => {
    try {
      
      const [clubsResponse, eventsResponse] = await Promise.all([
        adminApi.get('/admin/clubs/all'),
        adminApi.get('/events/all')
      ]);

      
      const clubs = clubsResponse.data || [];
      const events = eventsResponse.data || [];
      
      
      const activeClubs = clubs.filter(club => club.status === true).length;
      
      const activeEvents = events.filter(event => event.status === true).length;
      
     
      const totalEvents = events.length;

      
      let totalMembers = 0;
      try {
        console.log('Fetching member count from /ccms/user/all...');
        const membersResponse = await authApi.get('/ccms/user/all');
        console.log('Members response:', membersResponse);
        
        if (membersResponse.data && Array.isArray(membersResponse.data)) {
          totalMembers = membersResponse.data.length;
          console.log('Successfully fetched', totalMembers, 'members');
        } else {
          console.warn('Invalid members response format:', membersResponse.data);
          totalMembers = 0;
        }
      } catch (error) {
        console.error('Error fetching member count:', error);
        
        
        const uniqueUsers = new Set();
        clubs.forEach(club => {
          if (club.user && club.user.uid) {
            uniqueUsers.add(club.user.uid);
          }
        });
        totalMembers = uniqueUsers.size;
      }

      return {
        totalClubs: clubs.length,
        activeClubs,
        totalEvents,
        activeEvents,
        totalMembers,
        upcomingEvents: activeEvents 
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  
  getClubHeadStats: async (userId) => {
    try {
      const [clubsResponse, eventsResponse] = await Promise.all([
        adminApi.get('/admin/clubs/all'),
        adminApi.get('/events/all')
      ]);

      const clubs = clubsResponse.data || [];
      const events = eventsResponse.data || [];

      
      const userClub = clubs.find(club => club.user?.uid === userId);
      
      if (!userClub) {
        return {
          totalMembers: 0,
          totalEvents: 0,
          upcomingEvents: 0,
          clubName: 'No Club Found'
        };
      }

      
      const clubEvents = userClub.events || [];
      const activeEvents = clubEvents.filter(event => event.status === true);

      return {
        totalMembers: userClub.memberCount || 0,
        totalEvents: clubEvents.length,
        upcomingEvents: activeEvents.length,
        clubName: userClub.cname,
        clubId: userClub.cid
      };
    } catch (error) {
      console.error('Error fetching club head stats:', error);
      throw error;
    }
  },


  getRecentActivities: async () => {
    try {
      const [clubsResponse, eventsResponse] = await Promise.all([
        adminApi.get('/admin/clubs/all'),
        adminApi.get('/events/all')
      ]);

      const clubs = clubsResponse.data || [];
      const events = eventsResponse.data || [];

      
      const recentClubs = clubs
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
        .map(club => ({
          id: club.cid,
          type: 'club',
          title: `New Club: ${club.cname}`,
          description: club.description,
          date: club.date,
          user: club.user?.uname
        }));

     
      const recentEvents = events
        .filter(event => event.status === true)
        .slice(0, 5)
        .map(event => ({
          id: event.eid,
          type: 'event',
          title: event.description,
          description: `Event ${event.eid}`,
          status: event.status,
          banner: event.banner
        }));

      return {
        recentClubs,
        recentEvents,
        combined: [...recentClubs, ...recentEvents]
          .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
          .slice(0, 10)
      };
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  }
};
