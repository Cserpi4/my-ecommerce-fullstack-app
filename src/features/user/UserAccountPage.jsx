import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, updateProfile } from './UserSlice';
import { User, Mail, Save } from 'lucide-react';
import './UserAccountPage.css';

const UserAccountPage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.user);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(updateProfile(formData));
  };

  return (
    <div className="user-page">
      <div className="user-card">
        <div className="user-header">
          <User size={36} className="user-icon" />
          <h2 className="user-title">My Account</h2>
          <p className="user-subtitle">Manage your personal details and preferences</p>
        </div>

        {loading && <p className="user-info-message">Loading profile...</p>}
        {error && <p className="user-error">⚠️ {error}</p>}

        {user && (
          <form className="user-form" onSubmit={handleSubmit}>
            <label className="user-label">
              <Mail size={16} className="label-icon" />
              Username
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                className="user-input"
              />
            </label>

            <label className="user-label">
              <Mail size={16} className="label-icon" />
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="user-input"
              />
            </label>

            <button type="submit" disabled={loading} className="user-button">
              <Save size={18} />
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserAccountPage;
