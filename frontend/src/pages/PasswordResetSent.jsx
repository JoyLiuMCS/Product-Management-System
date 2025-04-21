import React from "react";
import { useNavigate } from "react-router-dom";

export default function PasswordResetSent() {
  const navigate = useNavigate();

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        <button onClick={() => navigate("/signin")} className="close-btn">
          &times;
        </button>

        <h2 className="auth-title">Email Sent</h2>
        <p>We've sent a password reset link to your email address.</p>
        
        <button 
          onClick={() => navigate("/signin")} 
          className="auth-btn"
          style={{ marginTop: "20px" }}
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
}