
window.debugUser = {
  
  
  getCurrentUser: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Current user:', user);
    console.log('Role:', user.role);
    console.log('Position:', user.pos);
    return user;
  },

  
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log('Logged out. Please refresh the page.');
    window.location.reload();
  },
  
  
  clearSession: () => {
    localStorage.clear();
    console.log('All localStorage cleared. Please refresh the page.');
    window.location.reload();
  }
};



export default window.debugUser;
