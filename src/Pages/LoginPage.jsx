import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, Wallet } from 'lucide-react';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login process
    setTimeout(() => {
      setLoading(false);
      alert('Login successful!');
    }, 2000);
  };

  const connectMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        alert('Connected to MetaMask!');
      } catch (error) {
        console.error('Failed to connect to MetaMask:', error);
        alert('Failed to connect to MetaMask. Please try again.');
      }
    } else {
      alert('MetaMask is not installed. Please install it to use this feature.');
    }
  };

  return (
    <div className="auth-page">
      <div className="animated-bg"></div>
      <motion.div 
        className="auth-form-container"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="form-title">Login</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input 
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Biometric Authentication</label>
            <motion.div 
              className="biometric-placeholder"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Fingerprint size={64} className="biometric-icon" />
            </motion.div>
          </div>
          <motion.button 
            type="submit" 
            className="submit-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>
        <div className="metamask-section">
          <p className="metamask-text">Or connect with MetaMask:</p>
          <motion.button 
            className="metamask-button"
            onClick={connectMetaMask}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Wallet size={24} className="metamask-icon" />
            Connect MetaMask
          </motion.button>
          {walletAddress && (
            <p className="wallet-address">Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

