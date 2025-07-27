import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Chat from './components/Chat';
import InputBar from './components/InputBar';
import WelcomeCard from './components/WelcomeCard';
import { sendMessage } from './api/chatbot';
import { motion } from 'framer-motion';
import Loader from './components/Loader';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

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
        { sender: 'bot', text: 'Welcome to the UK Study Chatbot! Ask me anything about UK universities, requirements, or student life.' }
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
        { sender: 'bot', text: 'Welcome to the UK Study Chatbot! Ask me anything about UK universities, requirements, or student life.' }
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
        { sender: 'bot', text: 'Welcome to the UK Study Chatbot! Ask me anything about UK universities, requirements, or student life.' }
      ]
    }]);
    setCurrentChatIdx(0);
  };

  if (loadingScreen) return <Loader />;
  if (!user) return <Login onLogin={handleLogin} />;

  const currentChat = chats[currentChatIdx];

  return (
    <Box sx={{ minHeight: '100vh', width: '100vw', display: 'flex', background: 'linear-gradient(135deg, #f7f9fb 60%, #e3eafc 100%)' }}>
      <Sidebar
        user={user}
        chats={chats}
        currentChatIdx={currentChatIdx}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onClearHistory={handleClearHistory}
      />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', minHeight: '100vh' }}>
        <Navbar user={user} />
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ width: '100%', maxWidth: 600 }}
        >
          <Paper elevation={3} sx={{ p: 3, mb: 2, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h4" color="primary" fontWeight={700}>UK Study Conversational Chatbot <span role="img" aria-label="UK">🇬🇧</span></Typography>
            <Typography variant="subtitle1" color="text.secondary">Ask me about universities, requirements, or student life in the UK!</Typography>
          </Paper>
        </motion.div>
        <Box
          sx={{
            width: '100%',
            maxWidth: 420,
            height: { xs: '80vh', sm: 600 },
            minHeight: 400,
            bgcolor: '#fff',
            borderRadius: 4,
            boxShadow: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'stretch',
            position: 'relative',
            p: 0,
            mt: 2,
          }}
        >
          {/* Chat area or welcome card */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2, pb: 0 }}>
            {currentChat.messages.length === 1 ? <WelcomeCard /> : <Chat messages={currentChat.messages} loading={loading} />}
          </Box>
          {/* Input bar pinned to bottom of chat container */}
          <Box sx={{ p: 2, pt: 0, bgcolor: 'transparent' }}>
            <InputBar onSend={handleSend} loading={loading} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}