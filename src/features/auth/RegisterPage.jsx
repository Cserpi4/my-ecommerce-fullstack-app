// src/features/auth/RegisterPage.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from './AuthSlice';
import { UserPlus } from 'lucide-react';
import BackButton from '../../components/common/BackButton';
import './LoginPage.css'; // ugyanaz a stílus

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <BackButton label="Back to Login" />

        <div className="login-header">
          <UserPlus size={28} className="login-icon" />
          <h2 className="login-title">Create New Account</h2>
        </div>

        {error && <p className="login-error">⚠️ {error}</p>}
        {message && <p className="login-success">{message}</p>}

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="login-input"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
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
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
