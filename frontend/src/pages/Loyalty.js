import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    LinearProgress,
    Button,
    Divider,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
    Chip
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';

// Icons
import StarIcon from '@mui/icons-material/Star';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

// Context & API
import { useAuth } from '../context/AuthContext';
import api from "../api/axios";

// --- DATA KONSTAN LOYALTY ---
const LOYALTY_TIERS = [
    {
        name: 'Bronze',
        requiredPoints: 0,
        color: '#CD7F32',
        benefits: [
            "Akses dasar ke semua fitur booking",
            "Mendapatkan 1 poin untuk setiap Rp 10.000,- yang dibelanjakan",
            "Dukungan pelanggan standar 24/7"
        ]
    },
    {
        name: 'Silver',
        requiredPoints: 500,
        color: '#C0C0C0',
        benefits: [
            "Semua benefit Bronze",
            "Diskon ekstra 5% untuk Flash Deals",
            "Mendapatkan 1.2x poin untuk setiap transaksi",
            "Prioritas check-in di mitra hotel tertentu"
        ]
    },
    {
        name: 'Gold',
        requiredPoints: 2000,
        color: '#FFD700',
        benefits: [
            "Semua benefit Silver",
            "Diskon ekstra 10% untuk semua booking",
            "Mendapatkan 1.5x poin untuk setiap transaksi",
            "Akses ke Lounge Eksekutif hotel pilihan",
            "Dukungan pelanggan VIP 24/7"
        ]
    }
];

// --- FUNGSI HELPER ---
const getLoyaltyStatus = (currentPoints) => {
    let currentTier = LOYALTY_TIERS[0];
    let nextTier = null;
    let progress = 0;

    for (let i = LOYALTY_TIERS.length - 1; i >= 0; i--) {
        if (currentPoints >= LOYALTY_TIERS[i].requiredPoints) {
            currentTier = LOYALTY_TIERS[i];
            nextTier = LOYALTY_TIERS[i + 1] || null;
            break;
        }
    }

    if (nextTier) {
        const pointsNeeded = nextTier.requiredPoints - currentTier.requiredPoints;
        const pointsEarnedInTier = currentPoints - currentTier.requiredPoints;
        progress = (pointsEarnedInTier / pointsNeeded) * 100;
        if (progress > 100) progress = 100;
    } else {
        progress = 100; // Sudah di tier tertinggi
    }

    return { currentTier, nextTier, progress };
};

