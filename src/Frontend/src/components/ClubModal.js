import React, { useState, useEffect } from 'react';

const ClubModal = ({ club, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    president: '',
    advisor: '',
    email: '',
    meetingDay: '',
    meetingTime: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (club) {
      setFormData({
        name: club.name || '',
        description: club.description || '',
        category: club.category || '',
        president: club.president || '',
        advisor: club.advisor || '',
        email: club.email || '',
        meetingDay: club.meetingDay || '',
        meetingTime: club.meetingTime || '',
        status: club.status || 'Active'
      });
    }
  }, [club]);

  


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

    if (!formData.name.trim()) {
      newErrors.name = 'Club name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.president.trim()) {
      newErrors.president = 'President name is required';
    }

    if (!formData.advisor.trim()) {
      newErrors.advisor = 'Faculty advisor is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ margin: 0 }}>
            {club ? 'Edit Club' : 'Add New Club'}
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
              <label htmlFor="name" className="form-label">
                Club Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {errors.name}
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
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {club ? 'Update Club' : 'Add Club'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClubModal;
