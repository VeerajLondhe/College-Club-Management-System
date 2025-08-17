import React, { useState, useEffect } from 'react';
import { clubService } from '../../services/clubService';
import { useAuth } from '../../contexts/AuthContext';

const ManageClubs = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClubs, setFilteredClubs] = useState([]);

  useEffect(() => {
    fetchClubs();
  }, []);

  useEffect(() => {
    filterClubs();
  }, [clubs, selectedTab, searchTerm]);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const response = await clubService.getAllClubs();
      
      const transformedClubs = response.data.map(club => ({
        id: club.cid,
        name: club.cname,
        description: club.description,
        category: club.category || 'General',
        president: club.user?.uname || 'TBD',
        presidentEmail: club.user?.email || '',
        presidentId: club.user?.uid || '',
        advisor: club.advisor || 'TBD',
        memberCount: club.memberCount || 0,
        establishedDate: club.date ? new Date(club.date).toLocaleDateString() : 'N/A',
        status: club.status === true ? 'active' : 'inactive',
        rawStatus: club.status,
        events: club.events || [],
        lastActivity: club.lastActivity || new Date().toISOString(),
        needsApproval: club.status === null || club.status === false
      }));
      
      setClubs(transformedClubs);
    } catch (error) {
      setClubs([]);
      alert('Failed to load clubs. Please check if the admin service is running.');
    } finally {
      setLoading(false);
    }
  };

  const filterClubs = () => {
    let filtered = clubs;
    
    if (selectedTab === 'pending') {
      filtered = clubs.filter(club => club.needsApproval);
    } else if (selectedTab === 'active') {
      filtered = clubs.filter(club => club.status === 'active');
    } else if (selectedTab === 'inactive') {
      filtered = clubs.filter(club => club.status === 'inactive');
    }
    if (searchTerm) {
      filtered = filtered.filter(club =>
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.president.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredClubs(filtered);
  };

  const handleApprove = async (clubId) => {
    try {
      await clubService.approveClub(clubId);
      setClubs(prev => prev.map(club =>
        club.id === clubId ? { ...club, status: 'active', needsApproval: false, rawStatus: true } : club
      ));
      alert('Club approved successfully!');
    } catch (error) {
      alert('Failed to approve club. Please try again.');
    }
  };

  const handleDeactivate = async (clubId) => {
    if (window.confirm('Are you sure you want to deactivate this club?')) {
      try {
        await clubService.getStatus(false);
        setClubs(prev => prev.map(club =>
          club.id === clubId ? { ...club, status: 'inactive', rawStatus: false } : club
        ));
        alert('Club deactivated successfully!');
      } catch (error) {
        alert('Failed to deactivate club. Please try again.');
      }
    }
  };

  const handleActivate = async (clubId) => {
    try {
      await clubService.approveClub(clubId);
      setClubs(prev => prev.map(club =>
        club.id === clubId ? { ...club, status: 'active', rawStatus: true } : club
      ));
      alert('Club activated successfully!');
    } catch (error) {
      alert('Failed to activate club. Please try again.');
    }
  };

  const handleDeleteClub = async (clubId) => {
    
    if (window.confirm('Are you sure you want to delete this club? This action cannot be undone.')) {
      try {
        const response = await clubService.deleteClub(clubId);
        setClubs(prev => {
          const updatedClubs = prev.filter(club => club.id !== clubId);
          return updatedClubs;
        });
        
        alert('Club deleted successfully!');
        
      } catch (error) {
        
        let errorMessage = 'Failed to delete club.';
        
        if (error.response) {
          if (error.response.status === 404) {
            errorMessage = 'Club not found. It may have already been deleted.';
          } else if (error.response.status === 403) {
            errorMessage = 'Permission denied. You may not have rights to delete this club.';
          } else if (error.response.status === 500) {
            errorMessage = 'Server error occurred while deleting club.';
          } else {
            errorMessage = `Error ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
          }
        } else if (error.request) {
          errorMessage = 'Cannot connect to server. Please check if the admin service is running on port 8083.';
        }
        
        alert(errorMessage + ' Check console for details.');
      }
    } else {
    }
  };

  
 

  const renderClubCard = (club) => (
    <div key={club.id} className="card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '1rem'
      }}>
        <h3 style={{ color: '#2c3e50', margin: 0, flex: 1 }}>
          {club.name}
        </h3>
        
      </div>

      <p style={{ color: '#7f8c8d', marginBottom: '1rem', lineHeight: '1.4' }}>
        {club.description || 'No description available'}
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '1.5rem',
        fontSize: '0.9rem'
      }}>
        <div>
          <strong style={{ color: '#2c3e50' }}>President:</strong>
          <div style={{ color: '#7f8c8d' }}>{club.president}</div>
          <div style={{ color: '#7f8c8d', fontSize: '0.8rem' }}>
            {club.presidentEmail}
          </div>
        </div>
        
        <div>
          <strong style={{ color: '#2c3e50' }}>Established:</strong>
          <div style={{ color: '#7f8c8d' }}>
            {club.establishedDate}
          </div>
        </div>
        <div>
          <strong style={{ color: '#2c3e50' }}>Events:</strong>
          <div style={{ color: '#7f8c8d' }}>
            {club.events.length} events
          </div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '1rem', 
        borderRadius: '4px',
        marginBottom: '1.5rem'
      }}>
        <strong style={{ color: '#2c3e50', marginBottom: '0.5rem', display: 'block' }}>
          Management Info:
        </strong>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '0.5rem',
          fontSize: '0.9rem'
        }}>
          <div>
            <strong style={{ color: '#2c3e50' }}>Club ID:</strong>
            <div style={{ color: '#7f8c8d' }}>{club.id}</div>
          </div>
          
          <div>
            <strong style={{ color: '#2c3e50' }}>President ID:</strong>
            <div style={{ color: '#7f8c8d' }}>{club.presidentId || 'N/A'}</div>
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '0.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid #eee',
        flexWrap: 'wrap'
      }}>
        {club.needsApproval ? (
          <button 
            className="btn btn-success" 
            onClick={() => handleApprove(club.id)}
          >
            ✅ Approve Club
          </button>
        ) : club.status === 'active' ? (
          <button 
            className="btn btn-warning" 
            onClick={() => handleDeactivate(club.id)}
          >
            ⏸️ Deactivate
          </button>
        ) : (
          <button 
            className="btn btn-success" 
            onClick={() => handleActivate(club.id)}
          >
            ▶️ Activate
          </button>
        )}
        
        <button 
          className="btn btn-danger" 
          onClick={() => handleDeleteClub(club.id)}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading pending approvals...</p>
      </div>
    );
  }

  const pendingCount = clubs.filter(club => club.needsApproval).length;
  const activeCount = clubs.filter(club => club.status === 'active').length;
  const inactiveCount = clubs.filter(club => club.status === 'inactive').length;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Manage Clubs</h1>
        <p style={{ color: '#7f8c8d' }}>
          Manage all clubs, approve new requests, and monitor club activities
        </p>
      </div>

      <div className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search clubs by name, description, president, or category..."
            className="form-input"
            style={{ flex: 1, minWidth: '300px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
            {filteredClubs.length} of {clubs.length} clubs
          </div>
          
        </div>
      </div>
      <div className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'All Clubs', count: clubs.length },
            { key: 'pending', label: 'Pending Approval', count: pendingCount },
            { key: 'active', label: 'Active Clubs', count: activeCount },
            { key: 'inactive', label: 'Inactive Clubs', count: inactiveCount }
          ].map(tab => (
            <button
              key={tab.key}
              className={`btn ${selectedTab === tab.key ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSelectedTab(tab.key)}
              style={{ position: 'relative' }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: tab.key === 'pending' ? '#dc3545' : '#28a745',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <h3 style={{ color: '#3498db', margin: '0 0 0.5rem 0' }}>{clubs.length}</h3>
          <p style={{ margin: 0, color: '#7f8c8d' }}>Total Clubs</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <h3 style={{ color: '#f39c12', margin: '0 0 0.5rem 0' }}>{pendingCount}</h3>
          <p style={{ margin: 0, color: '#7f8c8d' }}>Pending Approval</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <h3 style={{ color: '#27ae60', margin: '0 0 0.5rem 0' }}>{activeCount}</h3>
          <p style={{ margin: 0, color: '#7f8c8d' }}>Active Clubs</p>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <h3 style={{ color: '#e74c3c', margin: '0 0 0.5rem 0' }}>{inactiveCount}</h3>
          <p style={{ margin: 0, color: '#7f8c8d' }}>Inactive Clubs</p>
        </div>
      </div>
      {filteredClubs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ color: '#7f8c8d', marginBottom: '1rem' }}>
            {searchTerm ? 'No Clubs Found' : 'No Clubs Available'}
          </h3>
          <p style={{ color: '#7f8c8d' }}>
            {searchTerm 
              ? 'Try adjusting your search terms to find clubs.'
              : `There are currently no ${selectedTab === 'all' ? '' : selectedTab + ' '}clubs.`
            }
          </p>
        </div>
      ) : (
        <div>
          {filteredClubs.map(renderClubCard)}
        </div>
      )}
    </div>
  );
};

export default ManageClubs;
