import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useNavigate } from 'react-router-dom';

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [active, setActive] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Set end time to 24 hours from now (logika yang sudah Anda buat)
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 24);

    const calculateTimeLeft = () => {
      const difference = endTime.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setActive(false);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!active) return null;

  const handleViewDeals = () => {
    // Navigasi ke rute Flash Deals
    navigate('/flash-deals');
  };

  return (
    <Paper
      sx={{
        p: 3,
        mb: 0,
        borderRadius: 0,
        background: 'linear-gradient(135deg, #ff6b00 0%, #ff385c 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <LocalOfferIcon sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            ⚡ FLASH SALE
          </Typography>
          <Typography variant="body1">
            Limited time offer - Up to 50% OFF!
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <AccessTimeIcon />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          ENDS IN:
        </Typography>
        <Chip
          label={`${timeLeft.hours}H`}
          sx={{ bgcolor: 'white', color: '#ff6b00', fontWeight: 'bold', fontSize: '1rem' }}
        />
        <Chip
          label={`${timeLeft.minutes}M`}
          sx={{ bgcolor: 'white', color: '#ff6b00', fontWeight: 'bold', fontSize: '1rem' }}
        />
        <Chip
          label={`${timeLeft.seconds}S`}
          sx={{ bgcolor: 'white', color: '#ff6b00', fontWeight: 'bold', fontSize: '1rem' }}
        />
      </Box>

      <Button
        variant="contained"
        onClick={handleViewDeals}
        sx={{
          bgcolor: 'white',
          color: '#ff6b00',
          fontWeight: 'bold',
          '&:hover': {
            bgcolor: '#f0f0f0'
          }
        }}
      >
        VIEW DEALS
      </Button>
    </Paper>
  );
};

export default FlashSale;