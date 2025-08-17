import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        
        if (parsedUser.uid && parsedUser.email && parsedUser.role) {
          setUser(parsedUser);
        } else {
          clearSession();
        }
      } catch (error) {
        clearSession();
      }
    } else {
      clearSession();
    }
    
    setLoading(false);
  }, []);
  
  const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login({ username: email, password: password });
      const data = response.data;
      
      const user = {
        uid: data.uid,
        uname: data.uname,
        email: data.email,
        phoneno: data.phoneno,
        department: data.dname,
        role: data.role?.rname || data.role, 
        pos: data.pos 
      };
      
    
      if (!user.pos) {
        const roleName = typeof user.role === 'object' ? user.role.rname : user.role;
        user.pos = roleName?.toLowerCase() === 'admin' ? 'admin' : 'student';
      }
      
      
      const token = data.JWT || data.jwt || data.token;
      
      if (!token) {
        throw new Error('No JWT token received from server');
      }
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error) {
      clearSession();
      
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Invalid username or password.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.response.data) {
          errorMessage = error.response.data.message || error.response.data;
        }
      } else if (error.request) {
        errorMessage = 'Cannot connect to authentication server. Please check if the backend is running.';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
