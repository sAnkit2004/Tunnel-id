import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Fingerprint } from 'lucide-react';
import './RegistrationPage.css';

const RegistrationPage = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate registration process
    setTimeout(() => {
      setLoading(false);
      alert('Registration successful!');
    }, 2000);
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
        <h2 className="form-title">Register</h2>
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
            <label className="form-label">Biometric Data</label>
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
            {loading ? 'Registering...' : 'Register'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default RegistrationPage;

