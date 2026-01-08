// src/features/auth/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from './AuthSlice';
import { Mail } from 'lucide-react';
import BackButton from '../../components/common/BackButton';
import './LoginPage.css';

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector(state => state.auth);
  const [email, setEmail] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <BackButton label="Back to Login" />

        <div className="login-header">
          <Mail size={28} className="login-icon" />
          <h2 className="login-title">Forgot Password</h2>
        </div>

        {error && <p className="login-error">⚠️ {error}</p>}
        {message && <p className="login-success">{message}</p>}

        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="login-input"
        />

        <button type="submit" disabled={loading} className="login-button">
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
