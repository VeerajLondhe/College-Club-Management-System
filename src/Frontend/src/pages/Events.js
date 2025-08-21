import React, { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';
import EventModal from '../components/EventModal';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    
    const filtered = events.filter(event =>
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.club?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [events, searchTerm]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      const response = await eventService.getAllEvents();
      
      const eventsData = Array.isArray(response.data) ? response.data : [];
      
      if (eventsData.length === 0) {
        setEvents([]);
        return;
      }
      
      const transformedEvents = eventsData.map((event, index) => {
        const clubInfo = event.club || {};
        const userInfo = clubInfo.user || {};
        
        const transformedEvent = {
          id: event.eid || event.id || index + 1,
          eid: event.eid, 
          
          title: event.title || event.description?.split('.')[0] || `Event #${event.eid || index + 1}`,
          
          description: event.description || 'No description available',
          
          club: clubInfo.cname || clubInfo.name || 'Unknown Club',
          clubId: clubInfo.cid || null,
          
          date: event.date || event.eventDate || (clubInfo.date ? new Date(clubInfo.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
          time: event.time || event.eventTime || '12:00',
          
          location: event.location || event.venue || 'To be announced',
          
          capacity: event.capacity || event.maxAttendees || 100,
          registeredCount: event.registeredCount || event.attendeeCount || 0,
          
          status: event.status === true ? 'Active' : 
                  event.status === false ? 'Pending Approval' : 
                  event.status || 'Inactive',
          
          organizer: userInfo.uname || userInfo.name || event.organizer || 'Unknown Organizer',
          organizerId: userInfo.uid || null,
          
          type: event.type || event.eventType || event.category || 'General',
          
          banner: event.banner || event.bannerBase64 || event.bannerUrl || null,
          
          createdDate: clubInfo.date || null,
          clubStatus: clubInfo.status || false,
          
          _originalEvent: event,
          _originalClub: clubInfo
        };
        
        
        return transformedEvent;
      });
      
      setEvents(transformedEvents);
      
    } catch (error) {
      let errorMessage = 'Failed to load events from backend.';
      let technicalInfo = '';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to Admin Service.';
        technicalInfo = 'Please ensure the Admin Service is running on port 8083 and accessible.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error while fetching events.';
        technicalInfo = 'Check admin service logs for database or server issues.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication required.';
        technicalInfo = 'Please log in again or check if your session has expired.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Events endpoint not found.';
        technicalInfo = 'The /events/all endpoint might not be implemented in the admin service.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access forbidden.';
        technicalInfo = 'You might not have admin privileges to access events data.';
      }
      
      if (process.env.NODE_ENV === 'development') {
        alert(`${errorMessage}\n\nTechnical details: ${technicalInfo}\n\nCheck browser console for more information.`);
      } else {
        alert(errorMessage);
      }
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setShowModal(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleApproveEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to approve this event?')) {
      try {
        setEvents(events.map(event => 
          (event.eid || event.id) === eventId 
            ? { ...event, status: 'Active' } 
            : event
        ));
        
        alert('Event approved successfully!');
        
        fetchEvents();
        
      } catch (error) {
        
        let errorMessage = 'Failed to approve event.';
        let technicalInfo = '';
        
        if (error.response) {
          const status = error.response.status;
          const statusText = error.response.statusText;
          
          if (status === 500) {
            errorMessage = 'Cannot approve event - Server Error';
            technicalInfo = 'There was an internal server error while approving the event.';
          } else if (status === 404) {
            errorMessage = 'Event not found';
            technicalInfo = 'The event may have been deleted or the ID is incorrect.';
          } else if (status === 403) {
            errorMessage = 'Permission denied';
            technicalInfo = 'You may not have permission to approve this event.';
          } else {
            errorMessage = `Approval failed (${status})`;
            technicalInfo = `Server returned: ${statusText}`;
          }
          if (error.response.data) {
            if (typeof error.response.data === 'string') {
              technicalInfo += ` - ${error.response.data}`;
            } else if (error.response.data.message) {
              technicalInfo += ` - ${error.response.data.message}`;
            }
          }
        } else if (error.request) {
          errorMessage = 'Cannot connect to server';
          technicalInfo = 'Please check if the admin service is running on port 8083.';
        } else {
          errorMessage = 'Unexpected error occurred';
          technicalInfo = error.message;
        }
        
        const fullErrorMessage = `${errorMessage}\n\n Technical Details:\n${technicalInfo}`;
        
        alert(fullErrorMessage);
        
      }
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        
        const response = await eventService.deleteEvent(eventId);
        
        setEvents(events.filter(event => (event.eid || event.id) !== eventId));
        
        alert('Event deleted successfully!');
        
        fetchEvents();
        
      } catch (error) {
        
        let errorMessage = 'Failed to delete event.';
        let technicalInfo = '';
        
        if (error.response) {
          const status = error.response.status;
          const statusText = error.response.statusText;
          
          if (status === 500) {
            errorMessage = 'Cannot delete event - Server Error';
            technicalInfo = 'Thisevent may be linked to registrations, attendees, or other data. The backend needs to handle cascading deletes or provide a soft delete option.';
          } else if (status === 404) {
            errorMessage = 'Event not found';
            technicalInfo = 'The event may have already been deleted or the ID is incorrect.';
          } else if (status === 403) {
            errorMessage = 'Permission denied';
            technicalInfo = 'You may not have permission to delete this event.';
          } else if (status === 405) {
            errorMessage = 'Delete method not allowed';
            technicalInfo = 'The backend delete endpoint is not properly configured.';
          } else {
            errorMessage = `Delete failed (${status})`;
            technicalInfo = `Server returned: ${statusText}`;
          }
          if (error.response.data) {
            if (typeof error.response.data === 'string') {
              technicalInfo += ` - ${error.response.data}`;
            } else if (error.response.data.message) {
              technicalInfo += ` - ${error.response.data.message}`;
            }
          }
        } else if (error.request) {
          errorMessage = '🌐 Cannot connect to server';
          technicalInfo = 'Please check if the admin service is running on port 8083.';
        } else {
          errorMessage = 'Unexpected error occurred';
          technicalInfo = error.message;
        }
        
        const fullErrorMessage = `${errorMessage}\n\n Technical Details:\n${technicalInfo}\n\n💡 Note: The backend delete endpoint may need fixes for proper event deletion.`;
        
        alert(fullErrorMessage);
        
      }
    }
  };

  const handleSaveEvent = async (eventData) => {
    try {
      if (selectedEvent) {
        await eventService.updateEvent(selectedEvent.id, eventData);
        setEvents(events.map(event => 
          event.id === selectedEvent.id ? { ...event, ...eventData } : event
        ));
      } else {
        const response = await eventService.createEvent(eventData);
        setEvents([...events, response.data]);
      }
      setShowModal(false);
      setSelectedEvent(null);
    } catch (error) {
      
      let errorMessage = 'Failed to save event.';
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error while saving event.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication required.';
      }
      
      alert(errorMessage);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending Approval':
        return { backgroundColor: '#fff3cd', color: '#856404' };
      case 'Active':
        return { backgroundColor: '#d4edda', color: '#155724' };
      case 'Approved':
        return { backgroundColor: '#d4edda', color: '#155724' };
      case 'Rejected':
        return { backgroundColor: '#f8d7da', color: '#721c24' };
      case 'Upcoming':
        return { backgroundColor: '#d4edda', color: '#155724' };
      case 'Ongoing':
        return { backgroundColor: '#bee5eb', color: '#0c5460' };
      case 'Completed':
        return { backgroundColor: '#e2e3e5', color: '#6c757d' };
      case 'Cancelled':
        return { backgroundColor: '#f5c6cb', color: '#721c24' };
      default:
        return { backgroundColor: '#e3f2fd', color: '#1976d2' };
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Events Management</h2>
          
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ 
            fontSize: '0.9rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <thead style={{ 
              backgroundColor: '#f8f9fa',
              borderBottom: '2px solid #dee2e6'
            }}>
              <tr>
                <th style={{ 
                  minWidth: '250px', 
                  fontWeight: '600', 
                  color: '#495057',
                  padding: '1rem 0.75rem',
                  fontSize: '0.95rem'
                }}>Event Details</th>
                <th style={{ 
                  minWidth: '150px', 
                  fontWeight: '600', 
                  color: '#495057',
                  padding: '1rem 0.75rem',
                  fontSize: '0.95rem'
                }}>Club</th>
                <th style={{ 
                  minWidth: '180px', 
                  fontWeight: '600', 
                  color: '#495057',
                  padding: '1rem 0.75rem',
                  fontSize: '0.95rem',
                  textAlign: 'center'
                }}>Event Banner</th>
                <th style={{ 
                  minWidth: '120px', 
                  fontWeight: '600', 
                  color: '#495057',
                  padding: '1rem 0.75rem',
                  fontSize: '0.95rem',
                  textAlign: 'center'
                }}>Status</th>
                <th style={{ 
                  minWidth: '140px', 
                  fontWeight: '600', 
                  color: '#495057',
                  padding: '1rem 0.75rem',
                  fontSize: '0.95rem',
                  textAlign: 'center'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ 
                    textAlign: 'center', 
                    padding: '3rem',
                    color: '#6c757d',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎪</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {searchTerm ? 'No events found matching your search.' : 'No events available yet.'}
                    </div>
                    <div style={{ fontSize: '0.9rem' }}>
                      {searchTerm ? 'Try adjusting your search terms.' : 'Click "Add New Event" to create your first event.'}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.id} style={{ 
                    borderBottom: '1px solid #e9ecef',
                    transition: 'background-color 0.2s ease',
                    ':hover': { backgroundColor: '#f8f9fa' }
                  }}>
                    <td style={{ padding: '1.2rem 0.75rem', verticalAlign: 'middle' }}>
                      <div>
                        <div style={{ 
                          fontSize: '1rem', 
                          fontWeight: '600', 
                          color: '#2c3e50',
                          marginBottom: '0.5rem',
                          lineHeight: '1.3'
                        }}>
                          📅 {event.title}
                        </div>
                        <div style={{ 
                          fontSize: '0.85rem', 
                          color: '#6c757d',
                          lineHeight: '1.4',
                          marginBottom: '0.5rem',
                          maxWidth: '300px'
                        }}>
                          {event.description?.substring(0, 80)}{event.description?.length > 80 ? '...' : ''}
                        </div>
                        <div style={{
                          display: 'flex',
                          gap: '1rem',
                          fontSize: '0.8rem',
                          color: '#495057'
                        }}>
                          
                          
                          
                        </div>
                        
                      </div>
                    </td>
                    <td style={{ padding: '1.2rem 0.75rem', verticalAlign: 'middle' }}>
                      <div style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#2c3e50',
                        marginBottom: '0.25rem'
                      }}>
                        🏛️ {event.club}
                      </div>
                    </td>
                    <td style={{ 
                      padding: '1.2rem 0.75rem', 
                      textAlign: 'center',
                      verticalAlign: 'middle'
                    }}>
                      {event.banner ? (
                        <div>
                          <img 
                            src={event.banner} 
                            alt={`${event.title} banner`}
                            style={{
                              maxWidth: '120px',
                              maxHeight: '80px',
                              borderRadius: '8px',
                              border: '1px solid #dee2e6',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentNode.innerHTML = '<div style="padding: 1rem; background: #f8f9fa; border-radius: 8px; color: #6c757d; font-size: 0.8rem;">🖼️<br/>No Image</div>';
                            }}
                          />
                        </div>
                      ) : (
                        <div style={{
                          padding: '1rem',
                          background: '#f8f9fa',
                          borderRadius: '8px',
                          color: '#6c757d',
                          fontSize: '0.8rem',
                          minHeight: '80px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column'
                        }}>
                          🖼️<br/>No Banner
                        </div>
                      )}
                    </td>
                    <td style={{ 
                      textAlign: 'center', 
                      padding: '1.2rem 0.75rem',
                      verticalAlign: 'middle'
                    }}>
                      <span
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'inline-block',
                          minWidth: '80px',
                          ...getStatusColor(event.status)
                        }}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td style={{ 
                      textAlign: 'center', 
                      padding: '1.2rem 0.75rem',
                      verticalAlign: 'middle'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        gap: '0.5rem', 
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                      }}>
                        {event.status === 'Pending Approval' ? (
                          <>
                            <button
                              className="btn btn-success"
                              style={{ 
                                fontSize: '0.8rem', 
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                fontWeight: '500',
                                minWidth: '90px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                backgroundColor: '#28a745',
                                borderColor: '#28a745',
                                color: 'white'
                              }}
                              onClick={() => handleApproveEvent(event.eid || event.id)}
                              title="Approve this event"
                            >
                              ✅ Approve
                            </button>
                            {/* Always show Delete button */}
                            <button
                              className="btn btn-danger"
                              style={{ 
                                fontSize: '0.8rem', 
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                fontWeight: '500',
                                minWidth: '80px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem'
                              }}
                              onClick={() => handleDeleteEvent(event.eid || event.id)}
                              title="Delete event"
                            >
                              🗑️ Delete
                            </button>
                          </>
                        ) : (
                          <>
                            {/* For approved/active events, only show Delete button */}
                            <button
                              className="btn btn-danger"
                              style={{ 
                                fontSize: '0.8rem', 
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                fontWeight: '500',
                                minWidth: '80px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem'
                              }}
                              onClick={() => handleDeleteEvent(event.eid || event.id)}
                              title="Delete event"
                            >
                              🗑️ Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '1rem', color: '#7f8c8d', fontSize: '0.9rem' }}>
          Showing {filteredEvents.length} of {events.length} events
        </div>
      </div>

      {showModal && (
        <EventModal
          event={selectedEvent}
          onSave={handleSaveEvent}
          onClose={() => {
            setShowModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default Events;
