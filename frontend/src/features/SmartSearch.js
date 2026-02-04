import React, { useState, useEffect } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  Chip,
  Avatar,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HotelIcon from '@mui/icons-material/Hotel';
import SearchIcon from '@mui/icons-material/Search';
import api from '../api/axios';

const SmartSearch = ({ onSearch, hotels = [] }) => {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  // Generate search options
  useEffect(() => {
    const generateOptions = () => {
      const uniqueCities = [...new Set(hotels.map(hotel => hotel.city))];
      const searchOptions = [
        ...uniqueCities.map(city => ({
          type: 'city',
          label: city,
          icon: <LocationOnIcon fontSize="small" />
        })),
        ...hotels.slice(0, 10).map(hotel => ({
          type: 'hotel',
          label: `${hotel.name}, ${hotel.city}`,
          icon: <HotelIcon fontSize="small" />,
          hotel: hotel
        }))
      ];
      setOptions(searchOptions);
    };

    if (hotels.length > 0) {
      generateOptions();
    }
  }, [hotels]);

  const handleSearch = (value) => {
    if (value) {
      const selectedOption = options.find(opt => opt.label === value);
      if (selectedOption) {
        onSearch(selectedOption);
      } else {
        // Free text search
        onSearch({ type: 'text', label: value });
      }
    }
  };

  return (
    <Autocomplete
      freeSolo
      options={options.map(option => option.label)}
      loading={loading}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(event, value) => handleSearch(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search hotels or destinations..."
          variant="outlined"
          fullWidth
          className="search-input"
          InputProps={{
            ...params.InputProps,
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
      )}
      renderOption={(props, option) => {
        const selectedOption = options.find(opt => opt.label === option);
        return (
          <ListItem {...props} sx={{ py: 1 }}>
            <ListItemAvatar>
              <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>
                {selectedOption?.icon}
              </Avatar>
            </ListItemAvatar>
            <ListItemText 
              primary={option}
              secondary={selectedOption?.type === 'hotel' ? selectedOption.hotel.city : ''}
            />
            <Chip 
              label={selectedOption?.type === 'city' ? 'City' : 'Hotel'} 
              size="small" 
              variant="outlined"
              sx={{ ml: 1 }}
            />
          </ListItem>
        );
      }}
    />
  );
};

export default SmartSearch;
