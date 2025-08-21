

export const SessionManager = {
  
  clearSession: () => {
    console.log('Clearing all session data...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
  
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('auth') || key.includes('user') || key.includes('token'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log('Removed localStorage key:', key);
    });
  },
  
  
  isValidSession: () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      return false;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      return parsedUser.uid && parsedUser.email && parsedUser.role;
    } catch (error) {
      console.error('Invalid user data in localStorage:', error);
      return false;
    }
  },
  
  
  getCurrentUser: () => {
    if (!SessionManager.isValidSession()) {
      return null;
    }
    
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch (error) {
      console.error('Error parsing user data:', error);
      SessionManager.clearSession();
      return null;
    }
  },
  
  
  forceLogout: () => {
    SessionManager.clearSession();
    window.location.href = '/login';
  }
};


export const clearAllSessions = () => {
  console.log('🧹 Clearing all existing sessions...');
  SessionManager.clearSession();
};

export default SessionManager;
