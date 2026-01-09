// src/features/auth/LoginPage.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from './AuthSlice';
import { LogIn } from 'lucide-react';
import BackButton from '../../components/common/BackButton';
import './LoginPage.css';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <BackButton /> {/* ✅ Back button itt van */}
        <div className="login-header">
          <LogIn size={28} className="login-icon" />
          <h2 className="login-title">Sign In to Football-Shop</h2>
        </div>
        {error && <p className="login-error">⚠️ {error}</p>}
        <input
          type="text"
          name="username"
          placeholder="Username or Email"
          value={formData.username}
          onChange={handleChange}
          required
          className="login-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="login-input"
        />
        <button type="submit" disabled={loading} className="login-button">
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <div className="login-links">
          <span onClick={() => navigate('/forgot-password')}>Forgot your password?</span>
          <span onClick={() => navigate('/register')}>Create new account</span>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
