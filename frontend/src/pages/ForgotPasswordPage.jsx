import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/AuthStyles.css'; 

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    console.log('Password reset requested for:', email);
    // Here you would typically call your API to send the reset email
    navigate('/password-reset-sent');
  };

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        <button onClick={() => navigate('/')} className="close-btn">
          &times;
        </button>
        <h2 className="auth-title">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              className={`auth-input ${error ? 'error' : ''}`}
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="error-text">{error}</p>}
          </div>
          <button className="auth-btn" type="submit">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
