import React from 'react';
import { Shield, CornerDownLeft, Goal, ArrowRightCircle, Crosshair, Zap } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ selectedCategory, onSelectCategory }) => {
  const categories = [
    { name: 'Defending Throw-Ins', icon: <Shield size={18} /> },
    { name: 'Defending Free-Kicks', icon: <Crosshair size={18} /> },
    { name: 'Defending Corners', icon: <Goal size={18} /> },
    { name: 'Attacking Throw-Ins', icon: <ArrowRightCircle size={18} /> },
    { name: 'Attacking Free-Kicks', icon: <Zap size={18} /> },
    { name: 'Attacking Corners', icon: <CornerDownLeft size={18} /> },
  ];

  return (
    <aside className="sidebar dark">
      <h3 className="sidebar-title">Categories</h3>
      <ul className="sidebar-list">
        {categories.map(category => (
          <li
            key={category.name}
            className={`sidebar-item ${selectedCategory === category.name ? 'active' : ''}`}
            onClick={() => onSelectCategory(category.name)}
          >
            <span className="icon">{category.icon}</span>
            <span>{category.name}</span>
          </li>
        ))}

        {/* ✅ Show All gomb */}
        <li
          className={`sidebar-item show-all ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => onSelectCategory(null)}
        >
          <span>Show All</span>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
