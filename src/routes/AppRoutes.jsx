// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// --- Public pages
import WelcomePage from '../features/welcome/WelcomePage';
import ProductListPage from '../features/products/ProductListPage';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage';
import ResetPasswordPage from '../features/auth/ResetPasswordPage';

// --- Cart & Orders
import CartPage from '../features/cart/CartPage';
import CheckoutPage from '../features/orders/CheckoutPage';
import OrderConfirmation from '../features/orders/OrderConfirmation';

// --- User (private area)
import UserAccountPage from '../features/user/UserAccountPage';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ---------- 🌍 Public Routes ---------- */}
      <Route path="/" element={<WelcomePage />} />
      <Route path="/products" element={<ProductListPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* ---------- 🛒 Cart & Checkout ---------- */}
      {/* A Checkout most public (teszt miatt), de később PrivateRoute alá megy */}
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-success" element={<OrderConfirmation />} />

      {/* ---------- 🔒 Private Routes ---------- */}
      <Route element={<PrivateRoute />}>
        <Route path="/account" element={<UserAccountPage />} />
      </Route>

      {/* ---------- 🚧 Default Redirect ---------- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
