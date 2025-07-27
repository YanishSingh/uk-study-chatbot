import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';
import { motion } from 'framer-motion';

function validateEmail(email) {
  return /^[^@]+@[^@]+\.[^@]+$/.test(email);
}
function validatePassword(password) {
  return password.length >= 6;
}

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login'); // or 'signup'
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [awaitingOtp, setAwaitingOtp] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (mode === 'signup') {
      // Generate OTP and show OTP input
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(otpCode);
      setAwaitingOtp(true);
    } else {
      const user = JSON.parse(localStorage.getItem('ukchatbot_user') || '{}');
      if (user.email === email && user.password === password) {
        onLogin(email);
      } else {
        setError('Invalid email or password.');
      }
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      localStorage.setItem('ukchatbot_user', JSON.stringify({ email, password }));
      onLogin(email);
    } else {
      setError('Invalid OTP. Please check and try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}
    >
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, textAlign: 'center', mt: 4 }}>
        <Box sx={{ mb: 1 }}>
          <img src="/uk-flag.png" alt="UK Flag" style={{ width: 48, height: 48 }} />
        </Box>
        <Typography variant="h5" fontWeight={700} color="primary" mb={2}>
          {mode === 'login' ? 'Login to UK Study Chatbot' : 'Create Your Account'}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* OTP Step */}
        {mode === 'signup' && awaitingOtp ? (
          <>
            <Alert severity="info" sx={{ mb: 2 }}>
              For demo: Your OTP is <b>{generatedOtp}</b>
            </Alert>
            <form onSubmit={handleOtpSubmit}>
              <TextField
                label="Enter OTP"
                type="text"
                fullWidth
                value={otp}
                onChange={e => setOtp(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ py: 1.2, fontWeight: 600, fontSize: '1.1em', mb: 1 }}
              >
                Verify OTP
              </Button>
            </form>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={e => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={e => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 1.2, fontWeight: 600, fontSize: '1.1em', mb: 1 }}
            >
              {mode === 'login' ? 'Login' : 'Sign Up'}
            </Button>
          </form>
        )}

        <Button
          color="secondary"
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setError('');
            setAwaitingOtp(false);
            setOtp('');
          }}
          sx={{ mt: 1, textTransform: 'none' }}
        >
          {mode === 'login'
            ? "Don't have an account? Sign up"
            : "Already have an account? Log in"}
        </Button>
      </Paper>
    </motion.div>
  );
}