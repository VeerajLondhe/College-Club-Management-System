import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { reportsService } from '../services/reportsService';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalClubs: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    clubName: ''
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const role = user.role?.rname || user.role;
      const position = user.pos;

      if (role === 'admin' || role === 1) {
        
        const [dashboardStats, systemOverview, activities] = await Promise.allSettled([
          dashboardService.getDashboardStats(),
          reportsService.getSystemOverview(),
          dashboardService.getRecentActivities()
        ]);
        
        let finalStats = {
          totalMembers: 0,
          totalClubs: 0,
          totalEvents: 0,
          upcomingEvents: 0
        };
        
        if (systemOverview.status === 'fulfilled') {
          finalStats = {
            totalMembers: systemOverview.value.totalMembers || 0,
            totalClubs: systemOverview.value.totalClubs || 0,
            totalEvents: systemOverview.value.totalEvents || 0,
            upcomingEvents: systemOverview.value.activeEvents || 0
          };
        } else if (dashboardStats.status === 'fulfilled') {
          finalStats = {
            totalMembers: dashboardStats.value.totalMembers || 0,
            totalClubs: dashboardStats.value.totalClubs || 0,
            totalEvents: dashboardStats.value.totalEvents || 0,
            upcomingEvents: dashboardStats.value.upcomingEvents || 0
          };
        } else {

        }
        
        setStats(finalStats);
        setRecentActivities(activities.status === 'fulfilled' ? activities.value.combined : []);
        
      } else if (position === 'club_head') {
        const clubHeadStats = await dashboardService.getClubHeadStats(user.uid);
        const activities = await dashboardService.getRecentActivities();
        
        setStats(clubHeadStats);
        setRecentActivities(activities.recentEvents);
        
      } else {

      }
      
    } catch (error) {
      setStats({
        totalMembers: 0,
        totalClubs: 0,
        totalEvents: 0,
        upcomingEvents: 0,
        clubName: 'Error loading data'
      });
    } finally {
      setLoading(false);
    }
  };

  



  const role = user?.role?.rname || user?.role;
  const position = user?.pos;
  const isAdmin = role === 'admin' || role === 1;
  const isClubHead = position === 'club_head';

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>
          {isAdmin ? 'Admin Dashboard' : isClubHead ? `Club Head Dashboard - ${stats.clubName}` : 'Dashboard'}
        </h1>
        <p style={{ color: '#7f8c8d', margin: 0 }}>
          {isAdmin ? 'System overview and management' : isClubHead ? 'Manage your club activities' : 'Welcome'}
        </p>
      </div>
    

      <div className="stats-grid">
        
        
        <div className="stat-card">
          <div className="stat-number">{isAdmin ? stats.totalClubs : isClubHead ? 1 : stats.totalClubs}</div>
          <div className="stat-label">{isClubHead ? 'My Club' : 'Total Clubs'}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats.totalEvents}</div>
          <div className="stat-label">{isClubHead ? 'Club Events' : 'Total Events'}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{stats.upcomingEvents}</div>
          <div className="stat-label">Upcoming Events</div>
        </div>
      </div>

    
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
  
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Activities</h2>
          </div>
          <div>
            {recentActivities.length === 0 ? (
              <p style={{ color: '#7f8c8d', textAlign: 'center', padding: '2rem' }}>
                No recent activities
              </p>
            ) : (
              <div>
                {recentActivities.slice(0, 3).map((activity, index) => (
                  <div
                    key={activity.id || index}
                    style={{
                      padding: '1rem',
                      borderBottom: index < Math.min(recentActivities.length, 5) - 1 ? '1px solid #eee' : 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', color: '#2c3e50' }}>
                        {activity.title}
                      </h4>
                      <p style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>
                        {activity.description || activity.type}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', color: '#7f8c8d', fontSize: '0.8rem' }}>
                      {activity.date ? new Date(activity.date).toLocaleDateString() : 'Recent'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Dashboard;
