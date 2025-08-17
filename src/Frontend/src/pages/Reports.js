import React, { useState, useEffect } from 'react';
import { reportsService } from '../services/reportsService';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { id: 'overview', name: 'System Overview', icon: '📊' },
    { id: 'clubs', name: 'Club Performance', icon: '🏛️' },
    { id: 'events', name: 'Event Statistics', icon: '📅' },
  ];

  useEffect(() => {
    fetchReportData();
  }, [selectedReport]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      let data = {};
      switch (selectedReport) {
        case 'overview':
          data = await reportsService.getSystemOverview();
          break;
        case 'members':
          data = await reportsService.getMemberAnalytics();
          break;
        case 'clubs':
          data = await reportsService.getClubPerformance();
          break;
        case 'events':
          data = await reportsService.getEventStatistics();
          break;
        case 'attendance':
          data = await reportsService.getAttendanceAnalytics();
          break;
        default:
          data = await reportsService.getSystemOverview();
      }
      setReportData(data);
    } catch (error) {
      setReportData({});
    } finally {
      setLoading(false);
    }
  };

  

 

  const renderOverviewReport = () => (
    <div>
      <h3 style={{ marginBottom: '2rem', color: '#2c3e50' }}>System Overview Report</h3>
      
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        
        <div className="stat-card">
          <div className="stat-number">{reportData.activeClubs || 0}</div>
          <div className="stat-label">Active Clubs</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{reportData.totalEvents || 0}</div>
          <div className="stat-label">Events Till Now</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{reportData.totalClubs || 0}</div>
          <div className="stat-label">Total Clubs</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h4 className="card-title" style={{ fontSize: '1.1rem' }}>Monthly Growth</h4>
          </div>
          <div style={{ padding: '1rem', textAlign: 'center', color: '#7f8c8d' }}>
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              📈 Chart visualization would go here
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4 className="card-title" style={{ fontSize: '1.1rem' }}>Club Distribution by Category</h4>
          </div>
          <div style={{ padding: '1rem' }}>
            {reportData.clubsByCategory && Object.keys(reportData.clubsByCategory).length > 0 ? (
              Object.entries(reportData.clubsByCategory).map(([category, count], index) => {
                const total = Object.values(reportData.clubsByCategory).reduce((a, b) => a + b, 0);
                const percentage = Math.round((count / total) * 100);
                const colors = ['#3498db', '#27ae60', '#f39c12', '#e74c3c', '#9b59b6'];
                return (
                  <div key={category} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>{category}</span>
                      <span>{count} clubs ({percentage}%)</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: colors[index % colors.length], borderRadius: '4px' }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '2rem' }}>
                No club data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMembersReport = () => (
    <div>
      <h3 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Member Analytics Report</h3>
      
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-number">{reportData.newMembersThisMonth || 0}</div>
          <div className="stat-label">New Members This Month</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{reportData.activeMembersCount || 0}</div>
          <div className="stat-label">Active Members</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{reportData.inactiveMembersCount || 0}</div>
          <div className="stat-label">Inactive Members</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{reportData.averageClubsPerMember || 0}</div>
          <div className="stat-label">Avg Clubs per Member</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h4 className="card-title" style={{ fontSize: '1.1rem' }}>Member Distribution by Department</h4>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Total Members</th>
                <th>Active Members</th>
                <th>Participation Rate</th>
              </tr>
            </thead>
            <tbody>
              {reportData.departmentStats && Object.keys(reportData.departmentStats).length > 0 ? (
                Object.entries(reportData.departmentStats).map(([department, stats]) => {
                  const participationRate = stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0;
                  return (
                    <tr key={department}>
                      <td>{department}</td>
                      <td>{stats.total}</td>
                      <td>{stats.active}</td>
                      <td>{participationRate}%</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: '#7f8c8d' }}>No department data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderClubsReport = () => (
    <div>
      <h3 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Club Performance Report</h3>
      
      <div className="card">
        <div className="card-header">
          <h4 className="card-title" style={{ fontSize: '1.1rem' }}>Top Performing Clubs</h4>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Club Name</th>
                <th>Members</th>
                <th>Events This Year</th>
                <th>Avg. Attendance</th>
                <th>Growth Rate</th>
              </tr>
            </thead>
            <tbody>
              {reportData.clubs && reportData.clubs.length > 0 ? (
                reportData.clubs.slice(0, 10).map((club) => (
                  <tr key={club.id}>
                    <td>{club.name}</td>
                    <td>{club.members}</td>
                    <td>{club.eventsThisYear}</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: '#7f8c8d' }}>No club data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderEventsReport = () => (
    <div>
      <h3 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Event Statistics Report</h3>
      
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-number">{reportData.totalEvents || 0}</div>
          <div className="stat-label">Total Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{reportData.completedEvents || 0}</div>
          <div className="stat-label">Completed Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{reportData.upcomingEvents || 0}</div>
          <div className="stat-label">Upcoming Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{reportData.successRate || '0%'}</div>
          <div className="stat-label">Success Rate</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h4 className="card-title" style={{ fontSize: '1.1rem' }}>Events by Type</h4>
        </div>
        <div style={{ padding: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {reportData.eventTypes && Object.keys(reportData.eventTypes).length > 0 ? (
              Object.entries(reportData.eventTypes).map(([type, count]) => {
                const icons = {
                  'Workshops': '📚',
                  'Performances': '🎭',
                  'Competitions': '🏆',
                  'Social Events': '🤝',
                  'General': '📅'
                };
                return (
                  <div key={type} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icons[type] || '📅'}</div>
                    <div style={{ fontWeight: 'bold' }}>{type}</div>
                    <div style={{ color: '#7f8c8d' }}>{count} events</div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '2rem', gridColumn: '1 / -1' }}>
                No event type data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAttendanceReport = () => (
    <div>
      <h3 style={{ marginBottom: '2rem', color: '#2c3e50' }}>Attendance Analysis Report</h3>
      
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-number">{reportData.overallAttendance || '0%'}</div>
          <div className="stat-label">Overall Attendance</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{reportData.bestMonth || '0%'}</div>
          <div className="stat-label">Best Month</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{reportData.lowestMonth || '0%'}</div>
          <div className="stat-label">Lowest Month</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{reportData.averagePerEvent || 0}</div>
          <div className="stat-label">Avg. per Event</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h4 className="card-title" style={{ fontSize: '1.1rem' }}>Monthly Attendance Trends</h4>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#7f8c8d' }}>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            📊 Monthly attendance chart would be displayed here
          </div>
        </div>
      </div>
    </div>
  );

  const renderReport = () => {
    switch (selectedReport) {
      case 'members':
        return renderMembersReport();
      case 'clubs':
        return renderClubsReport();
      case 'events':
        return renderEventsReport();
      case 'attendance':
        return renderAttendanceReport();
      default:
        return renderOverviewReport();
    }
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Reports & Analytics</h2>
        </div>

        <div style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {reportTypes.map((report) => (
              <button
                key={report.id}
                className={`btn ${selectedReport === report.id ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedReport(report.id)}
                style={{ 
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{report.icon}</span>
                {report.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
              <div>Loading report data...</div>
            </div>
          ) : (
            renderReport()
          )}
        </div>
      </div>

      
      
    </div>
  );
};

export default Reports;
