import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import { useAuth } from '../../contexts/AuthContext';

const EventApprovals = () => {
  const { user } = useAuth();
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchPendingEvents();
    }
  }, [user]);

  useEffect(() => {
    const filtered = pendingEvents.filter(event =>
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.club?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [pendingEvents, searchTerm]);

  const fetchPendingEvents = async () => {
    try {
      setLoading(true);
      
      const response = await eventService.getPendingEvents();
      const transformedEvents = response.data.map(event => ({
        id: event.eid,
        title: event.ename || 'Untitled Event',
        description: event.edescription || 'No description available',
        club: event.club?.cname || 'Unknown Club',
        organizer: event.organizer?.uname || event.club?.user?.uname || 'Unknown Organizer',
        date: event.edate ? new Date(event.edate).toISOString().split('T')[0] : 'TBD',
        time: event.etime || 'TBD',
        location: event.elocation || 'TBD',
        capacity: event.ecapacity || 0,
        type: event.etype || 'General',
        requirements: event.requirements || 'None',
        contactInfo: event.contactInfo || 'N/A',
        submittedDate: event.createdAt ? new Date(event.createdAt).toLocaleDateString() : 'Unknown',
        status: 'Pending Approval'
      }));
      
      setPendingEvents(transformedEvents);
      console.log('Successfully loaded', transformedEvents.length, 'pending events');
      
    } catch (error) {
      console.error('Error fetching pending events:', error);
      
      let errorMessage = 'Failed to load pending events.';
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to admin service.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Access denied. Admin privileges required.';
      } else if (error.response?.status === 404) {
        errorMessage = 'No pending events found.';
      }
      
      alert(errorMessage);
      setPendingEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to approve this event?')) {
      try {
        console.log('Approving event:', eventId);
        await eventService.approveEvent(eventId);
        
        setPendingEvents(events => events.filter(event => event.id !== eventId));
        alert('Event approved successfully! It will now be visible to students.');
        
      } catch (error) {
        console.error('Error approving event:', error);
        
        let errorMessage = 'Failed to approve event.';
        if (error.response?.status === 404) {
          errorMessage = 'Event not found.';
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error while approving event.';
        }
        
        alert(errorMessage);
      }
    }
  };

  const handleRejectEvent = (event) => {
    setSelectedEvent(event);
    setShowRejectModal(true);
    setRejectReason('');
  };

  const confirmRejectEvent = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    try {
      console.log('Rejecting event:', selectedEvent.id, 'with reason:', rejectReason);
      await eventService.rejectEvent(selectedEvent.id, rejectReason);
      
      // Remove from pending list
      setPendingEvents(events => events.filter(event => event.id !== selectedEvent.id));
      
      setShowRejectModal(false);
      setSelectedEvent(null);
      setRejectReason('');
      
      alert('Event rejected successfully. The club head will be notified.');
      
    } catch (error) {
      console.error('Error rejecting event:', error);
      
      let errorMessage = 'Failed to reject event.';
      if (error.response?.status === 404) {
        errorMessage = 'Event not found.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error while rejecting event.';
      }
      
      alert(errorMessage);
    }
  };

  const getStatusColor = (status) => {
    return { backgroundColor: '#fff3cd', color: '#856404' }; // Yellow for pending
  };

  if (user?.role !== 'admin') {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3 style={{ color: '#e74c3c', marginBottom: '1rem' }}>Access Restricted</h3>
        <p style={{ color: '#7f8c8d' }}>
          This page is only accessible to administrators.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading pending events...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Event Approvals</h1>
        <p style={{ color: '#7f8c8d' }}>
          Review and approve events submitted by club heads
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Pending Events ({filteredEvents.length})</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search events..."
              className="form-input"
              style={{ width: '250px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="btn btn-secondary" 
              onClick={fetchPendingEvents}
              disabled={loading}
            >
              Refresh
            </button>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h3 style={{ color: '#7f8c8d', marginBottom: '1rem' }}>
              {searchTerm ? 'No matching events found' : 'No pending events'}
            </h3>
            <p style={{ color: '#7f8c8d' }}>
              {searchTerm 
                ? 'Try adjusting your search terms.' 
                : 'All events have been reviewed or no events have been submitted yet.'
              }
            </p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', 
            gap: '2rem',
            padding: '1rem'
          }}>
            {filteredEvents.map((event) => (
              <div key={event.id} className="card" style={{ border: '1px solid #e9ecef' }}>
                <div className="card-header" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start' 
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: '#2c3e50', margin: 0, marginBottom: '0.5rem' }}>
                      {event.title}
                    </h3>
                    <p style={{ color: '#7f8c8d', margin: 0, fontSize: '0.9rem' }}>
                      {event.club} • {event.organizer}
                    </p>
                  </div>
                  <span
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      ...getStatusColor(event.status)
                    }}
                  >
                    {event.status}
                  </span>
                </div>

                <div className="card-body">
                  <p style={{ color: '#7f8c8d', marginBottom: '1.5rem', lineHeight: '1.4' }}>
                    {event.description}
                  </p>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem'
                  }}>
                    <div>
                      <strong style={{ color: '#2c3e50' }}>Date:</strong>
                      <div style={{ color: '#7f8c8d' }}>
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <strong style={{ color: '#2c3e50' }}>Time:</strong>
                      <div style={{ color: '#7f8c8d' }}>{event.time}</div>
                    </div>
                    <div>
                      <strong style={{ color: '#2c3e50' }}>Location:</strong>
                      <div style={{ color: '#7f8c8d' }}>{event.location}</div>
                    </div>
                    <div>
                      <strong style={{ color: '#2c3e50' }}>Capacity:</strong>
                      <div style={{ color: '#7f8c8d' }}>{event.capacity} attendees</div>
                    </div>
                    <div>
                      <strong style={{ color: '#2c3e50' }}>Type:</strong>
                      <div style={{ color: '#7f8c8d' }}>{event.type}</div>
                    </div>
                    <div>
                      <strong style={{ color: '#2c3e50' }}>Submitted:</strong>
                      <div style={{ color: '#7f8c8d' }}>{event.submittedDate}</div>
                    </div>
                  </div>

                  {event.requirements && event.requirements !== 'None' && (
                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ color: '#2c3e50', fontSize: '0.9rem' }}>Requirements:</strong>
                      <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>{event.requirements}</div>
                    </div>
                  )}

                  {event.contactInfo && event.contactInfo !== 'N/A' && (
                    <div style={{ marginBottom: '1.5rem' }}>
                      <strong style={{ color: '#2c3e50', fontSize: '0.9rem' }}>Contact Info:</strong>
                      <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>{event.contactInfo}</div>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleRejectEvent(event)}
                    >
                      Reject
                    </button>
                    <button 
                      className="btn btn-success"
                      onClick={() => handleApproveEvent(event.id)}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && selectedEvent && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>Reject Event</h3>
              <button
                onClick={() => setShowRejectModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#7f8c8d'
                }}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <p style={{ marginBottom: '1rem' }}>
                Are you sure you want to reject "<strong>{selectedEvent.title}</strong>"?
              </p>
              
              <div className="form-group">
                <label htmlFor="rejectReason" className="form-label">
                  Reason for rejection *
                </label>
                <textarea
                  id="rejectReason"
                  className="form-input"
                  rows="4"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Provide a clear reason for rejection that will be communicated to the club head..."
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={confirmRejectEvent}
                disabled={!rejectReason.trim()}
              >
                Reject Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventApprovals;
