import React, { useEffect, useState } from 'react';
import {
    Container, Box, Typography, Grid, Paper, Button, Chip, Rating,
    Divider, IconButton, Snackbar, Alert
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HotelMap from '../components/HotelMap';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

// Icons
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';

export default function AttractionDetail() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [attraction, setAttraction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const fetchAttraction = async () => {
            try {
                const res = await api.get(`/attractions/${id}`);
                setAttraction(res.data);

                // Check if favorited
                const favorites = JSON.parse(localStorage.getItem('attractionFavorites') || '[]');
                setIsFavorite(favorites.includes(parseInt(id)));
            } catch (err) {
                console.error('Error fetching attraction:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAttraction();
    }, [id]);

    const getCategoryIcon = (category) => {
        const icons = {
            temple: '🛕',
            nature: '🌿',
            heritage: '🏛️',
            culture: '🎭',
            landmark: '🗼',
            theme_park: '🎢',
            beach: '🏝️',
            adventure: '⛰️',
        };
        return icons[category] || '📍';
    };

    const handleToggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('attractionFavorites') || '[]');
        let newFavorites;

        if (isFavorite) {
            newFavorites = favorites.filter(fid => fid !== parseInt(id));
            setSnackbar({ open: true, message: t('attraction_removed_favorite'), severity: 'info' });
        } else {
            newFavorites = [...favorites, parseInt(id)];
            setSnackbar({ open: true, message: t('attraction_saved_favorite'), severity: 'success' });
        }

        localStorage.setItem('attractionFavorites', JSON.stringify(newFavorites));
        setIsFavorite(!isFavorite);
    };

    const handleShare = async () => {
        const url = window.location.href;
        try {
            await navigator.clipboard.writeText(url);
            setSnackbar({ open: true, message: t('link_copied'), severity: 'success' });
        } catch {
            setSnackbar({ open: true, message: 'Failed to copy link', severity: 'error' });
        }
    };

    if (loading) return <><Navbar /><LoadingPlaceholder /></>;

    if (!attraction) {
        return (
            <>
                <Navbar />
                <Container sx={{ py: 10, textAlign: 'center' }}>
                    <Typography variant="h4">{t('attraction_not_found')}</Typography>
                </Container>
            </>
        );
    }

    const discountedPrice = attraction.is_flash_sale && attraction.discount_percent > 0
        ? attraction.price * (1 - attraction.discount_percent / 100)
        : attraction.price;

    return (
        <>
            <Navbar />

            {/* Hero Image */}
            <Box
                sx={{
                    height: { xs: 300, md: 450 },
                    position: 'relative',
                    backgroundImage: `url(${attraction.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7) 100%)',
                    }}
                />

                {/* Flash Sale Badge */}
                {attraction.is_flash_sale && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.3 }}
                    >
                        <Chip
                            icon={<LocalOfferIcon />}
                            label={`FLASH SALE -${attraction.discount_percent}%`}
                            sx={{
                                position: 'absolute',
                                top: 20,
                                left: 20,
                                bgcolor: '#ff4757',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1rem',
                                py: 2.5,
                            }}
                        />
                    </motion.div>
                )}

                {/* Actions */}
                <Box sx={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 1 }}>
                    <IconButton
                        onClick={handleToggleFavorite}
                        sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white' } }}
                    >
                        {isFavorite ? <FavoriteIcon sx={{ color: '#ff4757' }} /> : <FavoriteBorderIcon />}
                    </IconButton>
                    <IconButton
                        onClick={handleShare}
                        sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white' } }}
                    >
                        <ShareIcon />
                    </IconButton>
                </Box>

                {/* Title Overlay */}
                <Container
                    maxWidth="lg"
                    sx={{
                        position: 'absolute',
                        bottom: 30,
                        left: 0,
                        right: 0,
                        color: 'white',
                    }}
                >
                    <Typography variant="h3" fontWeight={800} sx={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                        {attraction.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                        <Chip
                            label={`${getCategoryIcon(attraction.category)} ${t(`attraction_category_${attraction.category}`)}`}
                            sx={{ bgcolor: 'rgba(255,255,255,0.9)', fontWeight: 600 }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationOnIcon />
                            <Typography>{attraction.city}</Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: 5 }}>
                <Grid container spacing={4}>
                    {/* Left Content */}
                    <Grid item xs={12} md={8}>
                        {/* Rating & Info */}
                        <Paper sx={{ p: 3, borderRadius: '16px', mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Rating value={attraction.rating} precision={0.1} readOnly size="large" />
                                <Typography variant="h6" fontWeight={700}>{attraction.rating}</Typography>
                                <Chip icon={<StarIcon />} label={t('attraction_top_rated')} color="primary" size="small" />
                            </Box>

                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AccessTimeIcon color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">{t('attraction_duration')}</Typography>
                                            <Typography fontWeight={600}>{attraction.duration}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AccessTimeIcon color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">{t('attraction_opening_hours')}</Typography>
                                            <Typography fontWeight={600}>{attraction.opening_hours}</Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Description */}
                        <Paper sx={{ p: 3, borderRadius: '16px', mb: 3 }}>
                            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                                {t('description_title')}
                            </Typography>
                            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary' }}>
                                {attraction.description}
                            </Typography>
                        </Paper>

                        {/* Amenities */}
                        <Paper sx={{ p: 3, borderRadius: '16px', mb: 3 }}>
                            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                                {t('attraction_amenities')}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {(attraction.amenities || []).map((amenity, idx) => (
                                    <Chip
                                        key={idx}
                                        label={amenity}
                                        sx={{
                                            bgcolor: 'rgba(102,126,234,0.1)',
                                            color: '#667eea',
                                            fontWeight: 500,
                                        }}
                                    />
                                ))}
                            </Box>
                        </Paper>

                        {/* Map */}
                        {attraction.latitude && attraction.longitude && (
                            <Paper sx={{ p: 3, borderRadius: '16px', mb: 3 }}>
                                <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                                    {t('location_title')}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {attraction.address}
                                </Typography>
                                <Box sx={{ height: 300, borderRadius: '12px', overflow: 'hidden' }}>
                                    <HotelMap
                                        hotels={[{
                                            id: attraction.id,
                                            name: attraction.name,
                                            latitude: attraction.latitude,
                                            longitude: attraction.longitude,
                                        }]}
                                    />
                                </Box>
                            </Paper>
                        )}
                    </Grid>

                    {/* Right Sidebar - Booking */}
                    <Grid item xs={12} md={4}>
                        <Paper
                            sx={{
                                p: 3,
                                borderRadius: '16px',
                                position: 'sticky',
                                top: 100,
                                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                            }}
                        >
                            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                                {t('attraction_book_ticket')}
                            </Typography>

                            {/* Price */}
                            <Box sx={{ mb: 3 }}>
                                {attraction.is_flash_sale && (
                                    <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                        Rp {parseInt(attraction.price).toLocaleString('id-ID')}
                                    </Typography>
                                )}
                                <Typography variant="h4" fontWeight={800} color="primary">
                                    {attraction.price > 0
                                        ? `Rp ${parseInt(discountedPrice).toLocaleString('id-ID')}`
                                        : t('attraction_free_entry')
                                    }
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {t('attraction_per_person')}
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Points Info */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                                <ConfirmationNumberIcon color="success" />
                                <Typography variant="body2" color="success.main" fontWeight={600}>
                                    {t('you_will_earn')} +{Math.floor(discountedPrice / 10000)} {t('points')} {t('attraction_per_person')}
                                </Typography>
                            </Box>

                            {/* Book Button */}
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                onClick={() => navigate(`/attractions/${id}/book`)}
                                sx={{
                                    py: 1.5,
                                    borderRadius: '12px',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)',
                                    },
                                }}
                            >
                                {t('book_now_button')}
                            </Button>

                            {!user && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                                    {t('attraction_login_to_book')}
                                </Typography>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            <Footer />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
