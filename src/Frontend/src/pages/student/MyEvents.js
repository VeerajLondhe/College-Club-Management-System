import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import { clubService } from '../../services/clubService';
import { useAuth } from '../../contexts/AuthContext';

const MyEvents = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userClub, setUserClub] = useState(null);
  const [clubMemberEvents, setClubMemberEvents] = useState([]);

  useEffect(() => {
    if (user) {
      fetchMyEvents();
    }
  }, [user]);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      console.log('Fetching events for user:', user?.email, 'Role:', user?.pos);
      
      if (user?.pos === 'club_head') {
        await fetchClubHeadEvents();
      } else if(user?.pos === 'club_member') {
        await fetchClubMemberEvents();
      } else{
        await fetchStudentEvents();
      }
    } catch (error) {
      console.error('Error fetching my events:', error);
      setMyEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClubHeadEvents = async () => {
    try {
      console.log('Fetching submitted events for club head user:', user.uid);
      
      try {
        const clubResponse = await clubService.getClubByHead(user.uid);
        const club = clubResponse.data;
        console.log('Found club for head:', club);
        setUserClub(club);
      } catch (clubError) {
        console.warn('Could not fetch club info:', clubError);
      }
      
      let eventsResponse;
      let events;
      try {
        eventsResponse = await eventService.getMyClubAllEvents(user.uid);
        events = eventsResponse.data;
      } catch (newEndpointError) {
        eventsResponse = await eventService.getClubHeadSubmittedEvents(user.uid);
        events = eventsResponse.data;
      }
      
      const transformedEvents = events.map(event => {
        const eventId = event.eventId || event.eid;
        const description = event.description || event.edescription || 'No description available';
        const clubName = event.clubName || event.club?.cname || userClub?.cname || 'Your Club';
        
        let displayStatus = 'Organized';
        if (event.status !== undefined) {
          displayStatus = event.status ? 'Approved' : 'Pending Approval';
        } else if (event.approvalStatus) {
          switch (event.approvalStatus) {
            case 'pending':
              displayStatus = 'Pending Approval';
              break;
            case 'approved':
              displayStatus = 'Approved';
              break;
            case 'rejected':
              displayStatus = 'Rejected';
              break;
            default:
              displayStatus = event.status ? 'Active' : 'Draft';
          }
        }
        
        return {
          id: eventId,
          title: description,
          club: clubName,
          status: displayStatus,
          description: description,
          banner: event.bannerBase64 || event.banner || null,
          rejectionReason: event.rejectionReason || null,
          submittedDate: event.createdAt ? new Date(event.createdAt).toLocaleDateString() : null
        };
      });
      
      setMyEvents(transformedEvents);
      
    } catch (error) {
      console.error('Error fetching club head events:', error);
      
      let errorMessage = 'Failed to load your submitted events.';
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to admin service.';
      } else if (error.response?.status === 404) {
        errorMessage = 'No events found for this club head.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error while fetching events.';
      }
      if (error.response?.status === 404) {
        setMyEvents([]);
      } else {
        alert(errorMessage);
        setMyEvents([]);
      }
    }
  };

  const fetchStudentEvents = async () => {
    try {
      
      const response = await eventService.getUserRegisteredEvents(user.uid);
      const events = response.data;
      
      const transformedEvents = events.map(event => ({
        id: event.eid,
        title: event.ename,
        club: event.club?.cname || 'Unknown Club',
        date: event.edate ? new Date(event.edate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        time: event.etime || 'TBD',
        location: event.elocation || 'TBD',
        status: 'Registered',
        type: event.etype || 'Event',
        description: event.edescription || 'No description available'
      }));
      
      setMyEvents(transformedEvents);
    
      
    } catch (error) {
      console.error('Error fetching student events:', error);
      
      let errorMessage = 'Failed to load your registered events.';
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to admin service.';
      } else if (error.response?.status === 404) {
        errorMessage = 'No registered events found.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error while fetching events.';
      }
      
      if (error.response?.status === 404) {
        setMyEvents([]);
      } else {
        console.error('API Error details:', error.response?.data);
        setMyEvents([]);
      }
    }
  };
  const fetchClubMemberEvents = async () => {
    try {
      console.log('Fetching registered events for student:', user.uid);
      
      const response = await eventService.getUserRegisteredEvents(user.uid);
      const events = response.data;
      console.log('Found registered events:', events);
      
      const transformedEvents = events.map(event => ({
        id: event.eid,
        title: event.ename,
        club: event.club?.cname || 'Unknown Club',
        date: event.edate ? new Date(event.edate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        time: event.etime || 'TBD',
        location: event.elocation || 'TBD',
        status: 'Registered',
        type: event.etype || 'Event',
        description: event.edescription || 'No description available'
      }));
      
      setMyEvents(transformedEvents);
      console.log('Successfully loaded', transformedEvents.length, 'registered events for student');
      
    } catch (error) {
      console.error('Error fetching student events:', error);
      
      let errorMessage = 'Failed to load your registered events.';
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to admin service.';
      } else if (error.response?.status === 404) {
        errorMessage = 'No registered events found.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error while fetching events.';
      }
      
      if (error.response?.status === 404) {
        setMyEvents([]);
      } else {
        console.error('API Error details:', error.response?.data);
        setMyEvents([]);
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        alert('Delete functionality not implemented yet.');
        
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event.');
      }
    }
  };

  

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading your events...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>My Events</h1>
        <p style={{ color: '#7f8c8d' }}>
          {user?.pos === 'club_head' 
            ? 'Events organized by your club' 
            : 'Events you\'ve registered for and attended'
          }
          
        </p>
      </div>

      {myEvents.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ color: '#7f8c8d', marginBottom: '1rem' }}>
            {user?.pos === 'club_head' ? 'No Events Organized' : 'No Events Registered'}
          </h3>
          <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>
            {user?.pos === 'club_head' 
              ? 'Your club hasn\'t organized any events yet. Create your first event to get started!'
              : 'You haven\'t registered for any events yet. Browse available events to get started!'
            }
          </p>
          {user?.pos === 'club_head' ? (
            <a href="/create-event" className="btn btn-primary">
              Create Event
            </a>
          ) : (
            <a href="/browse-events" className="btn btn-primary">
              Browse Available Events
            </a>
          )}
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
          gap: '2rem' 
        }}>
          {myEvents.map((event) => (
            <div key={event.id} className="card">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <h3 style={{ color: '#2c3e50', margin: 0, flex: 1 }}>
                  {event.title}
                </h3>
                
              </div>

              
              {event.banner && (
                <div style={{ marginBottom: '1rem' }}>
                  <img 
                    src={event.banner} 
                    alt="Event Banner" 
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #dee2e6'
                    }}
                  />
                </div>
              )}

              <p style={{ color: '#7f8c8d', marginBottom: '1rem', lineHeight: '1.4' }}>
                {event.description}
              </p>

              <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: '#2c3e50' }}>Club: </strong>
                  <span style={{ color: '#7f8c8d' }}>{event.club}</span>
                </div>
              </div>

          
              {user?.pos === 'club_head' ? (
                <div style={{ 
                  display: 'flex', 
                  gap: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #eee'
                }}>
                  
                </div>
              ) : (
                <div style={{ 
                  display: 'flex', 
                  gap: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #eee'
                }}>
                  {event.status === 'Registered' && (
                    <button className="btn btn-danger" style={{ fontSize: '0.9rem' }}>
                      Cancel Registration
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* {myEvents.length > 0 && (
        <div style={{ 
          marginTop: '2rem',
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
            {user?.pos === 'club_head' 
              ? 'Want to organize another event?'
              : 'Looking for more events?'
            }
          </h3>
          {user?.pos === 'club_head' ? (
            <a href="/create-event" className="btn btn-primary">
              Create New Event
            </a>
          ) : (
            <a href="/browse-events" className="btn btn-primary">
              Browse Available Events
            </a>
          )}
        </div>
      )} */}
    </div>
  );
};

export default MyEvents;
