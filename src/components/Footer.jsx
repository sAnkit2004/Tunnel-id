import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="copyright">&copy; 2023 Tunnel ID. All rights reserved.</p>
        <div className="social-links">
          <a href="#" className="social-link">Email</a>
          <a href="#" className="social-link">Twitter</a>
          <a href="#" className="social-link">Facebook</a>
          <a href="#" className="social-link">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

