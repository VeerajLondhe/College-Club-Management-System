import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  };

  const validateField = (name, value) => {
    let error = null;
    
    switch (name) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      default:
        break;
    }
    
    setValidationErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData, 
      [name]: value
    });
    
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationErrors({});

    const errors = {};
    errors.email = validateEmail(formData.email);
    errors.password = validatePassword(formData.password);
    
    Object.keys(errors).forEach(key => {
      if (errors[key] === null) {
        delete errors[key];
      }
    });
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please fix the validation errors below');
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      {/* Left Side - Animation */}
      <div className="auth-animation-side">
        <div className="animation-content">
          <div className="college-animation">
            <div className="building">
              <div className="building-base"></div>
              <div className="building-top"></div>
              <div className="flag"></div>
            </div>
            
            <div className="floating-icons">
              <div className="icon-circle icon-1">🎓</div>
              <div className="icon-circle icon-2">📚</div>
              <div className="icon-circle icon-3">🏆</div>
              <div className="icon-circle icon-4">⚽</div>
              <div className="icon-circle icon-5">🎨</div>
              <div className="icon-circle icon-6">🎵</div>
            </div>
            
            <div className="students">
              <div className="student student-1"></div>
              <div className="student student-2"></div>
              <div className="student student-3"></div>
            </div>
          </div>
          
          <div className="welcome-text">
            <h1>Welcome to</h1>
            <h2>College Club Management System</h2>
            <p>Join clubs, participate in events, and make your college experience memorable!</p>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h1 className="auth-title">Sign In</h1>
            <p className="auth-subtitle">Access your account to explore clubs and events</p>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-input ${validationErrors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your email address"
              />
              {validationErrors.email && (
                <div className="field-error">{validationErrors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-input ${validationErrors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Enter your password"
                minLength="6"
              />
              {validationErrors.password && (
                <div className="field-error">{validationErrors.password}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-btn"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="auth-links">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="auth-link">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;