import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, AlertCircle } from 'lucide-react';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBiometricLogin = async () => {
    try {
      setError(null);
      setLoading(true);

      // Mock biometric data for testing
      const mockBiometricData = 'mock-biometric-data';

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          biometricData: mockBiometricData,
        }),
      });

      // Check if the response is OK
      if (!response.ok) {
        let errorMessage = `Login failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response body is not JSON, fallback to default error message
        }
        throw new Error(errorMessage);
      }

      // Parse JSON only if the response body exists
      const data = await response.json();

      if (data.success && data.token) {
        // Store token and notify user
        localStorage.setItem('authToken', data.token);
        alert('Login successful!');
        // Redirect to dashboard or home page
        // window.location.href = '/dashboard';
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
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
    await handleBiometricLogin();
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
            <label className="form-label">Biometric Authentication</label>
            <motion.div 
              className={`biometric-placeholder ${loading ? 'loading' : ''}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => !loading && handleBiometricLogin()}
            >
              <Fingerprint size={64} className="biometric-icon" />
              <p className="biometric-text">
                {loading ? 'Authenticating...' : 'Click to scan fingerprint'}
              </p>
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
      </motion.div>
    </div>
  );
};

export default LoginPage;
