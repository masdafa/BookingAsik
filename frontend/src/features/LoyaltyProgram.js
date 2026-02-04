// src/features/LoyaltyProgram.js

import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Grid, 
    LinearProgress, 
    Chip,
    Alert 
} from '@mui/material';
import { 
    Star as StarIcon, 
    EmojiEvents as RewardIcon,
    AccountBalanceWallet as WalletIcon
} from '@mui/icons-material';
import { getLoyaltyPoints } from '../utils/loyalty'; // 🚨 Import utility poin

// Definisikan tingkatan (Tiers) reward
const LOYALTY_TIERS = [
    { name: 'Bronze', requiredPoints: 0, benefit: '5% Diskon Tetap' },
    { name: 'Silver', requiredPoints: 500, benefit: '10% Diskon + Check-in Awal' },
    { name: 'Gold', requiredPoints: 2000, benefit: '15% Diskon + Upgrade Kamar Gratis' },
];

// Asumsi user adalah objek user dari useAuth
const LoyaltyProgram = ({ user }) => {
    const [currentPoints, setCurrentPoints] = useState(0);

    // Dapatkan ID pengguna
    const userId = user?.id;
    const isLoggedIn = !!userId;

    // Ambil dan dengarkan pembaruan poin
    useEffect(() => {
        const fetchPoints = () => {
            if (isLoggedIn) {
                const points = getLoyaltyPoints(userId);
                setCurrentPoints(points);
            } else {
                setCurrentPoints(0);
            }
        };

        fetchPoints();
        
        // Listen to custom event when points are added (from Booking.js)
        window.addEventListener('loyalty-updated', fetchPoints); 
        return () => {
            window.removeEventListener('loyalty-updated', fetchPoints);
        };
    }, [isLoggedIn, userId]);

    // Tentukan Tier pengguna saat ini
    const getCurrentTier = (points) => {
        let currentTier = LOYALTY_TIERS[0];
        for (let i = LOYALTY_TIERS.length - 1; i >= 0; i--) {
            if (points >= LOYALTY_TIERS[i].requiredPoints) {
                currentTier = LOYALTY_TIERS[i];
                break;
            }
        }
        return currentTier;
    };

    const currentTier = getCurrentTier(currentPoints);
    const nextTierIndex = LOYALTY_TIERS.findIndex(tier => tier.name === currentTier.name) + 1;
    const nextTier = nextTierIndex < LOYALTY_TIERS.length ? LOYALTY_TIERS[nextTierIndex] : null;

    // Hitung progress bar
    const tierProgress = nextTier 
        ? ((currentPoints - currentTier.requiredPoints) / (nextTier.requiredPoints - currentTier.requiredPoints)) * 100
        : 100;
    
    // Tentukan warna chip berdasarkan tier
    const getTierColor = (tierName) => {
        switch (tierName) {
            case 'Bronze': return 'default';
            case 'Silver': return 'info';
            case 'Gold': return 'warning';
            default: return 'default';
        }
    };

    if (!isLoggedIn) {
        return (
            <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                Anda harus **Login** untuk melihat dan mengumpulkan poin Loyalty.
            </Alert>
        );
    }

    return (
        <Grid container spacing={4}>
            {/* 1. SALDO POIN */}
            <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: '100%', background: 'var(--card-bg)' }}>
                    <WalletIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" color="text.secondary" fontWeight={600}>
                        Saldo Poin Anda
                    </Typography>
                    <Typography variant="h3" fontWeight={800} sx={{ color: 'var(--text)' }}>
                        {currentPoints.toLocaleString('id-ID')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Poin dikumpulkan dari total pembayaran booking Anda.
                    </Typography>
                </Paper>
            </Grid>

            {/* 2. TIER & PROGRESS */}
            <Grid item xs={12} md={8}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: '100%', background: 'var(--card-bg)' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="h6" fontWeight={700} sx={{ color: 'var(--text)' }}>
                            Level Loyalitas Saat Ini
                        </Typography>
                        <Chip
                            label={currentTier.name.toUpperCase()}
                            color={getTierColor(currentTier.name)}
                            icon={<StarIcon />}
                            sx={{ fontWeight: 700 }}
                        />
                    </Box>

                    {nextTier ? (
                        <Box mt={2}>
                            <Typography variant="body2" color="text.secondary" mb={1}>
                                {nextTier.requiredPoints.toLocaleString('id-ID')} Poin dibutuhkan untuk naik ke Level **{nextTier.name}**
                            </Typography>
                            <LinearProgress 
                                variant="determinate" 
                                value={tierProgress} 
                                sx={{ height: 10, borderRadius: 5, mb: 0.5 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                                {tierProgress.toFixed(1)}% Progress
                            </Typography>
                        </Box>
                    ) : (
                        <Box mt={2}>
                            <Alert severity="success">
                                Selamat! Anda telah mencapai Level **{currentTier.name}** tertinggi.
                            </Alert>
                        </Box>
                    )}
                </Paper>
            </Grid>

            {/* 3. DAFTAR REWARD */}
            <Grid item xs={12}>
                <Typography variant="h5" fontWeight={700} sx={{ mt: 3, mb: 2, color: 'var(--text)' }}>
                    Tingkat dan Keuntungan
                </Typography>
                <Grid container spacing={3}>
                    {LOYALTY_TIERS.map((tier) => (
                        <Grid item xs={12} sm={6} md={4} key={tier.name}>
                            <Paper 
                                variant={tier.name === currentTier.name ? "outlined" : "elevation"}
                                sx={{ 
                                    p: 3, 
                                    borderRadius: 3, 
                                    border: tier.name === currentTier.name ? '2px solid #1976d2' : 'none',
                                    background: tier.name === currentTier.name ? 'var(--card-bg-highlight)' : 'var(--card-bg)',
                                }}
                            >
                                <Box display="flex" alignItems="center" mb={1}>
                                    <RewardIcon sx={{ mr: 1, color: tier.name === currentTier.name ? 'primary.main' : 'text.secondary' }} />
                                    <Typography variant="h6" fontWeight={700}>
                                        {tier.name}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Membutuhkan: {tier.requiredPoints.toLocaleString('id-ID')} Poin
                                </Typography>
                                <Chip 
                                    label={`Benefit: ${tier.benefit}`} 
                                    color="success" 
                                    variant="outlined" 
                                    size="small"
                                />
                                {tier.name === currentTier.name && (
                                    <Chip 
                                        label="Level Anda Saat Ini" 
                                        color="primary" 
                                        size="small"
                                        sx={{ mt: 1, fontWeight: 700 }}
                                    />
                                )}
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default LoyaltyProgram;