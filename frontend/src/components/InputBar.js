import React, { useState } from 'react';
import { Box, TextField, IconButton, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import PsychologyIcon from '@mui/icons-material/Psychology';

export default function InputBar({ onSend, loading }) {
  const [value, setValue] = useState('');
  
  const handleSend = () => {
    if (value.trim()) {
      onSend(value);
      setValue('');
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      bgcolor: '#fff', 
      borderRadius: 3, 
      boxShadow: 2, 
      p: 2,
      border: '1px solid #e0e3e8'
    }}>
      {/* Brain Icon */}
      <PsychologyIcon sx={{ color: '#e91e63', fontSize: 20, mr: 2 }} />
      
      {/* Input Field */}
      <TextField
        fullWidth
        variant="standard"
        placeholder="What's in your mind?..."
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
        InputProps={{ 
          disableUnderline: true, 
          sx: { 
            fontSize: '1rem', 
            px: 1,
            color: '#1a1a1a',
            '&::placeholder': {
              color: '#666',
              opacity: 1
            }
          } 
        }}
      />
      
      {/* Send Button */}
      <IconButton 
        onClick={handleSend} 
        disabled={loading} 
        sx={{ 
          ml: 1,
          bgcolor: '#9c27b0',
          color: 'white',
          width: 40,
          height: 40,
          '&:hover': {
            bgcolor: '#7b1fa2'
          },
          '&:disabled': {
            bgcolor: '#e0e3e8',
            color: '#666'
          }
        }}
      >
        {loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
      </IconButton>
    </Box>
  );
}