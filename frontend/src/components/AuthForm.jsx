import React from 'react';
import { Link } from 'react-router-dom';

export default function AuthForm({ type = 'signin' }) { // Default to signin
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`${type} submitted:`, formData);
    // API call would go here
  };

  return (
    <div className="auth-container">
      <h2>{type === 'signin' ? 'Sign In to Your Account' : 'Create New Account'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
          minLength={8}
        />
        <button type="submit">
          {type === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>
      
      {/* Toggle link between signin/signup */}
      {type === 'signin' ? (
        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      ) : (
        <p className="auth-switch">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      )}
    </div>
  );
}