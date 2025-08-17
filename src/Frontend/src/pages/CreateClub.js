import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { studentApi } from '../services/api';

const CreateClub = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    clubname: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const clubData = {
        clubname: formData.clubname,
        description: formData.description,
        requestingUId: user.uid
      };

      const response = await studentApi.post('/api/Student/request', clubData);
      
      setSuccess('Club created successfully! It is pending admin approval (status = 0).');
      
  
      setFormData({
        clubname: '',
        description: ''
      });

    } catch (error) {
      setError(error.response?.data || error.message || 'Failed to create club. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Create New Club</h1>
        <p style={{ color: '#7f8c8d', margin: 0 }}>
          Submit a request to create a new club. Your request will be reviewed by administrators.
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: '#fee',
              color: '#c00',
              padding: '0.75rem',
              borderRadius: '4px',
              marginBottom: '1rem',
              border: '1px solid #fcc'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: '#d4edda',
              color: '#155724',
              padding: '0.75rem',
              borderRadius: '4px',
              marginBottom: '1rem',
              border: '1px solid #c3e6cb'
            }}>
              {success}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '600px', margin: '0 auto' }}>
            <div className="form-group">
              <label htmlFor="clubname" className="form-label">Club Name *</label>
              <input
                type="text"
                id="clubname"
                name="clubname"
                className="form-input"
                value={formData.clubname}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter club name"
                maxLength="255"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">Description *</label>
              <textarea
                id="description"
                name="description"
                className="form-input"
                rows="6"
                value={formData.description}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Describe the purpose and activities of your club"
                maxLength="255"
              />
            </div>
          </div>

          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={loading}
                onClick={() => {
                  setFormData({
                    clubname: '',
                    description: ''
                  });
                  setError('');
                  setSuccess('');
                }}
              >
                Reset
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating Club...' : 'Create Club'}
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="card" style={{ marginTop: '2rem' }}>
        <div>
          <h3 className="card-title">📋 Club Creation Process</h3>
        </div>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div>
              <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Step 1: Create Club</h4>
              <p style={{ color: '#7f8c8d', fontSize: '0.9rem', margin: 0 }}>
                Fill out the club creation form with club name and description. The club will be created with status = 0 (pending approval).
              </p>
            </div>
            <div>
              <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Step 2: Admin Approval</h4>
              <p style={{ color: '#7f8c8d', fontSize: '0.9rem', margin: 0 }}>
                Administrators will review your club and approve it (changing status from 0 to 1).
              </p>
            </div>
            <div>
              <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Step 3: Club Management</h4>
              <p style={{ color: '#7f8c8d', fontSize: '0.9rem', margin: 0 }}>
                Once approved, you can start managing your club and accepting members.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateClub;
