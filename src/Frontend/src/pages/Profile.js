import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { profileService } from '../services/profileService';

const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [activityStats, setActivityStats] = useState({
    clubsJoined: 0,
    eventsAttended: 0,
    eventsOrganized: 0,
    attendanceRate: '0%'
  });
  const [formData, setFormData] = useState({
    uname: '',
    email: '',
    phoneno: '',
    dname: '',
    uid: '',
    bio: ''
  });
  

  useEffect(() => {
    if (user && user.uid) {
      fetchUserProfile();
      fetchUserActivityStats();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await profileService.getCurrentUserProfile(user.uid);
     
      
      setProfileData(profile);
      setFormData({
        uname: profile.uname || user.uname || '',
        email: profile.email || user.email || '',
        phoneno: profile.phoneno || user.phoneno || '',
        dname: profile.dname || user.department || '',
        uid: profile.uid || user.uid || '',
        bio: profile.bio || 'No bio provided yet.'
      });
    } catch (error) {
      
      setFormData({
        uname: user.uname || '',
        email: user.email || '',
        phoneno: user.phoneno || '',
        dname: user.department || '',
        uid: user.uid || '',
        bio: 'Unable to load profile data.'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserActivityStats = async () => {
    try {
      const stats = await profileService.getUserActivityStats(user.uid);
      setActivityStats(stats);
    } catch (error) {

    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await profileService.updateUserProfile(user.uid, formData);
      setEditing(false);
      alert('Profile updated successfully!');
      await fetchUserProfile();
    } catch (error) {
      
      alert('Failed to update profile. Please try again.');
    }
  };

  

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">User Profile</h2>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#3498db',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem',
                fontWeight: 'bold',
                marginRight: '1.5rem'
              }}>
                {formData.uname ? formData.uname.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
                  {formData.uname || 'User'}
                </h3>
                <p style={{ margin: 0, color: '#7f8c8d' }}>
                  {formData.dname || 'Department not specified'}
                </p>
                <p style={{ margin: '0.25rem 0 0 0', color: '#7f8c8d', fontSize: '0.9rem' }}>
                  User ID: {formData.uid}
                </p>
                <p style={{ margin: '0.25rem 0 0 0', color: '#7f8c8d', fontSize: '0.9rem' }}>
                  Role: {user?.role?.rname || user?.role || 'Student'} {user?.pos && `(${user.pos})`}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label htmlFor="uname" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  id="uname"
                  name="uname"
                  className="form-input"
                  value={formData.uname}
                  onChange={handleChange}
                  disabled={!editing}
                />
              </div>

              <div className="form-group">
                <label htmlFor="uid" className="form-label">
                  User ID
                </label>
                <input
                  type="text"
                  id="uid"
                  name="uid"
                  className="form-input"
                  value={formData.uid}
                  disabled={true}
                  style={{ backgroundColor: '#f8f9fa' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="phoneno" className="form-label">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneno"
                name="phoneno"
                className="form-input"
                value={formData.phoneno}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="dname" className="form-label">
                Department
              </label>
              <input
                type="text"
                id="dname"
                name="dname"
                className="form-input"
                value={formData.dname}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Enter your department"
              />
            </div>

          </div>
        </form>
      </div>

      

    </div>
  );
};

export default Profile;
