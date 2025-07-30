import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const NotificationContext = createContext();

// Export the context itself
export { NotificationContext };

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    // Configure Socket.IO with better error handling and reconnection logic
    const socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'], // Allow fallback to polling
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });
    
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      setSocketConnected(true);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      setSocketConnected(false);
    });
    
    socket.on('newNotification', (notification) => {
      if (notification) {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    });

    // Fetch existing notifications on mount
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/notifications');
        if (response.data && response.data.data) {
          setNotifications(response.data.data);
          setUnreadCount(response.data.data.filter(notif => !notif.isRead).length);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      markAsRead,
      socketConnected 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext); 