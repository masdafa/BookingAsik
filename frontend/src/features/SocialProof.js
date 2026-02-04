import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  AlertTitle,
  Typography,
  Avatar,
  Chip
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import HotelIcon from '@mui/icons-material/Hotel';
import PersonIcon from '@mui/icons-material/Person';

const SocialProof = ({ hotels = [] }) => {
  const [recentBookings, setRecentBookings] = useState([]);
  const [active, setActive] = useState(true);

  // Generate fake recent bookings
  useEffect(() => {
    if (!active || hotels.length === 0) return;

    const generateBooking = () => {
      const users = [
        'Sarah Johnson', 'Michael Chen', 'Emma Wilson', 'David Kim',
        'Lisa Anderson', 'James Brown', 'Maria Garcia', 'Robert Taylor'
      ];
      
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomHotel = hotels[Math.floor(Math.random() * hotels.length)];
      
      return {
        id: Date.now() + Math.random(),
        user: randomUser,
        hotel: randomHotel.name,
        city: randomHotel.city,
        time: new Date()
      };
    };

    // Show initial bookings
    const initialBookings = Array.from({ length: 3 }, () => generateBooking());
    setRecentBookings(initialBookings);

    // Add new bookings every 15 seconds
    const interval = setInterval(() => {
      setRecentBookings(prev => {
        const newBooking = generateBooking();
        return [newBooking, ...prev.slice(0, 4)]; // Keep only last 5
      });
    }, 15000);

    return () => {
      clearInterval(interval);
      setActive(false);
    };
  }, [hotels]);

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  if (recentBookings.length === 0) return null;

  return (
    <Box className="social-proof" sx={{ mb: 3 }}>
      {recentBookings.map((booking) => (
        <Alert
          key={booking.id}
          severity="success"
          icon={<CheckIcon fontSize="inherit" />}
          sx={{ 
            mb: 1,
            borderRadius: 2,
            animation: 'fadeIn 0.5s ease-in'
          }}
        >
          <AlertTitle sx={{ margin: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 24, height: 24, bgcolor: 'success.main' }}>
                <PersonIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {booking.user}
              </Typography>
              <Chip 
                label="Just Booked!" 
                size="small" 
                color="success" 
                sx={{ ml: 1 }}
              />
            </Box>
          </AlertTitle>
          <Typography variant="body2">
            Booked <strong>{booking.hotel}</strong> in {booking.city}
            <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
              {formatTimeAgo(booking.time)}
            </Typography>
          </Typography>
        </Alert>
      ))}
    </Box>
  );
};

export default SocialProof;