// --- KOMPONEN UTAMA ---
const Loyalty = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user, fetchUser } = useAuth();
    const currentPoints = user?.points || 0;

    // Status Loyalty
    const { currentTier, nextTier, progress } = getLoyaltyStatus(currentPoints);

    // State
    const [selectedTab, setSelectedTab] = useState(0);
    const [vouchers, setVouchers] = useState([]);
    const [myVouchers, setMyVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [redeeming, setRedeeming] = useState(null);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    // Fetch Vouchers
    useEffect(() => {
        const loadVouchers = async () => {
            setLoading(true);
            try {
                const [resV, resMy] = await Promise.all([
                    api.get('/vouchers'),
                    api.get('/vouchers/my')
                ]);
                setVouchers(resV.data);
                setMyVouchers(resMy.data);
            } catch (err) {
                console.error("Failed to load vouchers", err);
            } finally {
                setLoading(false);
            }
        };
        loadVouchers();
    }, []);

    const handleRedeem = async (voucherId) => {
        if (!window.confirm("Tukar poin dengan voucher ini?")) return;
        setRedeeming(voucherId);
        try {
            await api.post('/vouchers/redeem', { voucherId });
            alert("Berhasil tukar poin!");
            // Refresh data
            await fetchUser(); // Refresh points
            const [resV, resMy] = await Promise.all([
                api.get('/vouchers'),
                api.get('/vouchers/my')
            ]);
            setVouchers(resV.data);
            setMyVouchers(resMy.data);
        } catch (err) {
            alert(err.response?.data?.message || "Gagal menukar poin");
        } finally {
            setRedeeming(null);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
                <Box>
                    <Typography variant="h4" component="h1" fontWeight={700} color={theme.palette.primary.main}>
                        Loyalty Program
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Raih poin dan nikmati keuntungan eksklusif
                    </Typography>
                </Box>

                <Button
                    component={RouterLink}
                    to="/"
                    variant="outlined"
                    startIcon={<HomeIcon />}
                    sx={{ textTransform: 'none' }}
                >
                    Kembali ke Home
                </Button>
            </Box>

            <Grid container spacing={4} mb={6}>

                {/* KARTU 1: Saldo Poin Anda */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={4} sx={{ p: 4, height: '100%', borderLeft: `6px solid ${theme.palette.success.main}` }}>
                        <Box display="flex" alignItems="center" mb={1}>
                            <AttachMoneyIcon color="success" sx={{ mr: 1, fontSize: 30 }} />
                            <Typography variant="h6" fontWeight={700}>Saldo Poin Anda</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="h2" fontWeight={800} color={theme.palette.success.main} sx={{ mb: 1 }}>
                            {currentPoints.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Poin dikumpulkan dari total pembayaran booking Anda.
                        </Typography>
                    </Paper>
                </Grid>

                {/* KARTU 2: Progress Loyalty */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={4} sx={{ p: 4, height: '100%', borderLeft: `6px solid ${currentTier.color}` }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Box display="flex" alignItems="center">
                                <StarIcon sx={{ color: currentTier.color, mr: 1, fontSize: 30 }} />
                                <Typography variant="h6" fontWeight={700}>Level Loyalitas Saat Ini</Typography>
                            </Box>
                            <Box sx={{ p: '4px 12px', borderRadius: 20, bgcolor: currentTier.color, color: 'white', fontWeight: 600 }}>
                                {currentTier.name}
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {nextTier ? (
                            <Box>
                                <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
                                    {(nextTier.requiredPoints - currentPoints).toLocaleString()} Poin dibutuhkan untuk naik ke Level <Box component="span" fontWeight={800} color={nextTier.color}>{nextTier.name}</Box>
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    sx={{ height: 10, borderRadius: 5, mb: 1.5 }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    {progress.toFixed(1)}% Progress
                                </Typography>
                            </Box>
                        ) : (
                            <Box display="flex" alignItems="center" color={theme.palette.primary.main}>
                                <UpgradeIcon sx={{ mr: 1 }} />
                                <Typography variant="body1" fontWeight={600}>
                                    Selamat! Anda berada di Level Tertinggi ({currentTier.name})!
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* TABS SECTION */}
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                Keuntungan & Voucher
            </Typography>

            <Paper elevation={4} sx={{ p: isMobile ? 2 : 4 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={selectedTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                        <Tab label="Info Level" />
                        <Tab label="Tukar Poin (Voucher)" />
                        <Tab label={`Voucher Saya (${myVouchers.filter(v => !v.is_used).length})`} />
                    </Tabs>
                </Box>

                {/* 1. INFO LEVEL */}
                {selectedTab === 0 && (
                    <Box sx={{ p: 3 }}>
                        {LOYALTY_TIERS.map((tier, index) => (
                            <Box key={tier.name} mb={3}>
                                <Typography variant="h6" gutterBottom color={tier.color} fontWeight={700}>
                                    Level {tier.name} (Min. {tier.requiredPoints} Poin)
                                </Typography>
                                <List dense>
                                    {tier.benefits.map((benefit, bIndex) => (
                                        <ListItem key={bIndex} sx={{ py: 0.5 }}>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                <CheckCircleIcon color="primary" fontSize="small" />
                                            </ListItemIcon>
                                            <ListItemText primary={benefit} primaryTypographyProps={{ fontSize: '1rem' }} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        ))}
                    </Box>
                )}

                {/* 2. TUKAR POIN */}
                {selectedTab === 1 && (
                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            {vouchers.map((v) => (
                                <Grid item xs={12} sm={6} md={4} key={v.id}>
                                    <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                        <Box>
                                            <CardGiftcardIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />
                                            <Typography variant="h6" fontWeight={700} sx={{ mt: 1 }}>{v.code}</Typography>
                                            <Typography variant="body2" color="text.secondary">{v.description}</Typography>
                                        </Box>
                                        <Box sx={{ mt: 2 }}>
                                            <Typography variant="h6" color="primary" fontWeight={800}>{v.points_cost} Poin</Typography>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                disabled={currentPoints < v.points_cost || redeeming === v.id}
                                                onClick={() => handleRedeem(v.id)}
                                                sx={{ mt: 1 }}
                                            >
                                                {redeeming === v.id ? 'Memproses...' : (currentPoints < v.points_cost ? 'Poin Kurang' : 'Tukar Poin')}
                                            </Button>
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                            {vouchers.length === 0 && <Typography sx={{ p: 2 }}>Belum ada voucher tersedia.</Typography>}
                        </Grid>
                    </Box>
                )}

                {/* 3. VOUCHER SAYA */}
                {selectedTab === 2 && (
                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            {myVouchers.length === 0 ? (
                                <Typography sx={{ p: 2 }}>Anda belum memiliki voucher.</Typography>
                            ) : (
                                myVouchers.map((uv) => (
                                    <Grid item xs={12} sm={6} md={4} key={uv.id}>
                                        <Paper
                                            elevation={uv.is_used ? 0 : 3}
                                            variant={uv.is_used ? "outlined" : "elevation"}
                                            sx={{
                                                p: 2,
                                                bgcolor: uv.is_used ? '#f5f5f5' : 'white',
                                                opacity: uv.is_used ? 0.7 : 1,
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                                <Typography fontWeight={700} variant="h6">{uv.code}</Typography>
                                                {uv.is_used && <Chip label="Terpakai" size="small" />}
                                            </Box>
                                            <Typography variant="body2">{uv.description}</Typography>
                                            <Typography variant="subtitle2" sx={{ mt: 1, color: 'green' }}>
                                                Diskon: Rp {uv.discount_amount.toLocaleString()}
                                            </Typography>
                                            {!uv.is_used && <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>Gunakan saat pembayaran booking!</Typography>}
                                        </Paper>
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    </Box>
                )}
            </Paper>

        </Container>
    );
};

export default Loyalty;