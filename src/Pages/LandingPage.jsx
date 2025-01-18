import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Key, Fingerprint } from 'lucide-react';
import './LandingPage.css';

const FeatureCard = ({ icon, title, description }) => (
  <motion.div 
    className="feature-card"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <div className="feature-icon">{icon}</div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="animated-bg"></div>
      <section className="hero">
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Revolutionize Your Identity with Tunnel ID
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Secure, decentralized, and seamless identity management
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link to="/register" className="cta-button glow-effect">Get Started</Link>
          </motion.div>
        </div>
      </section>

      <section className="features">
        <h2 className="features-title">Key Features</h2>
        <div className="features-grid">
          <FeatureCard 
            icon={<Fingerprint size={48} />}
            title="Biometric-based Private Key Generation"
            description="Generate secure private keys using your unique biometric data."
          />
          <FeatureCard 
            icon={<Key size={48} />}
            title="MetaMask Wallet Integration"
            description="Seamlessly integrate with MetaMask for enhanced blockchain interactions."
          />
          <FeatureCard 
            icon={<Shield size={48} />}
            title="Decentralized Identity Proof"
            description="Prove your identity securely without relying on centralized authorities."
          />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

