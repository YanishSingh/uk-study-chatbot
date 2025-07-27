import React, { useEffect, useRef } from 'react';
import { Box, Avatar } from '@mui/material';
import MessageBubble from './MessageBubble';
import { motion } from 'framer-motion';

export default function Chat({ messages, loading }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minHeight: 300 }}>
      {messages.map((msg, i) => (
        <MessageBubble key={i} sender={msg.sender} text={msg.text} />
      ))}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}
        >
          <Avatar sx={{ bgcolor: '#2563eb', mr: 1 }}>🤖</Avatar>
          <Box sx={{ bgcolor: '#f1f3f6', borderRadius: 3, px: 2, py: 1 }}>
            <motion.span
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1 }}
              style={{ fontSize: 24 }}
            >...</motion.span>
          </Box>
        </motion.div>
      )}
      <div ref={endRef} />
    </Box>
  );
}