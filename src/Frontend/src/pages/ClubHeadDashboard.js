import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { studentService } from '../services/studentService';
import { eventService } from '../services/eventService';

const ClubHeadDashboard = () => {
  const { user } = useAuth();
  const [myClub, setMyClub] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [clubMembers, setClubMembers] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.uid) {
      fetchClubHeadData();
    }
  }, [user]);

  const fetchClubHeadData = async () => {
    try {
      setLoading(true);
      
      const clubResponse = await studentService.getMyClub(user.uid);
      setMyClub(clubResponse.data);

      try {
        const dashboardResponse = await studentService.getClubDashboard(user.uid);
        setDashboardStats(dashboardResponse.data);
      } catch (dashboardError) {
        console.log('Dashboard endpoint not available, using fallback');
        setDashboardStats(null);
      }

      const requestsResponse = await studentService.getPendingJoinRequests(user.uid);
      setPendingRequests(requestsResponse.data);

      const membersResponse = await studentService.getClubMembers(user.uid);
      setClubMembers(membersResponse.data);

      try {
        const eventsResponse = await eventService.getMyClubAllEvents(user.uid);
        setMyEvents(eventsResponse.data || []);
      } catch (eventsError) {
        try {
          const approvedEventsResponse = await eventService.getMyClubEvents(user.uid);
          setMyEvents(approvedEventsResponse.data || []);
        } catch (fallbackError) {
          setMyEvents([]);
        }
      }

    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    if (window.confirm('Approve this member request?')) {
      try {
        await studentService.approveJoinRequest({
          clubMemberId: requestId,
          headUserId: user.uid
        });
        
        fetchClubHeadData();
        alert('Member request approved successfully!');
      } catch (error) {
        alert('Failed to approve request.');
      }
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Remove this member from the club?')) {
      try {
        await studentService.removeMember({
          headUserId: user.uid,
          memberToRemoveUserId: memberId
        });
        
        fetchClubHeadData();
        alert('Member removed successfully!');
      } catch (error) {
        console.error('Error removing member:', error);
        alert('Failed to remove member.');
      }
    }
  };

  const handleRequestEvent = async () => {
    try {
      const eventData = {
        description: prompt('Enter event description:'),
        headUserId: user.uid
      };
      
      if (eventData.description) {
        await eventService.requestEvent(eventData);
        alert('Event request submitted successfully!');
        fetchClubHeadData();
      }
    } catch (error) {
      alert('Failed to request event.');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading club head dashboard...</p>
      </div>
    );
  }

  if (!myClub) {
    return (
      <div className="card">
        <div className="card-header">
          <h2>Club Head Dashboard</h2>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>No Active Club Found</h3>
          <p>You don't currently have an active club. Contact an administrator to create a club.</p>
        </div>
      </div>
    );
  }
  const stats = dashboardStats || {
    totalMembers: clubMembers.length,
    pendingRequests: pendingRequests.length,
    totalEvents: myEvents.length,
    approvedEvents: myEvents.filter(e => e.status === true).length,
    pendingEvents: myEvents.filter(e => e.status === false).length,
    clubStatus: myClub.status
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Club Head Dashboard - {myClub.clubname}</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`btn ${activeTab === 'requests' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('requests')}
            >
              Join Requests ({stats.pendingRequests || pendingRequests.length})
            </button>
            <button 
              className={`btn ${activeTab === 'members' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('members')}
            >
              Members ({stats.totalMembers || clubMembers.length})
            </button>
            <button 
              className={`btn ${activeTab === 'myclub' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('myclub')}
            >
              My Club
            </button>
            <button 
              className={`btn ${activeTab === 'events' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('events')}
            >
              Events ({stats.totalEvents || myEvents.length})
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div style={{ padding: '1.5rem' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#e3f2fd',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#1976d2' }}>
                  {stats.pendingRequests || pendingRequests.length}
                </h3>
                <p style={{ margin: '0', color: '#424242' }}>Pending Requests</p>
              </div>
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#e8f5e8',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#388e3c' }}>
                  {stats.totalMembers || clubMembers.length}
                </h3>
                <p style={{ margin: '0', color: '#424242' }}>Total Members</p>
              </div>
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#fff3e0',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#f57c00' }}>
                  {stats.totalEvents || myEvents.length}
                </h3>
                <p style={{ margin: '0', color: '#424242' }}>Total Events</p>
              </div>
              <div style={{
                padding: '1.5rem',
                backgroundColor: '#d1ecf1',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#0c5460' }}>
                  {stats.approvedEvents || myEvents.filter(e => e.status === true).length}
                </h3>
                <p style={{ margin: '0', color: '#424242' }}>Active Events</p>
              </div>
            </div>

            <button 
              className="btn btn-primary"
              onClick={handleRequestEvent}
              style={{ marginRight: '1rem' }}
            >
              Request New Event
            </button>
          </div>
        )}

        {activeTab === 'requests' && (
          <div style={{ padding: '1.5rem' }}>
            <h3>Pending Join Requests</h3>
            {pendingRequests.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>
                No pending requests
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Username</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map((request) => (
                      <tr key={request.clubMemberId}>
                        <td>{request.requestingUserId}</td>
                        <td>{request.requestingUsername}</td>
                        <td>
                          <button
                            className="btn btn-success"
                            onClick={() => handleApproveRequest(request.clubMemberId)}
                            style={{ marginRight: '0.5rem' }}
                          >
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div style={{ padding: '1.5rem' }}>
            <h3>Club Members</h3>
            {clubMembers.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>
                No members found
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Username</th>
                      <th>Position</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clubMembers.map((member) => (
                      <tr key={member.userId}>
                        <td>{member.userId}</td>
                        <td>{member.username}</td>
                        <td>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: member.position === 'club_head' ? '#fff3cd' : '#e2e3e5',
                            color: member.position === 'club_head' ? '#856404' : '#6c757d',
                            borderRadius: '4px',
                            fontSize: '0.8rem'
                          }}>
                            {member.position}
                          </span>
                        </td>
                        <td>
                          {member.position !== 'club_head' && (
                            <button
                              className="btn btn-danger"
                              onClick={() => handleRemoveMember(member.userId)}
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'myclub' && (
          <div style={{ padding: '1.5rem' }}>
            <div style={{
              padding: '2rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <h3 style={{ marginTop: '0', color: '#2c3e50' }}>Club Information</h3>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#2c3e50' }}>Club Name:</strong>
                <p style={{ margin: '0.5rem 0', fontSize: '1.1rem', color: '#495057' }}>{myClub.clubname}</p>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#2c3e50' }}>Description:</strong>
                <p style={{ margin: '0.5rem 0', lineHeight: '1.6', color: '#495057' }}>{myClub.description}</p>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#2c3e50' }}>Creation Date:</strong>
                <p style={{ margin: '0.5rem 0', color: '#495057' }}>
                  {new Date(myClub.creationdate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div style={{ padding: '1.5rem' }}>
            <h3>Club Events</h3>
            <button 
              className="btn btn-primary"
              onClick={handleRequestEvent}
              style={{ marginBottom: '1rem' }}
            >
              Request New Event
            </button>
            
            {myEvents.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>
                No events found. Request your first event!
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Event ID</th>
                      <th>Description</th>
                      <th>Club Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myEvents.map((event) => (
                      <tr key={event.eventId}>
                        <td>{event.eventId}</td>
                        <td>{event.description}</td>
                        <td>{event.clubName}</td>
                        <td>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            backgroundColor: event.status ? '#d4edda' : '#fff3cd',
                            color: event.status ? '#155724' : '#856404',
                            borderRadius: '4px',
                            fontSize: '0.8rem'
                          }}>
                            {event.status ? 'Approved' : 'Pending Approval'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubHeadDashboard;
