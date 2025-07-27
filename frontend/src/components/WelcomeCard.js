import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export default function WelcomeCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 32 }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ fontSize: 60, marginBottom: 8 }}
      >
        🤖
      </motion.div>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, maxWidth: 400, textAlign: 'center' }}>
        <Typography variant="h6" fontWeight={600} mb={1}>Welcome to the UK Study Chatbot!</Typography>
        <Typography variant="body1" color="text.secondary">
          Ask me anything about UK universities, requirements, or student life. Type your question below to get started!
        </Typography>
      </Paper>
    </motion.div>
  );
}