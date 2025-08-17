import React, { useState, useEffect } from 'react';
import { clubService } from '../services/clubService';
import ClubModal from '../components/ClubModal';

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [filteredClubs, setFilteredClubs] = useState([]);

  useEffect(() => {
    fetchClubs();
  }, []);

  useEffect(() => {
    const filtered = clubs.filter(club =>
      club.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClubs(filtered);
  }, [clubs, searchTerm]);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const response = await clubService.getAllClubs();
      
      const transformedClubs = response.data.map(club => ({
        id: club.cid,
        name: club.cname,
        description: club.description,
        category: club.category || 'General', // Default if not provided
        president: club.user?.uname || 'TBD',
        advisor: club.advisor || 'TBD',
        memberCount: club.memberCount || 0,
        establishedDate: club.date ? new Date(club.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: club.status ? 'Active' : 'Inactive',
        email: club.user?.email || '',
        meetingDay: club.meetingDay || 'TBD',
        meetingTime: club.meetingTime || 'TBD',
        events: club.events || []
      }));
      
      setClubs(transformedClubs);
    } catch (error) {
      console.error('Error fetching clubs:', error);
      
      let errorMessage = 'Failed to load clubs.';
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to admin service. Please check if it\'s running on port 8083.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error while fetching clubs.';
      }
      
      setClubs([]);
      alert(errorMessage + ' Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClub = () => {
    setSelectedClub(null);
    setShowModal(true);
  };

  const handleEditClub = (club) => {
    setSelectedClub(club);
    setShowModal(true);
  };

  const handleDeleteClub = async (clubId) => {
    if (window.confirm('Are you sure you want to delete this club?')) {
      try {
        console.log('Attempting to delete club with ID:', clubId);
        const response = await clubService.deleteClub(clubId);
        console.log('Delete response:', response);
        
        setClubs(clubs.filter(club => club.id !== clubId));
        alert('Club deleted successfully!');
      } catch (error) {
        console.error('Error deleting club:', error);
        
        let errorMessage = 'Failed to delete club.';
        if (error.response) {
          if (error.response.status === 500) {
            errorMessage = 'Server error: Cannot delete club. It may have dependencies.';
          } else if (error.response.status === 404) {
            errorMessage = 'Club not found.';
          } else if (error.response.data && typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          }
        } else if (error.request) {
          errorMessage = 'Cannot connect to server. Please check if admin service is running.';
        }
        
        alert(errorMessage);
      }
    }
  };

  const handleSaveClub = async (clubData) => {
    try {
      if (selectedClub) {
        await clubService.updateClub(selectedClub.id, clubData);
        setClubs(clubs.map(club => 
          club.id === selectedClub.id ? { ...club, ...clubData } : club
        ));
      } else {
        const response = await clubService.createClub(clubData);
        setClubs([...clubs, response.data]);
      }
      setShowModal(false);
      setSelectedClub(null);
    } catch (error) {
      console.error('Error saving club:', error);
      
      let errorMessage = 'Failed to save club.';
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error while saving club.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication required.';
      }
      
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading clubs...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Clubs Management</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search clubs..."
              className="form-input"
              style={{ width: '250px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* <button className="btn btn-primary" onClick={handleAddClub}>
              Add New Club
            </button> */}
          </div>
        </div>

  
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '1.5rem',
          padding: '1rem 0'
        }}>
          {filteredClubs.length === 0 ? (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '2rem',
              color: '#7f8c8d' 
            }}>
              {searchTerm ? 'No clubs found matching your search.' : 'No clubs found.'}
            </div>
          ) : (
            filteredClubs.map((club) => (
              <div key={club.id} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '1.5rem',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50', fontSize: '1.2rem' }}>
                      {club.name}
                    </h3>
                    
                  </div>
                  <p style={{ 
                    color: '#7f8c8d', 
                    margin: '0 0 1rem 0',
                    lineHeight: '1.4',
                    fontSize: '0.9rem'
                  }}>
                    {club.description}
                  </p>
                </div>

                

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid #eee'
                }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    
                    <button
                      className="btn btn-danger"
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                      onClick={() => handleDeleteClub(club.id)}
                    >
                      Delete
                    </button>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>
                    Est. {club.establishedDate ? new Date(club.establishedDate).toDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: '1rem', color: '#7f8c8d', fontSize: '0.9rem' }}>
          Showing {filteredClubs.length} of {clubs.length} clubs
        </div>
      </div>

      {showModal && (
        <ClubModal
          club={selectedClub}
          onSave={handleSaveClub}
          onClose={() => {
            setShowModal(false);
            setSelectedClub(null);
          }}
        />
      )}
    </div>
  );
};

export default Clubs;
