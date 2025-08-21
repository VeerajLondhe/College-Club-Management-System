import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { studentApi } from '../services/api';

const CreateEvent = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    banner: null
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      banner: file
    }));
    if (errors.banner) {
      setErrors(prev => ({
        ...prev,
        banner: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    }

    if (!formData.banner) {
      newErrors.banner = 'Event banner image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const submitData = new FormData();
      submitData.append('Description', formData.description);
      submitData.append('BannerImage', formData.banner);

      const response = await studentApi.post(`/api/events/request?headUserId=${user.uid}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFormData({
        description: '',
        banner: null
      });
      const fileInput = document.getElementById('banner');
      if (fileInput) {
        fileInput.value = '';
      }

      alert('Event submitted successfully! It is now pending admin approval.');

    } catch (error) {
      let errorMessage = 'Failed to submit event.';
      
      if (error.code === 'ERR_CERT_AUTHORITY_INVALID' || error.message.includes('certificate')) {
        errorMessage = 'SSL Certificate Error: Please visit https://localhost:7173/swagger in your browser first and accept the security warning to trust the self-signed certificate, then try again.';
      } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        errorMessage = 'Network Error: Cannot connect to the Student Service. Please ensure it is running on https://localhost:7173';
      } else if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;
        
        if (status === 403) {
          errorMessage = `Access Denied: ${responseData || 'You may not be the head of an active club.'}`;
        } else if (status === 400) {
          errorMessage = `Bad Request: ${responseData || 'Invalid data provided.'}`;
        } else if (status === 500) {
          errorMessage = `Server Error: ${responseData || 'Internal server error occurred.'}`;
        } else {
          errorMessage = `Error ${status}: ${responseData || 'Please try again.'}`;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check if the Student Service is running on https://localhost:7173';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.pos !== 'club_head') {
    return (
      <div className="card">
        <div className="card-header">
          <h2>Create Event</h2>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h3>Access Denied</h3>
          <p>Only club heads can create events.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Create New Event</h2>
          <p style={{ margin: '0.5rem 0 0 0', color: '#6c757d' }}>
            Submit an event for admin approval
          </p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          {/* Event Description */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="description" style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 'bold',
              color: '#2c3e50'
            }}>
              Event Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.description ? '1px solid #dc3545' : '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
              placeholder="Describe your event in detail..."
            />
            {errors.description && (
              <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.description}
              </div>
            )}
          </div>

          {/* Event Banner */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="banner" style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 'bold',
              color: '#2c3e50'
            }}>
              Event Banner Image *
            </label>
            <input
              type="file"
              id="banner"
              name="banner"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.banner ? '1px solid #dc3545' : '1px solid #ced4da',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
            {errors.banner && (
              <div style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.banner}
              </div>
            )}
            <div style={{ color: '#6c757d', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Accepted formats: JPG, PNG, GIF (Max size: 5MB)
            </div>
          </div>

          {/* Preview Banner */}
          {formData.banner && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: 'bold',
                color: '#2c3e50'
              }}>
                Banner Preview
              </label>
              <img 
                src={URL.createObjectURL(formData.banner)} 
                alt="Banner Preview" 
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}
              />
            </div>
          )}

          {/* Submit Button */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid #dee2e6'
          }}>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ 
                padding: '0.75rem 2rem',
                fontSize: '1rem'
              }}
            >
              {loading ? 'Submitting...' : 'Submit for Approval'}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setFormData({ description: '', banner: null });
                setErrors({});
                const fileInput = document.getElementById('banner');
                if (fileInput) fileInput.value = '';
              }}
              className="btn btn-secondary"
              style={{ 
                padding: '0.75rem 2rem',
                fontSize: '1rem'
              }}
            >
              Clear Form
            </button>
          </div>

          

          
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
