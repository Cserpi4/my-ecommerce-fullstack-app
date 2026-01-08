import React, { useState } from 'react';
import { ShoppingCart, User, Home, Menu, X, Tally3, LogOut, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/AuthSlice';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user } = useSelector(state => state.auth);
  const cartItems = useSelector(state => state.cart?.items || []);
  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleNavigation = path => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    { path: '/', label: 'Home', Icon: Home },
    { path: '/products', label: 'Products', Icon: Tally3 },
    { path: '/cart', label: 'Cart', Icon: ShoppingCart },
  ];

  return (
    <header className="header-root">
      <div className="header-content">
        <div className="logo-link" onClick={() => handleNavigation('/')}>
          <Tally3 strokeWidth={3} /> Football-Shop App
        </div>

        {/* Desktop nav */}
        <nav className="nav-links">
          {navItems.map(item => (
            <div
              key={item.path}
              className={`nav-item ${window.location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleNavigation(item.path)}
            >
              {item.label}
            </div>
          ))}

          {user ? (
            <>
              <div className="nav-item" onClick={() => handleNavigation('/account')}>
                Account
              </div>
              <div className="nav-item logout" onClick={handleLogout}>
                Logout
              </div>
            </>
          ) : (
            <div className="nav-item" onClick={() => handleNavigation('/login')}>
              Login
            </div>
          )}
        </nav>

        {/* Icon buttons */}
        <div className="icon-container">
          <div className="icon-button" onClick={() => handleNavigation('/cart')}>
            <ShoppingCart size={24} />
            {totalItemsInCart > 0 && <span className="cart-badge">{totalItemsInCart}</span>}
          </div>

          {user ? (
            <div className="icon-button" onClick={() => handleNavigation('/account')}>
              <UserCircle size={24} />
            </div>
          ) : (
            <div className="icon-button" onClick={() => handleNavigation('/login')}>
              <User size={24} />
            </div>
          )}

          <div className="mobile-menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {isMobileMenuOpen && (
        <nav className="mobile-nav">
          {navItems.map(item => (
            <div
              key={item.path}
              className="mobile-nav-item"
              onClick={() => handleNavigation(item.path)}
            >
              <item.Icon size={20} />
              <span>{item.label}</span>
            </div>
          ))}

          {user ? (
            <>
              <div className="mobile-nav-item" onClick={() => handleNavigation('/account')}>
                <UserCircle size={20} />
                <span>My Account</span>
              </div>
              <div className="mobile-nav-item logout" onClick={handleLogout}>
                <LogOut size={20} />
                <span>Logout</span>
              </div>
            </>
          ) : (
            <div className="mobile-nav-item" onClick={() => handleNavigation('/login')}>
              <User size={20} />
              <span>Login</span>
            </div>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
