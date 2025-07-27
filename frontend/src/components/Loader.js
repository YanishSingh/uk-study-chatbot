import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e3eafc 60%, #fff 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 2000,
      }}
    >
      {/* Animated UK flag PNG */}
      <motion.img
        src="/uk-flag.png"
        alt="UK Flag"
        style={{ width: 80, height: 80, marginBottom: 16 }}
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
      />
      <Typography variant="h5" color="primary" fontWeight={700} sx={{ mb: 1 }}>
        UK Study Chatbot
      </Typography>
      <motion.div
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        style={{ fontSize: 28, color: '#2563eb', letterSpacing: 8 }}
      >
        • • •
      </motion.div>
    </Box>
  );
}
