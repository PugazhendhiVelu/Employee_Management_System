import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Background = styled(Box)({
  height: '100vh',
  background: 'linear-gradient(to right, #4facfe, #00f2fe)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const LoginCard = styled(Card)({
  maxWidth: 400,
  width: '100%',
  padding: '20px',
  textAlign: 'center',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
});

const LoginTitle = styled(Typography)({
  marginBottom: '20px',
  fontWeight: 'bold',
  color: '#333',
});

const SubmitButton = styled(Button)({
  marginTop: '20px',
  backgroundColor: '#4caf50',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#45a049',
  },
});

export default function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const requestOtp = async () => {
    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/request-otp', { email }, { withCredentials: true });
      setOtpSent(true);
      alert('OTP has been sent to your email.');
    } catch (error) {
      console.error('Error requesting OTP:', error);
      alert('Error requesting OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/login', { email, otp }, { withCredentials: true });
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (otpSent) {
        handleLogin();
      } else {
        requestOtp();
      }
    }
  };

  return (
    <Background>
      <LoginCard>
        <CardContent>
          <LockOutlinedIcon sx={{ fontSize: 40, color: '#4caf50' }} />
          <LoginTitle variant="h5">Sign In</LoginTitle>
          {!otpSent ? (
            <>
              <Typography variant="body2" color="textSecondary" paragraph>
                Please enter your email to receive an OTP.
              </Typography>
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <SubmitButton
                variant="contained"
                fullWidth
                onClick={requestOtp}
                disabled={loading || !email}
              >
                {loading ? <CircularProgress size={24} /> : 'Request OTP'}
              </SubmitButton>
            </>
          ) : (
            <>
              <Typography variant="body2" color="textSecondary" paragraph>
                Please enter the OTP sent to your email.
              </Typography>
              <TextField
                label="OTP"
                fullWidth
                margin="normal"
                variant="outlined"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
              <SubmitButton
                variant="contained"
                fullWidth
                onClick={handleLogin}
                disabled={loading || !otp}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </SubmitButton>
            </>
          )}
        </CardContent>
      </LoginCard>
    </Background>
  );
}
