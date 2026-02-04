// src/pages/ProfileEdit.js
import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    Button,
    TextField,
    Avatar,
    useTheme,
    Snackbar,
    Alert,
    IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const ProfileEdit = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user, updateUser } = useAuth();

    // State untuk form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    // State untuk UI
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [avatarPreview, setAvatarPreview] = useState(null);

    // Inisialisasi form dengan data user
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
            // Jika ada avatar URL di user data
            if (user.avatar) {
                setAvatarPreview(user.avatar);
            }
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validasi file
            if (file.size > 2 * 1024 * 1024) { // 2MB max
                showSnackbar(t('file_too_large'), 'error');
                return;
            }
            
            if (!file.type.startsWith('image/')) {
                showSnackbar(t('invalid_file_type'), 'error');
                return;
            }

            // Preview avatar
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target.result);
            };
            reader.readAsDataURL(file);

            // Di sini biasanya Anda akan mengupload file ke server
            // Untuk demo, kita hanya menampilkan preview
            showSnackbar(t('avatar_selected'), 'info');
        }
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Simulasi API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update user data (di sini Anda akan memanggil API)
            await updateUser(formData);
            
            showSnackbar(t('profile_updated_success'), 'success');
            
            // Tunggu sebentar lalu kembali ke profile
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
            
        } catch (error) {
            console.error('Error updating profile:', error);
            showSnackbar(t('profile_update_error'), 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToProfile = () => {
        navigate('/profile');
    };

    const userInitials = formData.name.split(' ').map(n => n[0]).join('');

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" fontWeight={700} color={theme.palette.primary.main}>
                    {t('edit_profile_title')}
                </Typography>

                <Button
                    onClick={handleBackToProfile}
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    sx={{ textTransform: 'none' }}
                >
                    {t('back_to_profile')}
                </Button>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={4} sx={{ p: 4 }}>
                        <Typography variant="h6" fontWeight={700} mb={3}>
                            {t('edit_personal_info')}
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label={t('full_name')}
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        variant="outlined"
                                    />
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label={t('email_address')}
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        type="email"
                                        required
                                        variant="outlined"
                                        disabled // Email biasanya tidak bisa diubah
                                    />
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label={t('phone_number')}
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label={t('address')}
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    disabled={loading}
                                    sx={{ 
                                        py: 1.5, 
                                        px: 4,
                                        fontWeight: 700,
                                        textTransform: 'none'
                                    }}
                                >
                                    {loading ? t('saving') : t('save_changes')}
                                </Button>
                                
                                <Button
                                    variant="outlined"
                                    onClick={handleBackToProfile}
                                    sx={{ 
                                        py: 1.5, 
                                        px: 4,
                                        textTransform: 'none'
                                    }}
                                >
                                    {t('cancel')}
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper elevation={4} sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight={700} mb={3}>
                            {t('profile_picture')}
                        </Typography>
                        
                        <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                            <Avatar 
                                sx={{
                                    width: 120,
                                    height: 120,
                                    mb: 2,
                                    bgcolor: theme.palette.secondary.main,
                                    fontSize: '3rem',
                                    border: `3px solid ${theme.palette.primary.main}`
                                }}
                            >
                                {avatarPreview ? (
                                    <img 
                                        src={avatarPreview} 
                                        alt="Avatar Preview" 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    userInitials
                                )}
                            </Avatar>
                            
                            <IconButton
                                component="label"
                                sx={{
                                    position: 'absolute',
                                    bottom: 10,
                                    right: 10,
                                    bgcolor: 'white',
                                    border: `2px solid ${theme.palette.primary.main}`,
                                    '&:hover': {
                                        bgcolor: theme.palette.primary.light
                                    }
                                }}
                            >
                                <CameraAltIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />
                            </IconButton>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {t('avatar_upload_hint')}
                        </Typography>
                        
                        <Button
                            component="label"
                            variant="outlined"
                            fullWidth
                            sx={{ textTransform: 'none' }}
                        >
                            {t('upload_new_avatar')}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />
                        </Button>
                        
                        <Button
                            variant="text"
                            color="error"
                            fullWidth
                            sx={{ mt: 1, textTransform: 'none' }}
                            onClick={() => {
                                setAvatarPreview(null);
                                showSnackbar(t('avatar_removed'), 'info');
                            }}
                        >
                            {t('remove_avatar')}
                        </Button>
                    </Paper>
                    
                    <Paper elevation={4} sx={{ p: 4, mt: 3 }}>
                        <Typography variant="h6" fontWeight={700} mb={2}>
                            {t('account_info')}
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                {t('member_since')}
                            </Typography>
                            <Typography variant="body1" fontWeight={600}>
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : t('not_available')}
                            </Typography>
                        </Box>
                        
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                {t('account_status')}
                            </Typography>
                            <Typography 
                                variant="body1" 
                                fontWeight={600}
                                color={user?.isActive ? 'success.main' : 'error.main'}
                            >
                                {user?.isActive ? t('active') : t('inactive')}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Snackbar untuk notifikasi */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ProfileEdit;
