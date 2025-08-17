import React, { useState, useEffect, use } from 'react';
import {clubService} from '../../services/clubService';
import { useAuth } from '../../contexts/AuthContext';

const MyClubs = () => {
  const { user } = useAuth();
  const [myClubs, setMyClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyClubs();
  }, []);

  const fetchMyClubs = async () => {
    try {
      setLoading(true);
      const response = await clubService.getUserJoinedClubs(user.uid);
      setMyClubs(response.data);
    } catch (error) {
      console.error('Error fetching my clubs:', error);
      
      let errorMessage = 'Failed to load your clubs.';
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server.';
      } else if (error.response?.status === 404) {
        errorMessage = 'No clubs found.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error while fetching clubs.';
      }
      
      console.error('MyClubs fetch error:', errorMessage);
      setMyClubs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveClub = async (clubId) => {
    if (window.confirm('Are you sure you want to leave this club?')) {
      
      const response = await clubService.leaveClub(clubId,user.uid);
      console.log(response)
      setMyClubs(response.data);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading your clubs...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>My Clubs</h1>
        <p style={{ color: '#7f8c8d' }}>
          Clubs you've joined and your involvement
        </p>
      </div>

      {myClubs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ color: '#7f8c8d', marginBottom: '1rem' }}>No Clubs Joined Yet</h3>
          <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>
            You haven't joined any clubs yet. Explore available clubs to get started!
          </p>
          <a href="/browse-clubs" className="btn btn-primary">
            Browse Available Clubs
          </a>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
          gap: '2rem' 
        }}>
          {myClubs.map((club) => (
            <div key={club.id} className="card" style={{ position: 'relative' }}>
              <h4>{club.clubname}</h4>
              

              <div style={{ paddingRight: '4rem' }}>
                <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>
                  {club.name}
                </h3>
                <p style={{ color: '#7f8c8d', marginBottom: '1rem', lineHeight: '1.4' }}>
                  {club.description}
                </p>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '1rem',
                marginBottom: '1.5rem',
                fontSize: '0.9rem'
              }}>
          
               
                <div>
                  <strong style={{ color: '#2c3e50' }}>Creation Date:</strong>
                  <div style={{ color: '#7f8c8d' }}>
                    {new Date(club.creationdate).toLocaleDateString()}
                  </div>
                </div>
                
              </div>

              

              <div style={{ 
                display: 'flex', 
                gap: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #eee'
              }}>
                
                {/* <button 
                  className="btn btn-danger" 
                  style={{ fontSize: '0.9rem' }}
                  onClick={() => handleLeaveClub(club.id)}
                >
                  Leave Club
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClubs;
