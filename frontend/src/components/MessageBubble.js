import React from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import { motion } from 'framer-motion';

export default function MessageBubble({ sender, text }) {
  const isUser = sender === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}
    >
      {!isUser && <Avatar sx={{ bgcolor: '#2563eb', mr: 1 }}>🤖</Avatar>}
      <Paper
        elevation={2}
        sx={{
          p: 1.5,
          px: 2,
          borderRadius: 3,
          bgcolor: isUser ? '#2563eb' : '#f1f3f6',
          color: isUser ? '#fff' : '#23272f',
          maxWidth: 340,
          minWidth: 60,
        }}
      >
        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>{text}</Typography>
      </Paper>
      {isUser && <Avatar sx={{ bgcolor: '#2563eb', ml: 1 }}>🧑</Avatar>}
    </motion.div>
  );
}