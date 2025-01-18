import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">Tunnel ID</Link>
        <nav>
          <ul className="nav-list">
            {['Home', 'About', 'Contact', 'Login', 'Register'].map((item) => (
              <li key={item} className="nav-item">
                <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="nav-link">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

