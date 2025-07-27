import React, { useState } from 'react';
import { Box, TextField, IconButton, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function InputBar({ onSend, loading }) {
  const [value, setValue] = useState('');
  const handleSend = () => {
    if (value.trim()) {
      onSend(value);
      setValue('');
    }
  };
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#fff', borderRadius: 3, boxShadow: 2, p: 1 }}>
      <TextField
        fullWidth
        variant="standard"
        placeholder="Type your message and press Enter..."
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
        InputProps={{ disableUnderline: true, sx: { fontSize: '1.1em', px: 1 } }}
      />
      <IconButton color="primary" onClick={handleSend} disabled={loading} sx={{ ml: 1 }}>
        {loading ? <CircularProgress size={24} /> : <SendIcon />}
      </IconButton>
    </Box>
  );
}