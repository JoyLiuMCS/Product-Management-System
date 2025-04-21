import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../components/AuthStyles.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    } else if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    navigate('/password-reset-sent');
  };

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        <button onClick={() => navigate('/')} className="close-btn">
          &times;
        </button>

        <h2 className="auth-title">Forgot Password</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`auth-input ${error ? 'error' : ''}`}
            />
            {error && <p className="error-text">{error}</p>}
          </div>

          <button type="submit" className="auth-btn">
            Send Reset Link
          </button>
        </form>

        <div className="auth-switch">
          Remember your password?{' '}
          <Link to="/signin" className="auth-link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}