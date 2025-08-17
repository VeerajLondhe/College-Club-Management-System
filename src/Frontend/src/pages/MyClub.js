import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { clubService } from '../services/clubService';
import { studentService } from '../services/studentService';

const MyClub = () => {
  const { user } = useAuth();
  const [club, setClub] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchMyClub();
  }, [user]);

  const fetchMyClub = async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      
      const clubResponse = await studentService.getMyClub(user.uid);
      const clubData = clubResponse.data;
      
      if (clubData) {
        
        const transformedClub = {
          id: clubData.cId,
          name: clubData.clubname,
          description: clubData.description,
          category: 'General', 
          establishedDate: clubData.creationdate ? new Date(clubData.creationdate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          status: clubData.status ? 'Active' : 'Pending',
          events: [],
          memberCount: 0 
        };
        
        setClub(transformedClub);
        setEditData({
          name: transformedClub.name,
          description: transformedClub.description,
          category: transformedClub.category
        });
        
        try {
          const membersResponse = await studentService.getClubMembers(user.uid);
          const membersData = membersResponse.data || [];
          setMembers(membersData);
          
          setClub(prev => ({
            ...prev,
            memberCount: membersData.length
          }));
        } catch (memberError) {
          setMembers([]);
        }
        
      } else {
        setClub(null);
      }
      
    } catch (error) {

      setClub(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      
      await clubService.updateClub(club.id, {
        cname: editData.name,
        description: editData.description,
        category: editData.category
      });
      
      
      setClub({
        ...club,
        name: editData.name,
        description: editData.description,
        category: editData.category
      });
      
      setEditing(false);
    } catch (error) {
    
    }
  };

  const handleCancel = () => {
    setEditData({
      name: club.name,
      description: club.description,
      category: club.category
    });
    setEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: value
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading your club...</p>
      </div>
    );
  }

  if (!club) {
    return (
      <div>
        <h1 style={{ color: '#2c3e50', marginBottom: '2rem' }}>My Club</h1>
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3 style={{ color: '#7f8c8d', marginBottom: '1rem' }}>No Club Found</h3>
          <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>
            You are not currently assigned as head of any club.
          </p>
          <button className="btn btn-primary">
            Contact Administrator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>My Club</h1>
          <p style={{ color: '#7f8c8d', margin: 0 }}>
            Manage your club information and activities
          </p>
        </div>
        
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Club Information</h2>
        </div>
        
        {editing ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Club Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={editData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="category" className="form-label">Category</label>
                <select
                  id="category"
                  name="category"
                  className="form-select"
                  value={editData.category}
                  onChange={handleChange}
                >
                  <option value="Academic">Academic</option>
                  <option value="Arts & Culture">Arts & Culture</option>
                  <option value="Sports & Recreation">Sports & Recreation</option>
                  <option value="Social Service">Social Service</option>
                  <option value="Technical">Technical</option>
                  <option value="Professional">Professional</option>
                  <option value="Environmental">Environmental</option>
                </select>
              </div>
            </div>
            
            <div>
              <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-input"
                  rows="4"
                  value={editData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                  {club.name}
                </h3>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  backgroundColor: club.status === 'Active' ? '#d4edda' : '#fff3cd',
                  color: club.status === 'Active' ? '#155724' : '#856404'
                }}>
                  {club.status}
                </span>
              </div>
              
              
              
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#2c3e50' }}>Established:</strong>
                <div style={{ color: '#7f8c8d' }}>{new Date(club.establishedDate).toLocaleDateString()}</div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#2c3e50' }}>Members:</strong>
                <div style={{ color: '#7f8c8d' }}>{club.memberCount}</div>
              </div>
            </div>
            
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#2c3e50' }}>Description:</strong>
                <p style={{ color: '#7f8c8d', lineHeight: '1.5', margin: '0.5rem 0 0 0' }}>
                  {club.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Club Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-number">{club.memberCount}</div>
          <div className="stat-label">Total Members</div>
        </div>
        
        
        <div className="stat-card">
          <div className="stat-number">{club.status === 'Active' ? '✓' : '⏳'}</div>
          <div className="stat-label">Club Status</div>
        </div>
      </div>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Club Members ({members.length})</h2>
        </div>
        
        {members.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#7f8c8d' }}>No members found</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Username</th>
                  <th>Position</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.userId}>
                    <td>{member.userId}</td>
                    <td>{member.username}</td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: member.position === 'club_head' ? '#fff3cd' : '#e2e3e5',
                        color: member.position === 'club_head' ? '#856404' : '#6c757d',
                        borderRadius: '4px',
                        fontSize: '0.8rem'
                      }}>
                        {member.position}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      
    </div>
  );
};

export default MyClub;
