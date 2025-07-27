import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Box } from '@mui/material';

function getInitials(email) {
  if (!email) return '';
  const name = email.split('@')[0];
  return name
    .split(/[._-]/)
    .map(part => part[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2);
}

export default function Navbar({ user }) {
  return (
    <AppBar position="static" color="default" elevation={2} sx={{ mb: 2 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
        <Typography variant="h6" fontWeight={700} color="primary">
          Study In UK Chatbot <span style={{ fontWeight: 400, fontSize: '0.8em' }}>1.0</span>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: '#2563eb', color: '#fff', width: 40, height: 40, fontWeight: 700 }}>
            {getInitials(user)}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
} 