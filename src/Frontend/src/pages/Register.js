import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    uname: '',
    email: '',
    phoneno: '',
    password: '',
    confirmPassword: '',
    dname: '',
    role: { rid: 2 } 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  const navigate = useNavigate();

  const departments = [
    'Instrumentation & Control',
    'Electronics',
    'Mechanical Engineering',
    'Civil Engineering',
    'Information Technology',
    'Architecture',
    'Computer Science'
  ];

  
  const validateFullName = (name) => {
    const nameRegex = /^[A-Za-z]+(\s[A-Za-z]+){2,}$/; 
    const minWords = name.trim().split(' ').filter(word => word.length > 0).length;
    
    if (!name.trim()) {
      return 'Full name is required';
    }
    if (minWords < 3) {
      return 'Please enter your full name (First, Middle, Last name)';
    }
    if (name.length < 3) {
      return 'Name must be at least 3 characters long';
    }
    if (!/^[A-Za-z\s]+$/.test(name)) {
      return 'Name should contain only letters and spaces';
    }
    if (name.length > 100) {
      return 'Name must be less than 100 characters';
    }
    return null;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'edu.in', 'ac.in'];
    
    if (!email.trim()) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    const domain = email.split('@')[1]?.toLowerCase();
    if (!validDomains.some(validDomain => domain === validDomain || domain.endsWith('.' + validDomain))) {
      return `Email must end with valid domains like: ${validDomains.join(', ')}`;
    }
    
    return null;
  };

  const validatePhoneNumber = (phone) => {
    
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^\+91[6-9]\d{9}$/; 
    
    if (!phone.trim()) {
      return 'Phone number is required';
    }
    if (!cleanPhone.startsWith('+91')) {
      return 'Phone number must start with +91 (India country code)';
    }
    if (!phoneRegex.test(cleanPhone)) {
      return 'Please enter a valid 10-digit Indian mobile number starting with +91';
    }
    if (cleanPhone.length !== 13) { 
      return 'Phone number must be exactly 10 digits after +91';
    }
    
    return null;
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    if (!password) {
      return 'Password is required';
    }
    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long`;
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)';
    }
    if (/\s/.test(password)) {
      return 'Password cannot contain spaces';
    }
    if (password.length > 128) {
      return 'Password must be less than 128 characters';
    }
    
    return null;
  };

  const validateDepartment = (department) => {
    if (!department.trim()) {
      return 'Department is required';
    }
    if (department.length < 2) {
      return 'Department name must be at least 2 characters long';
    }
    if (!/^[A-Za-z\s&]+$/.test(department)) {
      return 'Department name should contain only letters, spaces, and &';
    }
    return null;
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
      return 'Please confirm your password';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const validateField = (name, value) => {
    let error = null;
    
    switch (name) {
      case 'uname':
        error = validateFullName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'phoneno':
        error = validatePhoneNumber(value);
        break;
      case 'dname':
        error = validateDepartment(value);
        break;
      case 'password':
        error = validatePassword(value);
      
        if (formData.confirmPassword) {
          const confirmError = validateConfirmPassword(value, formData.confirmPassword);
          setValidationErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        }
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(formData.password, value);
        break;
      default:
        break;
    }
    
    setValidationErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    
    let formattedValue = value;
    if (name === 'phoneno') {
      
      if (value && !value.startsWith('+91') && /^[6-9]/.test(value)) {
        formattedValue = '+91' + value;
      }
      
      if (formattedValue.startsWith('+91')) {
        const numbers = formattedValue.substring(3).replace(/\D/g, '');
        if (numbers.length <= 10) {
          formattedValue = '+91' + numbers;
        } else {
          return; 
        }
      }
    }
    
    
    if (name === 'uname' || name === 'dname') {
      formattedValue = formattedValue.replace(/\b\w/g, l => l.toUpperCase());
    }
    
    if (name === 'role') {
      setFormData({
        ...formData,
        role: { rid: parseInt(value) }
      });
    } else {
      setFormData({
        ...formData,
        [name]: formattedValue
      });
    }
    
    
    validateField(name, formattedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setValidationErrors({});

  
    const errors = {};
    
    errors.uname = validateFullName(formData.uname);
    errors.email = validateEmail(formData.email);
    errors.phoneno = validatePhoneNumber(formData.phoneno);
    errors.dname = validateDepartment(formData.dname);
    errors.password = validatePassword(formData.password);
    errors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);
    
    
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

    try {
      
      const registrationData = {
        uname: formData.uname,
        email: formData.email,
        phoneno: formData.phoneno,
        password: formData.password,
        role: { rid: 2 }, 
        dname: formData.dname
      };


      const response = await authService.register(registrationData);
    
      
      setSuccess('Registration successful! Please login with your credentials.');
      
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      
     
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error: Unable to connect to the server. Please check if the backend service is running on port 8081.';
      } else if (error.response) {
        
        if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Email Id Already registered.';
        } else if (error.response.status === 409) {
          errorMessage = 'User with this email already exists. Please use a different email address.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
  
        errorMessage = 'No response from server. Please check your connection and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      
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
            <h1>Join Our</h1>
            <h2>College Community</h2>
            <p>Create your account and become part of an amazing college experience!</p>
          </div>
        </div>
      </div>

    
      <div className="auth-form-side">
        <div className="auth-form-container">
          <form className="auth-form register-form" onSubmit={handleSubmit}>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join us and explore amazing clubs and events</p>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                {success}
              </div>
            )}

        <div className="form-group">
          <label htmlFor="uname" className="form-label">
            Full Name *
          </label>
          <input
            type="text"
            id="uname"
            name="uname"
            className={`form-input ${validationErrors.uname ? 'error' : ''}`}
            value={formData.uname}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="First   Middle   Last"
            maxLength="100"
          />
          {validationErrors.uname && (
            <div className="field-error">{validationErrors.uname}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address *
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
            placeholder="eg. virajlondhe789@gmail.com"
          />
          {validationErrors.email && (
            <div className="field-error">{validationErrors.email}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phoneno" className="form-label">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phoneno"
            name="phoneno"
            className={`form-input ${validationErrors.phoneno ? 'error' : ''}`}
            value={formData.phoneno}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="+91"
            maxLength="13"
          />
          {validationErrors.phoneno && (
            <div className="field-error">{validationErrors.phoneno}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="dname" className="form-label">
            Department *
          </label>
          <input
            type="text"
            id="dname"
            name="dname"
            className={`form-input ${validationErrors.dname ? 'error' : ''}`}
            list="departments"
            value={formData.dname}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Select department name"
            maxLength="100"
          />
          <datalist id="departments">
            {departments.map((dept) => (
              <option key={dept} value={dept} />
            ))}
          </datalist>
          {validationErrors.dname && (
            <div className="field-error">{validationErrors.dname}</div>
          )}
          
        </div>

        
        <input type="hidden" name="role" value="2" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password *
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
              placeholder="Enter strong password"
              minLength="8"
              maxLength="128"
            />
            {validationErrors.password && (
              <div className="field-error">{validationErrors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={`form-input ${validationErrors.confirmPassword ? 'error' : ''}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Confirm password"
              minLength="8"
              maxLength="128"
            />
            {validationErrors.confirmPassword && (
              <div className="field-error">{validationErrors.confirmPassword}</div>
            )}
          </div>
        </div>

            <button
              type="submit"
              className="btn btn-primary auth-btn"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="auth-links">
              <p>
                Already have an account?{'    '}
                <Link to="/login" className="auth-link">
                  Sign In
                </Link>
              </p>
            </div>

            
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
