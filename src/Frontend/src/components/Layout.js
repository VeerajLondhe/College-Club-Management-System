import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = (user) => {
    if (!user) return [];
    
    const role = user.role?.rname || user.role;
    const position = user.pos;
    
    if (role === 'admin' || role === 1) {
      return [
        { path: '/dashboard', name: 'Dashboard', icon: '📊' },
        { path: '/clubs', name: 'Browse Clubs', icon: '🔍' },
        { path: '/manage-clubs', name: 'Manage Clubs', icon: '🏛️' },
        { path: '/events', name: 'Manage Events', icon: '📅' },
        // { path: '/reports', name: 'Reports & Analytics', icon: '📈' },
        { path: '/profile', name: 'Profile', icon: '👤' }
      ];
    }
    
    if (role === 'student' || role === 2) {
      if (!position || position === null || position === 'null' || position === 'student') {
        return [
          { path: '/browse-clubs', name: 'Browse Clubs', icon: '🔍' },
          { path: '/browse-all-events', name: 'Browse All Events', icon: '🎯' },
          { path: '/create-club', name: 'Create Club', icon: '➕' },
          { path: '/profile', name: 'Profile', icon: '👤' }
        ];
      }
      
      if (position === 'club_head') {
        return [
          { path: '/club-head-dashboard', name: 'Club Dashboard', icon: '📊' },
          { path: '/my-club', name: 'My Club', icon: '🏛️' },
          { path: '/my-events', name: 'My Events', icon: '📅' },
          { path: '/create-event', name: 'Create Event', icon: '➕' },
          { path: '/browse-clubs', name: 'Browse Clubs', icon: '🔍' },
          { path: '/browse-all-events', name: 'Browse All Events', icon: '🎯' },
          { path: '/profile', name: 'Profile', icon: '👤' }
        ];
      }
      
      if (position === 'club_member') {
        return [
          { path: '/my-clubs', name: 'My Clubs', icon: '🏛️' },
          // { path: '/my-events', name: 'My Events', icon: '📅' },
          { path: '/browse-clubs', name: 'Browse Clubs', icon: '🔍' },
          { path: '/browse-all-events', name: 'Browse All Events', icon: '🎯' },
          // { path: '/create-club', name: 'Create Club', icon: '➕' },
          { path: '/profile', name: 'Profile', icon: '👤' }
        ];
      }
    }
    return [
      { path: '/profile', name: 'Profile', icon: '👤' }
    ];
  };

  const menuItems = getMenuItems(user);

  return (
    <div className="layout">
      <div className={`sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
        <div style={{ padding: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', textAlign: 'center' }}>
            {sidebarOpen ? 'Club Management' : 'CM'}
          </h2>
        </div>
        
        <nav style={{ padding: '1rem 0' }}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                color: 'white',
                textDecoration: 'none',
                backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderLeft: location.pathname === item.path ? '3px solid #3498db' : '3px solid transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <span style={{ fontSize: '1.2rem', marginRight: sidebarOpen ? '0.75rem' : '0' }}>
                {item.icon}
              </span>
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="main-content">
        <div className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              ☰
            </button>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#2c3e50' }}>
              {menuItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#2c3e50' }}>
              Welcome, {user?.uname || user?.firstName || 'User'}!
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem' }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
