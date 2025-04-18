import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    navigate('/password-reset-sent'); // Redirect to confirmation page
  };

  return (
    <div
      className="auth-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(247, 247, 247, 0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div style={{ position: 'relative' }}>
        {/* Close Button */}
        <div className="auth-container">
        <button
          onClick={() => navigate('/')}
          className="close-btn"
        >
          &times;
        </button>
          <h2>Reset Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
            <input
  className="auth-input"
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

              {error && <p className="error-text">{error}</p>}
            </div>

            <button type="submit">Send Reset Link</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;