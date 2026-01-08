import React from 'react';
import { ShoppingBag, LogIn, Image, Layers, Eye } from 'lucide-react';
import './WelcomePage.css';

// Mock Redux navigation
const setPage = page => ({ type: 'app/setPage', payload: page });
const useDispatch = () => action => console.log(`Navigation: ${action.payload}`);

// --- Feature Card ---
const FeatureCard = ({ Icon, title, description, colorClass }) => (
  <div className={`feature-card ${colorClass}`}>
    <Icon size={36} className="feature-icon" />
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </div>
);

// --- Main Component ---
const WelcomePage = () => {
  const dispatch = useDispatch();
  const handleNavigation = page => dispatch(setPage(page));

  const features = [
    {
      Icon: Layers,
      title: 'High-Quality Set-Piece Images',
      description:
        'Explore a growing library of realistic, professional football set-piece visuals — from defending to attacking situations.',
      colorClass: 'feature-red',
    },
    {
      Icon: Eye,
      title: 'Visual Tactics at a Glance',
      description:
        'Every image captures key positions, player movements, and tactical principles designed for coaches and analysts.',
      colorClass: 'feature-blue',
    },
    {
      Icon: ShoppingBag,
      title: 'Shop and Download Instantly',
      description:
        'Select, preview, and download tactical images directly from our collection — easy access, anytime.',
      colorClass: 'feature-green',
    },
  ];

  return (
    <div className="welcome-root">
      {/* --- Hero Section --- */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Football Set-Piece Image Library</h1>
          <p className="hero-subtitle">
            Discover high-quality tactical images for defending and attacking routines. Perfect for
            coaches, analysts, and football creators.
          </p>
          <div className="hero-buttons">
            <button onClick={() => handleNavigation('shop')} className="btn-primary">
              <Image size={20} className="btn-icon" />
              Explore Products
            </button>
            <button onClick={() => handleNavigation('login')} className="btn-secondary">
              <LogIn size={20} className="btn-icon" />
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* --- Features --- */}
      <section className="features-section">
        <h2 className="features-title">Why Coaches Use Our Image Library</h2>
        <div className="features-grid">
          {features.map(feature => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="cta-section">
        <h2 className="cta-title">Start Building Your Tactical Gallery Today</h2>
        <button onClick={() => handleNavigation('shop')} className="btn-cta">
          Browse Set-Piece Images
        </button>
      </section>
    </div>
  );
};

export default WelcomePage;
