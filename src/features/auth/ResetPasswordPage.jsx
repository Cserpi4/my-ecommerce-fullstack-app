import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword, clearAuthMessage } from './AuthSlice';
import './ResetPasswordPage.css';

const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const { loading, error, message } = useSelector(state => state.auth);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }
    dispatch(resetPassword({ token, password }));
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => navigate('/login'), 2500);
      return () => clearTimeout(timer);
    }
  }, [message, navigate]);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => dispatch(clearAuthMessage()), 4000);
      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Reset Your Password</h2>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
