import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemAvatar, Avatar, Button, Box, Typography, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

function getInitials(email) {
  if (!email) return '';
  const name = email.split('@')[0];
  return name
    .split(/[._-]/)
    .map(part => part[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2);
}

export default function Sidebar({ user, chats, currentChatIdx, onSelectChat, onNewChat, onClearHistory }) {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      PaperProps={{
        sx: { width: 240, bgcolor: '#f7f9fb', borderRight: '1px solid #e0e3e8', pt: 2 }
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ bgcolor: '#2563eb', color: '#fff', width: 48, height: 48, fontWeight: 700, mb: 1 }}>
          {getInitials(user)}
        </Avatar>
        <Typography variant="subtitle2" color="primary" fontWeight={600}>{user}</Typography>
      </Box>
      <Divider />
      <Box sx={{ px: 2, py: 1 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          fullWidth
          sx={{ mb: 1, fontWeight: 600 }}
          onClick={onNewChat}
        >
          New Chat
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          fullWidth
          sx={{ mb: 2 }}
          onClick={onClearHistory}
        >
          Clear History
        </Button>
      </Box>
      <Divider />
      <List>
        {chats.length === 0 && (
          <ListItem>
            <ListItemText primary="No chats yet" />
          </ListItem>
        )}
        {chats.map((chat, idx) => (
          <ListItem
            button
            key={idx}
            selected={idx === currentChatIdx}
            onClick={() => onSelectChat(idx)}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: idx === currentChatIdx ? '#2563eb' : '#e0e3e8', color: idx === currentChatIdx ? '#fff' : '#23272f' }}>
                💬
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={chat.name || `Chat ${idx + 1}`}
              secondary={chat.date}
              primaryTypographyProps={{ fontWeight: idx === currentChatIdx ? 700 : 500 }}
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
} 