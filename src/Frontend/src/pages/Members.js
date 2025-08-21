import React, { useState, useEffect } from 'react';
import { memberService } from '../services/memberService';
import MemberModal from '../components/MemberModal';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [filteredMembers, setFilteredMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    const filtered = members.filter(member =>
      member.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [members, searchTerm]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await memberService.getAllMembers();
      setMembers(response.data);
    } catch (error) {
      
      
      let errorMessage = 'Failed to load members.';
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error while fetching members.';
      } else if (error.response?.status === 404) {
        errorMessage = 'No members found.';
      }
      
      console.error('Members fetch error:', errorMessage);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    setSelectedMember(null);
    setShowModal(true);
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await memberService.deleteMember(memberId);
        setMembers(members.filter(member => member.id !== memberId));
      } catch (error) {
        
        let errorMessage = 'Failed to delete member.';
        if (error.code === 'ERR_NETWORK') {
          errorMessage = 'Cannot connect to server.';
        } else if (error.response?.status === 500) {
          errorMessage = 'Server error while deleting member.';
        } else if (error.response?.status === 404) {
          errorMessage = 'Member not found.';
        }
        
        alert(errorMessage);
      }
    }
  };

  const handleSaveMember = async (memberData) => {
    try {
      if (selectedMember) {
        await memberService.updateMember(selectedMember.id, memberData);
        setMembers(members.map(member => 
          member.id === selectedMember.id ? { ...member, ...memberData } : member
        ));
      } else {
        const response = await memberService.createMember(memberData);
        setMembers([...members, response.data]);
      }
      setShowModal(false);
      setSelectedMember(null);
    } catch (error) {
      
      let errorMessage = 'Failed to save member.';
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error while saving member.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication required.';
      }
      
      alert(errorMessage);
      
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading members...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Members Management</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search members..."
              className="form-input"
              style={{ width: '250px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleAddMember}>
              Add New Member
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Year</th>
                <th>Status</th>
                <th>Join Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    {searchTerm ? 'No members found matching your search.' : 'No members found.'}
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td>{member.studentId}</td>
                    <td>{member.firstName} {member.lastName}</td>
                    <td>{member.email}</td>
                    <td>{member.department}</td>
                    <td>{member.year}</td>
                    <td>
                      <span
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          backgroundColor: member.status === 'Active' ? '#d4edda' : '#f8d7da',
                          color: member.status === 'Active' ? '#155724' : '#721c24'
                        }}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td>{member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                          onClick={() => handleEditMember(member)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '1rem', color: '#7f8c8d', fontSize: '0.9rem' }}>
          Showing {filteredMembers.length} of {members.length} members
        </div>
      </div>

      {showModal && (
        <MemberModal
          member={selectedMember}
          onSave={handleSaveMember}
          onClose={() => {
            setShowModal(false);
            setSelectedMember(null);
          }}
        />
      )}
    </div>
  );
};

export default Members;
