import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  Typography,
  LinearProgress,
  Alert,
  AlertTitle
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import WarningIcon from '@mui/icons-material/Warning';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

const RealTimeAvailability = ({ hotelId, checkIn, checkOut }) => {
  const { t } = useTranslation();
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (hotelId && checkIn && checkOut) {
      checkAvailability();

      // Auto-refresh every 30 seconds
      const interval = setInterval(checkAvailability, 30000);
      return () => clearInterval(interval);
    }
  }, [hotelId, checkIn, checkOut]);

  const checkAvailability = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/hotels/${hotelId}/availability`, {
        params: {
          checkIn: new Date(checkIn).toISOString(),
          checkOut: new Date(checkOut).toISOString()
        }
      });

      setAvailability(response.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !availability) {
    return (
      <Box sx={{ mb: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (!availability) {
    return null;
  }

  const getAvailabilityMessage = () => {
    if (availability.rooms === 0) {
      return {
        type: 'error',
        icon: <WarningIcon />,
        title: t('no_rooms_available'),
        message: t('no_rooms_available') // Simplified message usage
      };
    } else if (availability.rooms <= 3) {
      return {
        type: 'warning',
        icon: <AccessTimeIcon />,
        title: t('limited_availability'),
        message: `${t('only')} ${availability.rooms} ${t('rooms_left')}`
      };
    } else {
      return {
        type: 'success',
        icon: <CheckIcon />,
        title: t('rooms_available'),
        message: `${availability.rooms} ${t('rooms_available')}`
      };
    }
  };

  const availabilityInfo = getAvailabilityMessage();

  return (
    <Box sx={{ mb: 3 }}>
      <Alert
        severity={availabilityInfo.type}
        icon={availabilityInfo.icon}
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: `${availabilityInfo.type}.main`
        }}
      >
        <AlertTitle>{availabilityInfo.title}</AlertTitle>
        {availabilityInfo.message}
        {lastUpdated && (
          <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
            {t('last_updated')} {lastUpdated.toLocaleTimeString()}
          </Typography>
        )}
      </Alert>

      {/* Room types availability */}
      {availability.roomTypes && availability.roomTypes.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {t('room_types_availability')}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {availability.roomTypes.map((roomType, index) => (
              <Chip
                key={index}
                label={`${roomType.name}: ${roomType.available} ${t('left')}`}
                size="small"
                color={roomType.available > 0 ? 'success' : 'error'}
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RealTimeAvailability;
