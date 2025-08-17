import React, { useState, useEffect } from 'react';
import { clubService } from '../../services/clubService';
import { useAuth } from '../../contexts/AuthContext';

const BrowseClubs = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [userClubMemberships, setUserClubMemberships] = useState(new Set());
  const [joiningClub, setJoiningClub] = useState(null);
  const [leavingClub, setLeavingClub] = useState(null);


  useEffect(() => {
    const loadData = async () => {
      if (user?.uid || user?.id) {
        await fetchUserMemberships();
      }
      await fetchClubs();
    };
    
    loadData();
  }, [user]);

  useEffect(() => {
    let filtered = clubs.filter(club =>
      club.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCategory && selectedCategory !== 'All') {
      filtered = filtered.filter(club => club.category === selectedCategory);
    }

    setFilteredClubs(filtered);
  }, [clubs, searchTerm, selectedCategory]);

  const fetchUserMemberships = async () => {
    try {
      const userId = user?.uid || user?.id;
      if (!userId) return;
      
      
      const response = await clubService.getUserClubMemberships(userId);
      
      const membershipSet = new Set();
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach(membership => {
          membershipSet.add(membership.clubId || membership.cId || membership.club_id);
        });
      }
      
      setUserClubMemberships(membershipSet);
    } catch (error) {
      setUserClubMemberships(new Set());
    }
  };

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const response = await clubService.getActiveClubs();
      
      const transformedClubs = response.data.map(club => {
        const clubId = club.cid;
        const isJoined = userClubMemberships.has(clubId);
        
        const transformedClub = {
          id: clubId,
          name: club.cname,
          description: club.description || 'No description available',
          category: club.category || 'General',
          president: club.user?.uname || 'TBD',
          memberCount: club.memberCount || 0,
          establishedDate: club.date ? new Date(club.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          status: club.status ? 'Active' : 'Inactive',
          email: club.user?.email || '',
          meetingDay: club.meetingDay || 'TBD',
          meetingTime: club.meetingTime || 'TBD',
          events: club.events || [],
          requirements: 'Open to all students',
          benefits: 'Networking, skill development, leadership opportunities',
          isJoined: isJoined
        };
        
        console.log('Transformed club:', transformedClub);
        return transformedClub;
      });
      
      setClubs(transformedClubs);
      
    } catch (error) {
      console.error('Error fetching clubs:', error);
      
      let errorMessage = 'Failed to load clubs.';
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to admin service. Please check if it\'s running on port 8083.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error while fetching clubs.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      }
      
  
      alert(errorMessage + ' Please check console for details.');
      

      setClubs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = async (clubId) => {
    try {
      setJoiningClub(clubId);
      const userId = user?.uid || user?.id;
      await clubService.sendJoinRequest({uId: userId, cId: clubId});
      
    
      setClubs(clubs.map(club => 
        club.id === clubId 
          ? { ...club, isJoined: true, memberCount: club.memberCount + 1 }
          : club
      ));
      
      
      setUserClubMemberships(prev => new Set([...prev, clubId]));
      
      alert('Successfully sent join request for the club!');
    } catch (error) {
      alert('Failed to join club. Please try again.');
    } finally {
      setJoiningClub(null);
    }
  };

  const handleLeaveClub = async (clubId) => {
    if (window.confirm('Are you sure you want to leave this club?')) {
      try {
        setLeavingClub(clubId);
        const userId = user?.uid || user?.id;
        
        if (!userId) {
          alert('User ID not found. Please log in again.');
          return;
        }
        
        const response = await clubService.leaveClub(clubId, userId);
        
        setClubs(clubs.map(club => 
          club.id === clubId 
            ? { ...club, isJoined: false, memberCount: Math.max(0, club.memberCount - 1) }
            : club
        ));
        
        setUserClubMemberships(prev => {
          const newSet = new Set(prev);
          newSet.delete(clubId);
          return newSet;
        });
        
        alert('Successfully left the club.');
      } catch (error) {
        
        let errorMessage = 'Failed to leave club.';
        if (error.response?.data) {
          errorMessage = typeof error.response.data === 'string' 
            ? error.response.data 
            : error.response.data.message || errorMessage;
        }
        
        alert(errorMessage);
      } finally {
        setLeavingClub(null);
      }
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
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Browse Clubs</h1>
        <p style={{ color: '#7f8c8d' }}>
          Discover and join clubs that match your interests
        </p>
      </div>

      

      

      {filteredClubs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ color: '#7f8c8d', marginBottom: '1rem' }}>No Clubs Found</h3>
          <p style={{ color: '#7f8c8d' }}>
            Try adjusting your search terms or category filter
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
          gap: '2rem' 
        }}>
          {filteredClubs.map((club) => (
            <div key={club.id} className="card" style={{ position: 'relative' }}>
              

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
                  <strong style={{ color: '#2c3e50' }}>President:</strong>
                  <div style={{ color: '#7f8c8d' }}>{club.president}</div>
                </div>
                
                
              </div>

              
              <div style={{ 
                display: 'flex', 
                gap: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #eee'
              }}>
               
                {(user?.pos === 'club_member' || user?.pos === 'student' || !user?.pos) && user?.pos !== 'club_head' && (
                  club.isJoined ? (
                    <button 
                      className="btn btn-danger" 
                      style={{ fontSize: '0.9rem' }}
                      onClick={() => handleLeaveClub(club.id)}
                      disabled={leavingClub === club.id}
                    >
                      {leavingClub === club.id ? 'Leaving...' : 'Leave Club'}
                    </button>
                  ) : (
                    <button 
                      className="btn btn-success" 
                      style={{ fontSize: '0.9rem' }}
                      onClick={() => handleJoinClub(club.id)}
                      disabled={joiningClub === club.id}
                    >
                      {joiningClub === club.id ? 'Joining...' : 'Join Club'}
                    </button>
                  )
                )}
                
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseClubs;
