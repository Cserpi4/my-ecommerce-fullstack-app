// src/routes/PrivateRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const { isAuthenticated } = useSelector(state => state.auth || {});

  if (isAuthenticated) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;
