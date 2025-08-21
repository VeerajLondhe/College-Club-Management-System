import React, { useState, useEffect } from 'react';
import { clubService } from '../services/clubService';

const EventModal = ({ event, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    club: '',
    date: '',
    time: '',
    location: '',
    capacity: '',
    organizer: '',
    type: '',
    status: 'Upcoming'
  });

  const [errors, setErrors] = useState({});
  const [clubs, setClubs] = useState([]);
  const [clubsLoading, setClubsLoading] = useState(true);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        club: event.club || '',
        date: event.date || '',
        time: event.time || '',
        location: event.location || '',
        capacity: event.capacity || '',
        organizer: event.organizer || '',
        type: event.type || '',
        status: event.status || 'Upcoming'
      });
    }
    fetchClubs();
  }, [event]);

  const fetchClubs = async () => {
    try {
      setClubsLoading(true);
      
      const response = await clubService.getActiveClubs();
      
      if (response.data && Array.isArray(response.data)) {
        const clubNames = response.data.map(club => club.cname || club.name);
        setClubs(clubNames);
      } else {
        setClubs([]);
      }
    } catch (error) {
      
      setClubs([]);
      
    } finally {
      setClubsLoading(false);
    }
  };

  const eventTypes = [
    'Workshop',
    'Seminar',
    'Conference',
    'Performance',
    'Competition',
    'Social',
    'Service',
    'Networking',
    'Sports',
    'Cultural'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.club.trim()) {
      newErrors.club = 'Club is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.capacity || formData.capacity <= 0) {
      newErrors.capacity = 'Valid capacity is required';
    }

    if (!formData.organizer.trim()) {
      newErrors.organizer = 'Organizer is required';
    }

    if (!formData.type) {
      newErrors.type = 'Event type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        capacity: parseInt(formData.capacity)
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ margin: 0 }}>
            {event ? 'Edit Event' : 'Add New Event'}
          </h3>
          <button
            onClick={onClose}
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

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && (
                <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {errors.title}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                className="form-input"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                style={{ resize: 'vertical' }}
              />
              {errors.description && (
                <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {errors.description}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="club" className="form-label">
                  Club *
                </label>
                <select
                  id="club"
                  name="club"
                  className="form-select"
                  value={formData.club}
                  onChange={handleChange}
                >
                  <option value="">Select Club</option>
                  {clubs.map((club) => (
                    <option key={club} value={club}>
                      {club}
                    </option>
                  ))}
                </select>
                {errors.club && (
                  <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.club}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="type" className="form-label">
                  Event Type *
                </label>
                <select
                  id="type"
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.type}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="date" className="form-label">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-input"
                  value={formData.date}
                  onChange={handleChange}
                />
                {errors.date && (
                  <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.date}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="time" className="form-label">
                  Time *
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  className="form-input"
                  value={formData.time}
                  onChange={handleChange}
                />
                {errors.time && (
                  <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.time}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="form-input"
                  value={formData.location}
                  onChange={handleChange}
                />
                {errors.location && (
                  <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.location}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="capacity" className="form-label">
                  Capacity *
                </label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  className="form-input"
                  min="1"
                  value={formData.capacity}
                  onChange={handleChange}
                />
                {errors.capacity && (
                  <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.capacity}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="organizer" className="form-label">
                  Organizer *
                </label>
                <input
                  type="text"
                  id="organizer"
                  name="organizer"
                  className="form-input"
                  value={formData.organizer}
                  onChange={handleChange}
                />
                {errors.organizer && (
                  <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {errors.organizer}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Pending Approval">Pending Approval</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {event ? 'Update Event' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
