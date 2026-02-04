import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Chip, Rating, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const AttractionCard = ({ attraction }) => {
    const { t } = useTranslation();

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

    const getCategoryLabel = (category) => {
        const labels = {
            temple: t('attraction_category_temple'),
            nature: t('attraction_category_nature'),
            heritage: t('attraction_category_heritage'),
            culture: t('attraction_category_culture'),
            landmark: t('attraction_category_landmark'),
            theme_park: t('attraction_category_theme_park'),
            beach: t('attraction_category_beach'),
            adventure: t('attraction_category_adventure'),
        };
        return labels[category] || category;
    };

    const discountedPrice = attraction.is_flash_sale && attraction.discount_percent > 0
        ? attraction.price * (1 - attraction.discount_percent / 100)
        : attraction.price;

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                    },
                }}
            >
                {/* Image Section */}
                <Box sx={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        height="200"
                        image={attraction.image}
                        alt={attraction.name}
                        sx={{ objectFit: 'cover' }}
                    />

                    {/* Flash Sale Badge */}
                    {attraction.is_flash_sale && (
                        <Chip
                            icon={<LocalOfferIcon sx={{ fontSize: 16 }} />}
                            label={`-${attraction.discount_percent}%`}
                            sx={{
                                position: 'absolute',
                                top: 12,
                                left: 12,
                                bgcolor: '#ff4757',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                            }}
                        />
                    )}

                    {/* Category Badge */}
                    <Chip
                        label={`${getCategoryIcon(attraction.category)} ${getCategoryLabel(attraction.category)}`}
                        sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            bgcolor: 'rgba(255,255,255,0.95)',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                        }}
                    />

                    {/* Rating */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 12,
                            left: 12,
                            bgcolor: 'rgba(0,0,0,0.7)',
                            borderRadius: '8px',
                            px: 1.5,
                            py: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                        }}
                    >
                        <Rating value={attraction.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                            {attraction.rating}
                        </Typography>
                    </Box>
                </Box>

                {/* Content */}
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {attraction.name}
                    </Typography>

                    {/* Location */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1, color: 'text.secondary' }}>
                        <LocationOnIcon sx={{ fontSize: 18 }} />
                        <Typography variant="body2">{attraction.city}</Typography>
                    </Box>

                    {/* Duration */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2, color: 'text.secondary' }}>
                        <AccessTimeIcon sx={{ fontSize: 18 }} />
                        <Typography variant="body2">{attraction.duration}</Typography>
                    </Box>

                    {/* Description */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            flexGrow: 1,
                        }}
                    >
                        {attraction.description}
                    </Typography>

                    {/* Price & Button */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                        <Box>
                            {attraction.is_flash_sale && (
                                <Typography
                                    variant="body2"
                                    sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                                >
                                    Rp {parseInt(attraction.price).toLocaleString('id-ID')}
                                </Typography>
                            )}
                            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1a73e8' }}>
                                {attraction.price > 0
                                    ? `Rp ${parseInt(discountedPrice).toLocaleString('id-ID')}`
                                    : t('attraction_free_entry')
                                }
                            </Typography>
                        </Box>

                        <Button
                            component={RouterLink}
                            to={`/attractions/${attraction.id}`}
                            variant="contained"
                            sx={{
                                borderRadius: '10px',
                                px: 3,
                                py: 1,
                                background: 'linear-gradient(135deg, #1a73e8 0%, #0057d8 100%)',
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1557b0 0%, #003f9e 100%)',
                                },
                            }}
                        >
                            {t('attraction_view_details')}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default AttractionCard;
