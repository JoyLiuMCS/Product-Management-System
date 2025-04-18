import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthStyles.css'; // Import the CSS file

export default function AuthForm({ type = 'signin' }) {
  const [formData, setFormData] = React.useState({ 
    email: '', 
    password: '' 
  });
  const [errors, setErrors] = React.useState({ 
    email: '', 
    password: '' 
  });
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newErrors = { email: '', password: '' };
    let hasError = false;

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      hasError = true;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    const endpoint = type === 'signin' 
  ? 'http://localhost:5500/api/signin' 
  : 'http://localhost:5500/api/signup';

fetch(endpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formData),
})
  .then((res) => {
    if (!res.ok) throw new Error('Authentication failed');
    return res.json();
  })
  .then((data) => {
    console.log(`${type} successful:`, data);
    navigate('/'); // or wherever you want after login/signup
  })
  .catch((err) => {
    console.error(err);
    alert('Error during authentication.');
  });

  };

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        <button
          onClick={() => navigate('/')}
          className="close-btn"
        >
          &times;
        </button>

        <h2 className="auth-title">
          {type === 'signin' ? 'Sign In' : 'Sign Up'}
        </h2>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onInvalid={(e) => e.preventDefault()}
              className={`auth-input ${errors.email ? 'error' : ''}`}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`auth-input ${errors.password ? 'error' : ''}`}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <button type="submit" className="auth-btn">
            {type === 'signin' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {type === 'signin' && (
          <div className="auth-link-container">
            <Link to="/forgot-password" className="auth-link">
              Forgot Password?
            </Link>
          </div>
        )}

        <div className="auth-switch">
          {type === 'signin' ? (
            <>
              Don't have an account?{' '}
              <Link to="/signup" className="auth-link">Sign up</Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link to="/signin" className="auth-link">Sign in</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}