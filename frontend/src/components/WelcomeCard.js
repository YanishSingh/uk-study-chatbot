import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import PublicIcon from '@mui/icons-material/Public';
import BoltIcon from '@mui/icons-material/Bolt';
import WarningIcon from '@mui/icons-material/Warning';
import SendIcon from '@mui/icons-material/Send';
import PsychologyIcon from '@mui/icons-material/Psychology';

export default function WelcomeCard() {
  const featureCards = [
    // Left Column - Black Cards
    {
      title: "Explore",
      description: "Learn how to use UK Study Buddy platform for your needs",
      icon: <PublicIcon sx={{ fontSize: 24 }} />,
      color: "#1a1a1a",
      textColor: "white"
    },
    {
      title: "Capabilities",
      description: "How much capable UK Study Buddy to full-fill your needs",
      icon: <BoltIcon sx={{ fontSize: 24 }} />,
      color: "#1a1a1a",
      textColor: "white"
    },
    {
      title: "Limitation",
      description: "How much capable UK Study Buddy to full-fill your needs",
      icon: <WarningIcon sx={{ fontSize: 24 }} />,
      color: "#1a1a1a",
      textColor: "white"
    },
    // Middle Column - White Cards
    {
      title: "Explain",
      description: "UK university requirements in simple terms",
      icon: <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#e91e63' }} />,
      color: "white",
      textColor: "#1a1a1a"
    },
    {
      title: "Remember",
      description: "UK university requirements in simple terms",
      icon: <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#ff9800' }} />,
      color: "white",
      textColor: "#1a1a1a"
    },
    {
      title: "May",
      description: "Occasionally generate incorrect information",
      icon: <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#f44336', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 'bold' }}>×</Box>,
      color: "white",
      textColor: "#1a1a1a"
    },
    // Right Column - White Cards
    {
      title: "How to",
      description: "Apply to UK universities step by step",
      icon: <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#2196f3' }} />,
      color: "white",
      textColor: "#1a1a1a"
    },
    {
      title: "Allows",
      description: "User to provide follow-up corrections",
      icon: <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#ff5722' }} />,
      color: "white",
      textColor: "#1a1a1a"
    },
    {
      title: "Limited",
      description: "Knowledge of world and events after 2021",
      icon: <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#03a9f4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 'bold' }}>A</Box>,
      color: "white",
      textColor: "#1a1a1a"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ width: '100%', maxWidth: 900 }}
    >
      {/* Greeting */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h3" 
          fontWeight={600} 
          color="#1a1a1a"
          sx={{ mb: 2, fontSize: { xs: '2rem', md: '2.5rem' } }}
        >
          Good day! How may I assist you today?
        </Typography>
      </Box>

      {/* Feature Cards Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        gap: 3,
        maxWidth: 800,
        mx: 'auto'
      }}>
        {/* Left Column - Black Cards */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {featureCards.slice(0, 3).map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  bgcolor: card.color,
                  color: card.textColor,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {card.icon}
                  <Typography variant="h6" fontWeight={600} sx={{ ml: 2 }}>
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {card.description}
                </Typography>
              </Paper>
            </motion.div>
          ))}
        </Box>

        {/* Middle Column - White Cards with Connection Lines */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, position: 'relative' }}>
          {/* Connection Lines */}
          <Box sx={{
            position: 'absolute',
            left: -12,
            top: 0,
            bottom: 0,
            width: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            zIndex: 0
          }}>
            <Box sx={{ height: 1, bgcolor: '#e0e3e8' }} />
            <Box sx={{ height: 1, bgcolor: '#e0e3e8' }} />
            <Box sx={{ height: 1, bgcolor: '#e0e3e8' }} />
          </Box>

          {featureCards.slice(3, 6).map((card, index) => (
            <motion.div
              key={index + 3}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (index + 3) * 0.1 }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  bgcolor: card.color,
                  color: card.textColor,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative',
                  zIndex: 1,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {card.icon}
                  <Typography variant="h6" fontWeight={600} sx={{ ml: 2 }}>
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {card.description}
                </Typography>
              </Paper>
            </motion.div>
          ))}
        </Box>

        {/* Right Column - White Cards with Arrows */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, position: 'relative' }}>
          {/* Arrow Connections */}
          <Box sx={{
            position: 'absolute',
            left: -12,
            top: 0,
            bottom: 0,
            width: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            zIndex: 0
          }}>
            <SendIcon sx={{ color: '#e0e3e8', transform: 'rotate(0deg)' }} />
            <SendIcon sx={{ color: '#e0e3e8', transform: 'rotate(0deg)' }} />
            <SendIcon sx={{ color: '#e0e3e8', transform: 'rotate(0deg)' }} />
          </Box>

          {featureCards.slice(6, 9).map((card, index) => (
            <motion.div
              key={index + 6}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: (index + 6) * 0.1 }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  bgcolor: card.color,
                  color: card.textColor,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  position: 'relative',
                  zIndex: 1,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {card.icon}
                  <Typography variant="h6" fontWeight={600} sx={{ ml: 2 }}>
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {card.description}
                </Typography>
              </Paper>
            </motion.div>
          ))}
        </Box>
      </Box>
    </motion.div>
  );
}