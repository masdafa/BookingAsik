import React from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    Button,
    Avatar,
    Divider,
    useTheme
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Icons
import StarIcon from '@mui/icons-material/Star';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// Asumsi: Menggunakan context Anda
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user, logout } = useAuth(); // Asumsi user memiliki { name, email, role, loyaltyPoints }

    // Data User Dummy (GANTI DENGAN DATA USER ASLI DARI CONTEXT)
    const currentUser = user || {
        name: 'Dafa Yunidar',
        email: 'dafayunidar@gmail.com',
        role: 'user', // user atau admin
        points: 0
    };

    const userInitials = currentUser.name.split(' ').map(n => n[0]).join('');

    // Fungsi untuk mendapatkan Tier Loyalty
    const getCurrentTierName = (points) => {
        if (points >= 2000) return { name: 'GOLD', color: '#FFD700' };
        if (points >= 500) return { name: 'SILVER', color: '#C0C0C0' };
        return { name: 'BRONZE', color: '#CD7F32' };
    };

    const loyaltyTier = getCurrentTierName(currentUser.points || 0);

    const handleLogout = () => {
        logout(); // Panggil fungsi logout dari AuthContext
        navigate('/'); // Redirect ke home setelah logout
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" fontWeight={700} color={theme.palette.primary.main}>
                    {t('user_profile')}
                </Typography>

                {/* TOMBOL BARU: Kembali ke Home */}
                <Button
                    component={RouterLink}
                    to="/"
                    variant="outlined"
                    startIcon={<HomeIcon />}
                    sx={{ textTransform: 'none' }}
                >
                    {t('back_to_home')}
                </Button>
            </Box>

            <Grid container spacing={4}>

                {/* KARTU KIRI: Informasi Dasar & Avatar */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={4} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>

                        <Avatar sx={{
                            width: 80,
                            height: 80,
                            mb: 2,
                            bgcolor: theme.palette.secondary.main, // Warna oranye
                            fontSize: '2rem',
                            border: `3px solid ${theme.palette.primary.main}`
                        }}>
                            {userInitials}
                        </Avatar>

                        <Typography variant="h5" fontWeight={700} gutterBottom>{currentUser.name}</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>{currentUser.email}</Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, p: '4px 12px', borderRadius: 20, bgcolor: theme.palette.grey[200] }}>
                            <AccountCircleIcon sx={{ mr: 0.5, fontSize: 18 }} />
                            <Typography variant="body2" fontWeight={600} textTransform="capitalize">
                                {currentUser.role === 'admin' ? t('admin_role_label') : t('regular_user_label')}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 3, width: '100%' }} />

                        <Button
                            variant="contained"
                            startIcon={<EditIcon />}
                            sx={{ mb: 1.5, width: '100%', textTransform: 'none' }}
                            component={RouterLink}
                            to="/profile/edit" // Asumsi ada rute /profile/edit
                        >
                            {t('edit_profile')}
                        </Button>

                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                            sx={{ width: '100%', textTransform: 'none' }}
                        >
                            {t('logout_account')}
                        </Button>
                    </Paper>
                </Grid>

                {/* KARTU KANAN: Program Loyalty & Aksi Akun */}
                <Grid item xs={12} md={8}>

                    {/* Bagian Loyalty Program */}
                    <Paper elevation={4} sx={{ p: 4, mb: 4, borderLeft: `6px solid ${loyaltyTier.color}` }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" fontWeight={700}>{t('loyalty_program_status')}</Typography>
                            <VerifiedUserIcon color="primary" />
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <Box display="flex" alignItems="center" mb={1}>
                            <StarIcon sx={{ color: loyaltyTier.color, mr: 1, fontSize: 30 }} />
                            <Typography variant="h5" fontWeight={600}>
                                {t('your_level')}: <Box component="span" fontWeight={800} color={loyaltyTier.color}>{loyaltyTier.name}</Box>
                            </Typography>
                        </Box>

                        <Box display="flex" alignItems="center" mb={3}>
                            <AttachMoneyIcon color="success" sx={{ mr: 1, fontSize: 30 }} />
                            <Typography variant="h5" fontWeight={600}>
                                {t('points_balance')}: <Box component="span" fontWeight={800} color={theme.palette.success.main}>{currentUser.points || 0} Poin</Box>
                            </Typography>
                        </Box>

                        <Button
                            component={RouterLink}
                            to="/loyalty"
                            variant="contained"
                            fullWidth
                            sx={{ py: 1.5, fontWeight: 700, textTransform: 'none' }}
                        >
                            {t('see_loyalty_details')}
                        </Button>
                    </Paper>

                    {/* Bagian Kelola Akun Tambahan */}
                    <Paper elevation={4} sx={{ p: 4 }}>
                        <Typography variant="h6" fontWeight={700} mb={2}>{t('quick_account_actions')}</Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    component={RouterLink}
                                    to="/your-booking"
                                    sx={{ py: 1.5, textTransform: 'none' }}
                                >
                                    {t('view_booking_history')}
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    component={RouterLink}
                                    to="/favorites"
                                    sx={{ py: 1.5, textTransform: 'none' }}
                                >
                                    {t('check_favorites')}
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    component={RouterLink}
                                    to="/deals"
                                    sx={{ py: 1.5, textTransform: 'none' }}
                                >
                                    {t('search_latest_deals')}
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {/* Tombol Logout cepat */}
                                <Button
                                    variant="outlined"
                                    color="error"
                                    fullWidth
                                    onClick={handleLogout}
                                    sx={{ py: 1.5, textTransform: 'none' }}
                                >
                                    {t('quick_logout')}
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>

                </Grid>
            </Grid>
        </Container>
    );
};

export default Profile;