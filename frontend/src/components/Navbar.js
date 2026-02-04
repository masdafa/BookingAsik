import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    useTheme,
    Badge, // Import Badge
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Import Contexts
import { useAuth } from '../context/AuthContext'; // Menggunakan AuthContext Anda
import { useFavorites } from '../context/FavoritesContext'; // Menggunakan FavoritesContext Anda

// Icons
import HomeIcon from '@mui/icons-material/Home';
import BookIcon from '@mui/icons-material/Book';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ExploreIcon from '@mui/icons-material/Explore';

import LanguageSelector from '../features/LanguageSelector';

// --- Helper Functions ---
const getCurrentTierName = (points) => {
    const LOYALTY_TIERS = [
        { name: 'Bronze', requiredPoints: 0 },
        { name: 'Silver', requiredPoints: 500 },
        { name: 'Gold', requiredPoints: 2000 },
    ];
    let currentTier = LOYALTY_TIERS[0];
    for (let i = LOYALTY_TIERS.length - 1; i >= 0; i--) {
        if (points >= LOYALTY_TIERS[i].requiredPoints) {
            currentTier = LOYALTY_TIERS[i];
            break;
        }
    }
    return currentTier.name;
};


const Navbar = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    // Mendapatkan data dari Context
    const { user, logout, toggleTheme, isDarkMode } = useAuth(); // Asumsi toggleTheme ada di AuthContext
    const { favorites } = useFavorites();

    // Hitungan favorit aktual
    const favoriteCount = favorites.length;

    // Mendapatkan inisial dan tier
    const userInitials = user ? user.name.split(' ').map(n => n[0]).join('') : 'G';
    const loyaltyTier = user ? getCurrentTierName(user.points || 0) : 'Bronze';

    const navItems = [
        { label: t('home'), path: '/', icon: HomeIcon, isBadge: false },
        { label: t('attractions'), path: '/attractions', icon: ExploreIcon, isBadge: false },
        // PERUBAHAN: Tautan ke /your-booking (Sesuai App.js)
        { label: t('my_bookings'), path: '/your-booking', icon: BookIcon, isBadge: false, isProtected: true },
        {
            label: t('wishlist'),
            path: '/favorites', // Sesuai App.js
            icon: FavoriteIcon,
            isBadge: true,
            badgeContent: favoriteCount,
            isProtected: true
        },
    ];

    return (
        <>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    background: theme.palette.mode === 'dark' ? 'rgba(26, 115, 232, 0.8)' : 'rgba(33, 150, 243, 0.8)', // Semi-transparent
                    backdropFilter: 'blur(12px)', // Glassmorphism effect
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    zIndex: theme.zIndex.drawer + 1,
                    top: 0,
                    left: 0,
                    width: '100%',
                }}
            >
                <Toolbar sx={{
                    maxWidth: 'lg',
                    width: '100%',
                    margin: '0 auto',
                    justifyContent: 'space-between',
                    minHeight: { xs: 75, md: 90 },
                    px: { xs: 2, sm: 3 } // Add padding for better spacing
                }}>
                    {/* Logo */}
                    <Typography
                        variant="h5"
                        component={RouterLink}
                        to="/"
                        sx={{
                            fontWeight: 800,
                            color: 'white',
                            textDecoration: 'none',
                            letterSpacing: '-0.5px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        BookingAsik.com
                    </Typography>

                    {/* Navigation Links (Hanya tampilkan yang tidak terproteksi jika user belum login) */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

                        {navItems.map((item) => (
                            // Hanya tampilkan item yang tidak dilindungi atau jika user sudah login
                            (user || !item.isProtected) && (
                                <Button
                                    key={item.label}
                                    component={RouterLink}
                                    to={item.path}
                                    sx={{
                                        color: 'white',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        display: { xs: 'none', md: 'flex' },
                                        px: 2,
                                        borderRadius: 2,
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                                >
                                    {/* Logic untuk Badge Favorit */}
                                    {item.isBadge ? (
                                        <Badge
                                            badgeContent={item.badgeContent > 0 ? item.badgeContent : null}
                                            color="error" // Warna merah untuk notifikasi
                                            overlap="rectangular"
                                            sx={{ mr: 1 }}
                                        >
                                            <item.icon sx={{ fontSize: 20 }} />
                                        </Badge>
                                    ) : (
                                        <item.icon sx={{ mr: 1, fontSize: 20 }} />
                                    )}
                                    {item.label}
                                </Button>
                            )
                        ))}

                        {/* Language Selector */}
                        <LanguageSelector />

                        {/* Theme Toggle */}
                        <Button onClick={toggleTheme} color="inherit" sx={{ minWidth: 0, p: 1, borderRadius: '50%' }}>
                            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                        </Button>

                        {/* User Info (Tampil setelah login) */}
                        {user ? (
                            <>
                                {/* Loyalty Chip */}
                                <Box
                                    sx={{
                                        display: { xs: 'none', sm: 'flex' }, // Sembunyikan di layar sangat kecil
                                        alignItems: 'center',
                                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                        borderRadius: '20px',
                                        p: '4px 12px',
                                        fontWeight: 700,
                                        border: '1px solid rgba(255, 255, 255, 0.3)',
                                        backdropFilter: 'blur(4px)'
                                    }}
                                >
                                    <StarIcon sx={{ color: '#ffc107', fontSize: 18, mr: 0.5 }} />
                                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 700 }}>
                                        {loyaltyTier}
                                    </Typography>
                                </Box>

                                {/* User Avatar */}
                                <Button
                                    component={RouterLink}
                                    to="/profile"
                                    sx={{
                                        color: 'white',
                                        minWidth: 0,
                                        p: 0.5,
                                        borderRadius: '50px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        ml: 1,
                                        textTransform: 'none',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                        },
                                        pl: 0.5,
                                        pr: 2
                                    }}
                                >
                                    <Box sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        backgroundColor: '#ff9800',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: '0.85rem',
                                        mr: 1,
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                    }}>
                                        {userInitials}
                                    </Box>
                                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600, display: { xs: 'none', sm: 'block' } }}>
                                        {user.name}
                                    </Typography>
                                </Button>
                            </>
                        ) : (
                            // Tombol Login/Register jika user belum login
                            <Button
                                component={RouterLink}
                                to="/login"
                                variant="contained"
                                size="medium"
                                sx={{
                                    ml: 2,
                                    backgroundColor: 'white',
                                    color: theme.palette.primary.main,
                                    fontWeight: 700,
                                    borderRadius: '8px',
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                    },
                                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                                }}
                            >
                                {t('login')}
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            {/* Spacer to prevent content from hiding behind fixed navbar */}
            <Box sx={{ height: { xs: 75, md: 90 } }} />
        </>
    );
};

export default Navbar;