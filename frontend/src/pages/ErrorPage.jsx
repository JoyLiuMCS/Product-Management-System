import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = ({ message = "Oops, something went wrong!" }) => {
  const navigate = useNavigate();

  return (
    <div className="error-page-container">
      <div className="error-card">
        <div className="error-icon">!</div>
        <h2 className="error-title">{message}</h2>
        <button className="error-btn" onClick={() => navigate('/')}>
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
