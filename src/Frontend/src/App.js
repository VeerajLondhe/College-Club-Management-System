import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Events from './pages/Events';
import Clubs from './pages/Clubs';
import Profile from './pages/Profile';

import CreateClub from './pages/CreateClub';
import CreateEvent from './pages/CreateEvent';
import MyClub from './pages/MyClub';
import ClubHeadDashboard from './pages/ClubHeadDashboard';
import MyClubs from './pages/student/MyClubs';
import BrowseClubs from './pages/student/BrowseClubs';
import MyEvents from './pages/student/MyEvents';
import BrowseEvents from './pages/student/BrowseEvents';
import BrowseEventsClubHead from './pages/BrowseEventsClubHead';
import ManageClubs from './pages/admin/Approvals';
import ProtectedRoute from './components/ProtectedRoute';
import DefaultRedirect from './components/DefaultRedirect';
import './App.css';
import { clearAllSessions } from './utils/sessionManager';


if (process.env.NODE_ENV === 'development') {

  clearAllSessions();
  

  import('./utils/debugUser');
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<DefaultRedirect />} />
              <Route path="dashboard" element={<Dashboard />} />
          
              <Route path="members" element={<Members />} />
              <Route path="events" element={<Events />} />
              <Route path="clubs" element={<Clubs />} />
              <Route path="manage-clubs" element={<ManageClubs />} />
          
              <Route path="my-clubs" element={<MyClubs />} />
              <Route path="browse-clubs" element={<BrowseClubs />} />
              <Route path="my-events" element={<MyEvents />} />
              <Route path="browse-events" element={<BrowseEvents />} />
            
              <Route path="my-club" element={<MyClub />} />
              <Route path="club-head-dashboard" element={<ClubHeadDashboard />} />
              <Route path="browse-all-events" element={<BrowseEventsClubHead />} />
              <Route path="create-event" element={<CreateEvent />} />
              
              <Route path="create-club" element={<CreateClub />} />
      
              <Route path="profile" element={<Profile />} />
        
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
