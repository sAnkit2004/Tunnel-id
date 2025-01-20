import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, AlertCircle } from 'lucide-react';
import './RegistrationPage.css';

const RegistrationPage = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [publicKey, setPublicKey] = useState('');

  const handleBiometricRegistration = async () => {
    try {
      setError(null);
      setLoading(true);

      // In a real implementation, this would capture actual biometric data
      const mockBiometricData = 'mock-biometric-data';
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          biometricData: mockBiometricData,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      if (data.success && data.data) {
        setPublicKey(data.data.publicKey);
        alert('Registration successful!');
        // Optionally redirect to login page
        // window.location.href = '/login';
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err.message);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    await handleBiometricRegistration();
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
        {error && (
          <div className="error-container">
            <AlertCircle className="error-icon" />
            <p className="error-message">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input 
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              className={`form-input ${error && !username ? 'input-error' : ''}`}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Biometric Registration</label>
            <motion.div 
              className={`biometric-placeholder ${loading ? 'loading' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => !loading && handleBiometricRegistration()}
            >
              <Fingerprint size={64} className="biometric-icon" />
              <p className="biometric-text">
                {loading ? 'Processing...' : 'Click to scan fingerprint'}
              </p>
            </motion.div>
          </div>
          {publicKey && (
            <div className="success-container">
              <p className="success-message">Registration successful!</p>
              <p className="public-key">
                Public Key: {publicKey.slice(0, 8)}...{publicKey.slice(-8)}
              </p>
            </div>
          )}
          <motion.button 
            type="submit" 
            className="submit-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Complete Registration'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default RegistrationPage;

