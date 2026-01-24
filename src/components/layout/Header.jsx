import React, { useState } from 'react';
import { ShoppingCart, User, Home, Menu, X, Tally3, LogOut, UserCircle } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home', Icon: Home },
    { path: '/products', label: 'Products', Icon: Tally3 },
    { path: '/cart', label: 'Cart', Icon: ShoppingCart },
  ];

  return (
    <header className="header-root">
      <div className="header-content">
        <Link className="logo-link" to="/" onClick={() => setIsMobileMenuOpen(false)}>
          <Tally3 strokeWidth={3} /> Football-Shop
        </Link>

        {/* Desktop nav */}
        <nav className="nav-links">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}

          {user ? (
            <>
              <NavLink to="/account" className="nav-item nav-link">
                Account
              </NavLink>
              <button type="button" className="nav-item logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="nav-item nav-link">
              Login
            </NavLink>
          )}
        </nav>

        {/* Icon buttons */}
        <div className="icon-container">
          <Link className="icon-button" to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
            <ShoppingCart size={24} />
            {totalItemsInCart > 0 && <span className="cart-badge">{totalItemsInCart}</span>}
          </Link>

          {user ? (
            <Link className="icon-button" to="/account" onClick={() => setIsMobileMenuOpen(false)}>
              <UserCircle size={24} />
            </Link>
          ) : (
            <Link className="icon-button" to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <User size={24} />
            </Link>
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
            <NavLink
              key={item.path}
              to={item.path}
              className="mobile-nav-item mobile-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}

          {user ? (
            <>
              <NavLink
                to="/account"
                className="mobile-nav-item mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserCircle size={20} />
                <span>My Account</span>
              </NavLink>
              <button type="button" className="mobile-nav-item logout" onClick={handleLogout}>
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="mobile-nav-item mobile-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User size={20} />
              <span>Login</span>
            </NavLink>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
