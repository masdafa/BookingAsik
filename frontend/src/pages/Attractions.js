import React, { useEffect, useState } from 'react';
import {
    Container, Box, Typography, Grid, TextField, Chip, Stack,
    FormControl, InputLabel, Select, MenuItem, Paper, InputAdornment
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';
import ExploreIcon from '@mui/icons-material/Explore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AttractionCard from '../components/AttractionCard';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import api from '../api/axios';

const cities = ['All', 'Bali', 'Yogyakarta', 'Jakarta', 'Bandung', 'Lombok'];
const categories = ['all', 'temple', 'nature', 'heritage', 'culture', 'landmark', 'theme_park', 'beach', 'adventure'];

export default function Attractions() {
    const { t } = useTranslation();
    const [attractions, setAttractions] = useState([]);
    const [filteredAttractions, setFilteredAttractions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('popular');

    useEffect(() => {
        const fetchAttractions = async () => {
            try {
                const res = await api.get('/attractions');
                setAttractions(res.data);
                setFilteredAttractions(res.data);
            } catch (err) {
                console.error('Error fetching attractions:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAttractions();
    }, []);

    useEffect(() => {
        let result = [...attractions];

        // Filter by search query
        if (searchQuery) {
            result = result.filter(a =>
                a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by city
        if (selectedCity !== 'All') {
            result = result.filter(a => a.city === selectedCity);
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            result = result.filter(a => a.category === selectedCategory);
        }

        // Sort
        switch (sortBy) {
            case 'price_low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price_high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default: // popular - by rating
                result.sort((a, b) => b.rating - a.rating);
        }

        setFilteredAttractions(result);
    }, [attractions, searchQuery, selectedCity, selectedCategory, sortBy]);

    const getCategoryLabel = (category) => {
        if (category === 'all') return t('filter_all');
        return t(`attraction_category_${category}`);
    };

    return (
        <>
            <Navbar />

            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    py: { xs: 6, md: 10 },
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Animated background shapes */}
                <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [0, -20, 0],
                                x: [0, 10, 0],
                                rotate: [0, 180, 360],
                            }}
                            transition={{
                                duration: 10 + i * 2,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                            style={{
                                position: 'absolute',
                                width: 100 + i * 50,
                                height: 100 + i * 50,
                                borderRadius: '50%',
                                background: `rgba(255, 255, 255, ${0.03 + i * 0.01})`,
                                left: `${10 + i * 15}%`,
                                top: `${-20 + i * 10}%`,
                            }}
                        />
                    ))}
                </Box>

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography
                                variant="h2"
                                sx={{
                                    fontWeight: 800,
                                    mb: 2,
                                    textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                                }}
                            >
                                🏝️ {t('attractions_hero_title')}
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    maxWidth: 600,
                                    mx: 'auto',
                                    opacity: 0.95,
                                    fontWeight: 500,
                                }}
                            >
                                {t('attractions_hero_subtitle')}
                            </Typography>
                        </Box>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Paper
                            sx={{
                                mt: 4,
                                p: 2,
                                borderRadius: '16px',
                                maxWidth: 600,
                                mx: 'auto',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                            }}
                        >
                            <TextField
                                fullWidth
                                placeholder={t('attractions_search_placeholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                        bgcolor: '#f5f7fa',
                                    },
                                }}
                            />
                        </Paper>
                    </motion.div>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 5 }}>
                {/* Filters Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* City Filters */}
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Box
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <ExploreIcon sx={{ fontSize: 18, color: 'white' }} />
                            </Box>
                            <Typography variant="h6" fontWeight={700}>
                                {t('attractions_filter_city')}
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {cities.map((city) => (
                                <Chip
                                    key={city}
                                    label={city === 'All' ? t('filter_all') : city}
                                    onClick={() => setSelectedCity(city)}
                                    sx={{
                                        px: 2,
                                        py: 2.5,
                                        borderRadius: '12px',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        background: selectedCity === city
                                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                            : '#f0f2f5',
                                        color: selectedCity === city ? 'white' : 'text.primary',
                                        border: 'none',
                                        '&:hover': {
                                            opacity: 0.9,
                                            transform: 'scale(1.02)',
                                        },
                                        transition: 'all 0.2s ease',
                                    }}
                                />
                            ))}
                        </Stack>
                    </Box>

                    {/* Category & Sort Filters */}
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: '16px',
                            mb: 4,
                            background: 'linear-gradient(135deg, rgba(102,126,234,0.05) 0%, rgba(118,75,162,0.05) 100%)',
                            border: '1px solid rgba(102,126,234,0.1)',
                        }}
                    >
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>{t('attractions_filter_category')}</InputLabel>
                                    <Select
                                        value={selectedCategory}
                                        label={t('attractions_filter_category')}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        sx={{ borderRadius: '12px', bgcolor: 'white' }}
                                    >
                                        {categories.map((cat) => (
                                            <MenuItem key={cat} value={cat}>
                                                {getCategoryLabel(cat)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>{t('sort_by_label')}</InputLabel>
                                    <Select
                                        value={sortBy}
                                        label={t('sort_by_label')}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        sx={{ borderRadius: '12px', bgcolor: 'white' }}
                                    >
                                        <MenuItem value="popular">{t('sort_popular')}</MenuItem>
                                        <MenuItem value="price_low">{t('sort_price_low')}</MenuItem>
                                        <MenuItem value="price_high">{t('sort_price_high')}</MenuItem>
                                        <MenuItem value="rating">{t('sort_rating')}</MenuItem>
                                        <MenuItem value="name">{t('sort_name')}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Paper>
                </motion.div>

                {/* Results Count */}
                <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                    {t('attractions_found', { count: filteredAttractions.length })}
                </Typography>

                {/* Attractions Grid */}
                {loading ? (
                    <LoadingPlaceholder />
                ) : filteredAttractions.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h5" color="text.secondary">
                            {t('no_attractions_found')}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                            {t('try_adjusting_filters')}
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {filteredAttractions.map((attraction, index) => (
                            <Grid item xs={12} sm={6} md={4} key={attraction.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <AttractionCard attraction={attraction} />
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            <Footer />
        </>
    );
}
