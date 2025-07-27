import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, IconButton, Avatar, Button } from '@mui/material';
import Chat from './components/Chat';
import InputBar from './components/InputBar';
import WelcomeCard from './components/WelcomeCard';
import { sendMessage } from './api/chatbot';
import { motion } from 'framer-motion';
import Loader from './components/Loader';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';

function getChatName(messages) {
  // Use the first user message as the chat name, or fallback
  const firstUserMsg = messages.find(m => m.sender === 'user');
  if (firstUserMsg && firstUserMsg.text) {
    return firstUserMsg.text.length > 24
      ? firstUserMsg.text.slice(0, 24) + '...'
      : firstUserMsg.text;
  }
  return 'New Chat';
}

function getDateString() {
  return new Date().toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

const LOCAL_KEY = 'ukchatbot_chats';

export default function App() {
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [user, setUser] = useState(localStorage.getItem('ukchatbot_user_email') || '');

  // Multi-chat state
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) return JSON.parse(saved);
    return [{
      name: 'New Chat',
      date: getDateString(),
      messages: [
        { sender: 'bot', text: 'Good day! How may I assist you today?' }
      ]
    }];
  });
  const [currentChatIdx, setCurrentChatIdx] = useState(0);
  const [loading, setLoading] = useState(false);

  // Loader
  useEffect(() => {
    const timer = setTimeout(() => setLoadingScreen(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  // Persist chats to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(chats));
  }, [chats]);

  const handleLogin = (email) => {
    setUser(email);
    localStorage.setItem('ukchatbot_user_email', email);
  };

  // Send a message in the current chat
  const handleSend = async (text) => {
    if (!text.trim()) return;
    const newChats = [...chats];
    const chat = { ...newChats[currentChatIdx] };
    chat.messages = [...chat.messages, { sender: 'user', text }];
    setChats(chats => {
      const updated = [...chats];
      updated[currentChatIdx] = chat;
      return updated;
    });
    setLoading(true);
    try {
      const res = await sendMessage(text, []);
      chat.messages = [...chat.messages, { sender: 'bot', text: res.response }];
      // Update chat name if it's still 'New Chat'
      if (chat.name === 'New Chat') {
        chat.name = getChatName(chat.messages);
      }
      chat.date = getDateString();
      setChats(chats => {
        const updated = [...chats];
        updated[currentChatIdx] = chat;
        return updated;
      });
    } catch (e) {
      chat.messages = [...chat.messages, { sender: 'bot', text: 'Sorry, there was an error.' }];
      setChats(chats => {
        const updated = [...chats];
        updated[currentChatIdx] = chat;
        return updated;
      });
    }
    setLoading(false);
  };

  // Start a new chat
  const handleNewChat = () => {
    const newChat = {
      name: 'New Chat',
      date: getDateString(),
      messages: [
        { sender: 'bot', text: 'Good day! How may I assist you today?' }
      ]
    };
    setChats([newChat, ...chats]);
    setCurrentChatIdx(0);
  };

  // Select a chat from the sidebar
  const handleSelectChat = (idx) => {
    setCurrentChatIdx(idx);
  };

  // Clear all chat history
  const handleClearHistory = () => {
    setChats([{
      name: 'New Chat',
      date: getDateString(),
      messages: [
        { sender: 'bot', text: 'Good day! How may I assist you today?' }
      ]
    }]);
    setCurrentChatIdx(0);
  };

  if (loadingScreen) return <Loader />;
  if (!user) return <Login onLogin={handleLogin} />;

  const currentChat = chats[currentChatIdx];
  const isNewChat = currentChat.messages.length === 1;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100vw', 
      display: 'flex', 
      background: '#f8f9fa'
    }}>
      {/* Left Sidebar */}
      <Box sx={{
        width: 280,
        bgcolor: '#f1f3f4',
        borderRight: '1px solid #e0e3e8',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant="h5" fontWeight={700} color="#1a1a1a">
            UK Study Buddy
          </Typography>
        </Box>

        {/* New Chat Button */}
        <Box sx={{ px: 3, pb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            fullWidth
            sx={{
              bgcolor: '#2563eb',
              color: 'white',
              borderRadius: 2,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '14px',
              '&:hover': {
                bgcolor: '#1d4ed8'
              }
            }}
            onClick={handleNewChat}
          >
            New chat
          </Button>
        </Box>

        {/* Search Button */}
        <Box sx={{ px: 3, pb: 3 }}>
          <IconButton
            sx={{
              bgcolor: '#1a1a1a',
              color: 'white',
              borderRadius: 1,
              width: 40,
              height: 40,
              '&:hover': {
                bgcolor: '#333'
              }
            }}
          >
            <SearchIcon />
          </IconButton>
        </Box>

        {/* Conversations Section */}
        <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ px: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="#666" fontWeight={500}>
              Your conversations
            </Typography>
            <Typography 
              variant="body2" 
              color="#2563eb" 
              sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              onClick={handleClearHistory}
            >
              Clear All
            </Typography>
          </Box>

          {/* Chat List */}
          <Box sx={{ flex: 1, overflow: 'auto', px: 1 }}>
            {chats.map((chat, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 2,
                  py: 1.5,
                  mx: 1,
                  borderRadius: 1,
                  cursor: 'pointer',
                  bgcolor: idx === currentChatIdx ? '#e3f2fd' : 'transparent',
                  '&:hover': {
                    bgcolor: idx === currentChatIdx ? '#e3f2fd' : '#f5f5f5'
                  }
                }}
                onClick={() => handleSelectChat(idx)}
              >
                <DescriptionIcon sx={{ color: '#666', fontSize: 20, mr: 2 }} />
                <Typography 
                  variant="body2" 
                  color="#1a1a1a"
                  sx={{ 
                    fontWeight: idx === currentChatIdx ? 600 : 400,
                    opacity: idx === 2 ? 0.6 : 1 // Make the third item slightly faded
                  }}
                >
                  {chat.name}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Time Separator */}
          <Box sx={{ px: 3, py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ flex: 1, height: 1, bgcolor: '#e0e3e8' }} />
              <Typography variant="caption" color="#666" sx={{ px: 2 }}>
                Last 7 Days
              </Typography>
              <Box sx={{ flex: 1, height: 1, bgcolor: '#e0e3e8' }} />
            </Box>
          </Box>

          {/* Bottom Section */}
          <Box sx={{ p: 3, pt: 0 }}>
            <Button
              startIcon={<SettingsIcon />}
              sx={{
                color: '#666',
                textTransform: 'none',
                fontWeight: 500,
                mb: 2,
                '&:hover': {
                  bgcolor: '#f5f5f5'
                }
              }}
            >
              Settings
            </Button>
            
            {/* User Profile */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: '#2563eb' }}>
                {user.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="body2" color="#1a1a1a" fontWeight={500}>
                {user.split('@')[0]}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#f8f9fa',
        height: '100vh',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <Box sx={{ p: 3, pb: 2 }}>
          <Typography variant="h5" fontWeight={700} color="#1a1a1a">
            UK Study Buddy
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', px: 4, pb: 4 }}>
          {isNewChat ? (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <WelcomeCard />
            </Box>
          ) : (
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              maxWidth: 800,
              mx: 'auto',
              width: '100%'
            }}>
              <Box sx={{ flex: 1, overflow: 'auto', mb: 3 }}>
                <Chat messages={currentChat.messages} loading={loading} />
              </Box>
              <InputBar onSend={handleSend} loading={loading} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}