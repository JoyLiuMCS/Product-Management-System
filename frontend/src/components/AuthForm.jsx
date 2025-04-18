import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AuthForm({ type = 'signin' }) {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`${type} submitted:`, formData);

    // ✅ 模拟用户登录成功，保存用户信息（可加 token 等）
    const username = formData.email.split('@')[0]; // 用邮箱前缀作为用户名
    localStorage.setItem('user', JSON.stringify({ username }));

    // ✅ 登录成功后跳转到产品页
    navigate('/products');
  };

  return (
    <div className="auth-container">
      <h2>{type === 'signin' ? 'Sign In to Your Account' : 'Create New Account'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          minLength={8}
        />
        <button type="submit">
          {type === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

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
