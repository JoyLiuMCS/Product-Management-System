// pages/PasswordResetSent.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PasswordResetSent = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-overlay" style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => navigate('/signin')}
          style={{
            position: 'absolute',
            top: '-12px',
            right: '-12px',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            lineHeight: '28px',
          }}
        >
          &times;
        </button>

        <div className="auth-container">
          <h2>Email Sent</h2>
          <p>We've sent a password reset link to your email address.</p>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetSent;