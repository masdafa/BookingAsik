import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  TextField
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import HotelCard from '../components/HotelCard';
import api from '../api/axios';
import SmartSearch from '../features/SmartSearch';

const SearchResults = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';
  const initialCity = searchParams.get('city') || '';

  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [sortBy, setSortBy] = useState('popular');
  const [amenities, setAmenities] = useState([]);

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, priceRange, sortBy, amenities, hotels]);

  const fetchHotels = async () => {
    try {
      const response = await api.get('/hotels');
      setHotels(response.data);
      setFilteredHotels(response.data);

      const maxPrice = Math.max(...response.data.map(h => h.price || 0), 10000000);
      setPriceRange([0, maxPrice]);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...hotels];

    // Search filter
    if (searchQuery) {
      result = result.filter(hotel =>
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    result = result.filter(hotel => {
      const price = hotel.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Amenities filter
    if (amenities.length > 0) {
      result = result.filter(hotel =>
        amenities.every(amenity => hotel.amenities?.includes(amenity))
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }

    setFilteredHotels(result);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const allAmenities = [
    'Free WiFi', 'Swimming Pool', 'Spa', 'Gym', 'Restaurant',
    'Room Service', 'Parking', 'Airport Shuttle', 'Breakfast'
  ];

  return (
    <>
      <Navbar />
      <Container sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            {t('search_results_title')}
          </Typography>

          <Paper sx={{ p: 3, mb: 3 }}>
            <SmartSearch
              onSearch={(option) => setSearchQuery(option.label)}
              hotels={hotels}
            />
          </Paper>
        </Box>

        <Grid container spacing={3}>
          {/* Filters Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                {t('filters_title')}
              </Typography>

              {/* Price Range */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  {t('price_range_label')}: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={(e, newValue) => setPriceRange(newValue)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => formatCurrency(value)}
                  min={0}
                  max={Math.max(...hotels.map(h => h.price || 0), 10000000)}
                  sx={{ color: "#1976d2" }}
                />
              </Box>

              {/* Amenities */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  {t('amenities_label')}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {allAmenities.map(amenity => (
                    <Chip
                      key={amenity}
                      label={amenity}
                      size="small"
                      onClick={() => {
                        if (amenities.includes(amenity)) {
                          setAmenities(prev => prev.filter(a => a !== amenity));
                        } else {
                          setAmenities(prev => [...prev, amenity]);
                        }
                      }}
                      color={amenities.includes(amenity) ? 'primary' : 'default'}
                      variant={amenities.includes(amenity) ? 'filled' : 'outlined'}
                      sx={{ mb: 0.5 }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Sort By */}
              <FormControl fullWidth>
                <InputLabel>{t('sort_by_label')}</InputLabel>
                <Select
                  value={sortBy}
                  label={t('sort_by_label')}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="popular">{t('sort_popular')}</MenuItem>
                  <MenuItem value="price-low">{t('sort_price_low')}</MenuItem>
                  <MenuItem value="price-high">{t('sort_price_high')}</MenuItem>
                  <MenuItem value="rating">{t('sort_rating')}</MenuItem>
                  <MenuItem value="name">{t('sort_name')}</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>

          {/* Results */}
          <Grid item xs={12} md={9}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">
                {t('hotels_found', { count: filteredHotels.length })}
              </Typography>
            </Box>

            {loading ? (
              <Typography>{t('loading')}</Typography>
            ) : filteredHotels.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  {t('no_hotels_found')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {t('try_adjusting_filters')}
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {filteredHotels.map(hotel => (
                  <Grid item xs={12} sm={6} key={hotel.id}>
                    <HotelCard hotel={hotel} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default SearchResults;
