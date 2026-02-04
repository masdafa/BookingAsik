import React, { useEffect, useState } from "react";
import {
    Container,
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Grid,
    Chip,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Card,
    CardContent,
    CardMedia,
    Badge,
} from "@mui/material";
import { motion } from "framer-motion"; // Animation Import
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import HotelMap from "../components/HotelMap";
import FlashSale from '../features/FlashSale';
import { useAuth } from '../context/AuthContext';
import { getLoyaltyPoints } from '../utils/loyalty';
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import api from "../api/axios";
import TravelAssistant from "../features/TravelAssistant";
import Footer from "../components/Footer";
import FlashSalePopup from "../components/FlashSalePopup";

// Icons
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StarIcon from "@mui/icons-material/Star";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import "../styles/global.css";


// --- Data Dasar ---
const popularCities = ["Jakarta", "Bandung", "Bali", "Yogyakarta", "Surabaya", "Medan"];

// --- Loyalty Helper Functions & Data ---
const LOYALTY_TIERS = [
    { name: 'Bronze', requiredPoints: 0, color: 'default' },
    { name: 'Silver', requiredPoints: 500, color: 'info' },
    { name: 'Gold', requiredPoints: 2000, color: 'warning' },
];

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

// --- Komponen Display Loyalty Status (DIMODIFIKASI UNTUK FULL WIDTH) ---
const LoyaltyStatusBox = ({ points, tier }) => {
    const { t } = useTranslation();
    return (
        <Box
            // Menggunakan kelas CSS 'loyalty-card' untuk styling full width
            className="loyalty-card"
            sx={{
                p: 3,
                borderRadius: 0, // Hapus radius agar full width tepi ke tepi
                background: 'linear-gradient(90deg, #1e88e5 0%, #42a5f5 100%)',
                color: 'white',
                width: '100%',
                // Tambahkan padding horizontal agar konten tidak menempel ke tepi browser
                px: { xs: 2, sm: 4, md: 6 }
            }}
        >
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={12} sm={6} md={8}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                        {t('your_loyalty_status')}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                        <StarIcon sx={{ color: 'yellow', fontSize: 28 }} />
                        <Typography variant="h4" fontWeight={800}>
                            {tier.name.toUpperCase()}
                        </Typography>
                        <Chip
                            label={t('see_detail')}
                            size="small"
                            variant="outlined"
                            sx={{ color: 'white', borderColor: 'white', ml: 2, cursor: 'pointer' }}
                            component={RouterLink}
                            to="/loyalty"
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={4} sx={{ textAlign: { xs: 'left', sm: 'right' }, mt: { xs: 2, sm: 0 } }}>
                    <Box display="flex" alignItems="center" justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
                        <AccountBalanceWalletIcon sx={{ fontSize: 28, mr: 1 }} />
                        <Typography variant="h5" fontWeight={800}>
                            {points.toLocaleString('id-ID')} {t('points')}
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                        {t('points_available_desc')}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
};


export default function Home() {
    const { t } = useTranslation();
    const { user, loading: authLoading } = useAuth();
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);

    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [destination, setDestination] = useState("");
    const [checkIn, setCheckIn] = useState(null);
    const [checkOut, setCheckOut] = useState(null);
    const [priceRange, setPriceRange] = useState([0, 10000000]);
    const [sortBy, setSortBy] = useState("popular");
    const [selectedCity, setSelectedCity] = useState("");
    const [showFlashSalePopup, setShowFlashSalePopup] = useState(false);

    // Check if user just logged in and show flash sale popup
    useEffect(() => {
        if (user && !authLoading) {
            // Check if this is a fresh login by comparing login timestamp
            const lastLoginTime = localStorage.getItem('lastLoginTime');
            const currentLoginTime = localStorage.getItem('currentLoginTime');

            // If currentLoginTime is set and different from lastLoginTime, it's a fresh login
            if (currentLoginTime && currentLoginTime !== lastLoginTime) {
                // Show popup after a small delay
                const timer = setTimeout(() => {
                    setShowFlashSalePopup(true);
                    // Mark this login as seen
                    localStorage.setItem('lastLoginTime', currentLoginTime);
                }, 500);
                return () => clearTimeout(timer);
            }
        }
    }, [user, authLoading]);

    // --- Efek dan Logika Data ---

    // NEW EFFECT: Ambil Loyalty Points
    useEffect(() => {
        if (!user || authLoading) {
            setLoyaltyPoints(0);
            return;
        }

        const updatePoints = () => {
            // Prioritize user.points from DB (via Context), fallback to helper if needed (though helper is local-only)
            const currentPoints = (user && user.points !== undefined) ? user.points : 0;
            setLoyaltyPoints(currentPoints);
        };

        updatePoints();
        window.addEventListener('loyalty-updated', updatePoints);
        return () => {
            window.removeEventListener('loyalty-updated', updatePoints);
        };
    }, [user, authLoading]);


    useEffect(() => {
        let mounted = true;

        const fetchHotels = async () => {
            try {
                const res = await api.get("/hotels");
                if (mounted) {
                    const hotelsData = res.data || [];
                    setHotels(hotelsData);
                    setFilteredHotels(hotelsData);
                    const maxPrice = Math.max(...hotelsData.map((h) => h.price || 0), 10000000);
                    setPriceRange([0, maxPrice]);
                }
            } catch (err) {
                console.error("API error:", err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchHotels();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        applyFilters();
    }, [destination, priceRange, sortBy, selectedCity, hotels]);

    const applyFilters = () => {
        let result = [...hotels];

        // Filter by destination
        if (destination.trim()) {
            result = result.filter(
                (h) =>
                    h.city?.toLowerCase().includes(destination.toLowerCase()) ||
                    h.name?.toLowerCase().includes(destination.toLowerCase())
            );
        }

        // Filter by city (quick filter)
        if (selectedCity) {
            result = result.filter((h) => h.city?.toLowerCase() === selectedCity.toLowerCase());
        }

        // Filter by price range
        result = result.filter((h) => {
            const price = h.price || 0;
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // Sort
        switch (sortBy) {
            case "price-low":
                result.sort((a, b) => (a.price || 0) - (b.price || 0));
                break;
            case "price-high":
                result.sort((a, b) => (b.price || 0) - (a.price || 0));
                break;
            case "name":
                result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
                break;
            default:
                // Popular (default - by ID atau bisa pakai rating jika ada)
                break;
        }

        setFilteredHotels(result);
    };

    const handleSearch = () => {
        applyFilters();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Logika untuk Hotel Unggulan (Memprioritaskan Flash Sale)
    const getFeaturedHotels = () => {
        const flashSaleHotels = hotels.filter(h => h.isFlashSale);

        if (flashSaleHotels.length > 0) {
            // Prioritas: Tampilkan 3 hotel Flash Sale teratas
            return flashSaleHotels
                .sort((a, b) => (a.price || 0) - (b.price || 0))
                .slice(0, 3);
        }

        // Default: Tampilkan 3 hotel termurah
        return [...hotels]
            .sort((a, b) => (a.price || 0) - (b.price || 0))
            .slice(0, 3);
    };

    const featuredHotels = getFeaturedHotels();
    const currentTier = getCurrentTier(loyaltyPoints); // Hitung tier

    // Komponen Card Hotel yang sudah dimodifikasi untuk Flash Sale
    const FlashSaleHotelCard = ({ hotel }) => {
        const discountedPrice = hotel.price || 0;
        // Menggunakan hotel.originalPrice jika ada, jika tidak, anggap harga diskon = harga normal
        const originalPrice = hotel.originalPrice || discountedPrice;

        const discountPercentage = hotel.isFlashSale && originalPrice > discountedPrice
            ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
            : 0;

        return (
            <Card
                component={RouterLink}
                to={`/hotel/${hotel.id}`}
                sx={{
                    height: "100%",
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: hotel.isFlashSale ? "0 4px 15px rgba(255, 69, 0, 0.4)" : 3, // Shadow merah untuk Flash Sale
                    position: "relative",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: 6,
                    },
                }}
            >
                <Box sx={{ position: "relative", width: "100%", height: 250, overflow: "hidden" }}>
                    {hotel.isFlashSale && discountPercentage > 0 && (
                        <Badge
                            badgeContent={`${t('save_badge')} ${discountPercentage}%`}
                            color="error"
                            sx={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                zIndex: 2,
                                "& .MuiBadge-badge": {
                                    fontSize: "0.8rem",
                                    fontWeight: 700,
                                    backgroundColor: "#ff385c",
                                    padding: "4px 8px",
                                    borderRadius: "8px",
                                },
                            }}
                        />
                    )}
                    <CardMedia
                        component="img"
                        image={`http://localhost:4000/hotels/${hotel.image}`}
                        alt={hotel.name}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.3s",
                            "&:hover": {
                                transform: "scale(1.1)",
                            },
                        }}
                    />
                </Box>
                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: hotel.isFlashSale ? "#ff385c" : 'inherit' }}>
                        {hotel.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                        <StarIcon sx={{ color: "#ffc107", fontSize: 18 }} />
                        <Typography variant="body2" color="text.secondary">
                            4.5 (120 {t('reviews_count')})
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {hotel.city}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mt: "auto" }}>
                        {hotel.isFlashSale && originalPrice > discountedPrice && (
                            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                                {formatCurrency(originalPrice)}
                            </Typography>
                        )}
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 800, color: hotel.isFlashSale ? "#2e7d32" : "#1976d2" }}
                        >
                            {formatCurrency(discountedPrice)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {t('night')}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    };
    // --- Akhir Komponen Card ---

    return (
        <>
            <Navbar />

            {/* Flash Sale Popup - Shows after login */}
            <FlashSalePopup
                show={showFlashSalePopup}
                onClose={() => setShowFlashSalePopup(false)}
            />

            {/* =======================================================
              1. HERO SECTION (FULL WIDTH)
              ======================================================== */}
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ borderRadius: 0 }}
            >
                <Box
                    className="hero" // Menerapkan style Full-Width & Background dari global.css
                    sx={{ py: { xs: 4, md: 8 }, mt: -0.5, display: 'flex', alignItems: 'center', borderRadius: 0 }}
                >
                    <Container maxWidth="lg" className="hero-content" sx={{ textAlign: 'center' }}>
                        {/* MODIFIKASI H1: Mengubah ke h2 dan menambahkan textShadow yang tegas */}
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 800,
                                color: 'white',
                                mb: 0.5,
                                textShadow: "0 0 5px rgba(58, 209, 255, 1), 0 0 15px rgba(0, 59, 149, 0.7), 0 4px 10px rgba(0, 0, 0, 0.7)",
                            }}
                        >
                            {t('find_your_perfect_stay')}
                        </Typography>

                        {/* MODIFIKASI P: Mengubah ke h6 dan menambahkan textShadow halus */}
                        <Typography
                            variant="h6"
                            sx={{
                                mt: 1,
                                color: 'white',
                                fontWeight: 600,
                                textShadow: "0 1px 3px rgba(0, 0, 0, 0.9)",
                                mb: 4,
                            }}
                        >
                            {t('best_hotels_verified_reviews')}
                        </Typography>

                        {/* SEARCH BAR - Glassmorphism blur transparan */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 2, md: 3 },
                                mt: 0,
                                borderRadius: "16px",
                                backdropFilter: "blur(25px)",
                                WebkitBackdropFilter: "blur(25px)",
                                background: "rgba(255, 255, 255, 0.15)",
                                border: "1px solid rgba(255, 255, 255, 0.25)",
                                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                                transition: "0.25s ease",
                                "&:hover": {
                                    background: "rgba(255, 255, 255, 0.2)",
                                    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.2)",
                                },
                            }}
                        >
                            <Grid container spacing={2} alignItems="center">
                                {/* DESTINATION FIELD */}
                                <Grid item xs={12} sm={4}>
                                    <TextField fullWidth label={t('destination')} placeholder={t('search_hotels_or_destinations')} value={destination} onChange={(e) => setDestination(e.target.value)}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "12px",
                                                background: "rgba(255, 255, 255, 0.85)",
                                                backdropFilter: "blur(10px)",
                                            },
                                            "& .MuiInputLabel-root": { color: "#666" },
                                        }} />
                                </Grid>

                                {/* DATE PICKERS */}
                                <Grid item xs={12} sm={3}> {/* Check In */}
                                    <Box sx={{
                                        position: 'relative',
                                        "& .react-datepicker-wrapper": { width: "100%" },
                                        "& .react-datepicker__input-container": { position: 'relative' },
                                        "& .react-datepicker__input-container input": {
                                            width: "100%",
                                            padding: "16.5px 14px 16.5px 44px",
                                            borderRadius: "12px",
                                            border: "1px solid rgba(0, 0, 0, 0.23)",
                                            background: "rgba(255, 255, 255, 0.95)",
                                            fontSize: "1rem",
                                            fontFamily: 'inherit',
                                            color: '#333',
                                            outline: 'none',
                                            transition: 'all 0.2s ease',
                                            "&:focus": {
                                                borderColor: '#003b95',
                                                boxShadow: '0 0 0 3px rgba(0, 59, 149, 0.15)',
                                            },
                                            "&::placeholder": { color: "#999", opacity: 1 },
                                        },
                                        "&::before": {
                                            content: '"📅"',
                                            position: 'absolute',
                                            left: '14px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            fontSize: '1.2rem',
                                            zIndex: 1,
                                            pointerEvents: 'none',
                                        },
                                    }}>
                                        <DatePicker
                                            selected={checkIn}
                                            onChange={(date) => setCheckIn(date)}
                                            selectsStart
                                            startDate={checkIn}
                                            endDate={checkOut}
                                            minDate={new Date()}
                                            placeholderText={t('check_in')}
                                            dateFormat="dd/MM/yyyy"
                                            wrapperClassName="date-picker-wrapper"
                                        />
                                    </Box>
                                </Grid>

                                <Grid item xs={12} sm={3}> {/* Check Out */}
                                    <Box sx={{
                                        position: 'relative',
                                        "& .react-datepicker-wrapper": { width: "100%" },
                                        "& .react-datepicker__input-container": { position: 'relative' },
                                        "& .react-datepicker__input-container input": {
                                            width: "100%",
                                            padding: "16.5px 14px 16.5px 44px",
                                            borderRadius: "12px",
                                            border: "1px solid rgba(0, 0, 0, 0.23)",
                                            background: "rgba(255, 255, 255, 0.95)",
                                            fontSize: "1rem",
                                            fontFamily: 'inherit',
                                            color: '#333',
                                            outline: 'none',
                                            transition: 'all 0.2s ease',
                                            "&:focus": {
                                                borderColor: '#003b95',
                                                boxShadow: '0 0 0 3px rgba(0, 59, 149, 0.15)',
                                            },
                                            "&::placeholder": { color: "#999", opacity: 1 },
                                        },
                                        "&::before": {
                                            content: '"📅"',
                                            position: 'absolute',
                                            left: '14px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            fontSize: '1.2rem',
                                            zIndex: 1,
                                            pointerEvents: 'none',
                                        },
                                    }}>
                                        <DatePicker
                                            selected={checkOut}
                                            onChange={(date) => setCheckOut(date)}
                                            selectsEnd
                                            startDate={checkIn}
                                            endDate={checkOut}
                                            minDate={checkIn || new Date()}
                                            placeholderText={t('check_out')}
                                            dateFormat="dd/MM/yyyy"
                                        />
                                    </Box>
                                </Grid>

                                {/* SEARCH BUTTON */}
                                <Grid item xs={12} sm={2}>
                                    <Button variant="contained" fullWidth onClick={handleSearch}
                                        sx={{
                                            py: 1.9, borderRadius: "12px", fontSize: "15px", fontWeight: 600, letterSpacing: "0.4px", background: "linear-gradient(135deg, #1a73e8, #0057d8)", boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                            "&:hover": { background: "linear-gradient(135deg, #1668d4, #004fc4)", transform: "scale(1.03)", }, transition: "0.15s ease",
                                        }}>{t('search_button')}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Container>
                </Box>
            </motion.div>

            {/* =======================================================
              2. LOYALTY & FLASH SALE SECTION (FULL WIDTH)
              ======================================================== */}
            {/* Menggunakan Box tanpa max-width untuk menahan komponen full width */}
            <Box component="section" sx={{ mt: 0 }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >

                    {/* LOYALTY STATUS BOX - Component sudah dimodifikasi untuk full width */}
                    {user && !authLoading && (
                        <Box sx={{ mb: 0 }}>
                            <LoyaltyStatusBox points={loyaltyPoints} tier={currentTier} />
                        </Box>
                    )}

                    {/* FLASH SALE BANNER - Komponen FlashSale harus menghasilkan element full width */}
                    <Box sx={{ mb: 0 }}>
                        <FlashSale />
                    </Box>
                </motion.div>
            </Box>


            {/* =======================================================
              3. MAIN CONTENT (Filter, Featured Hotels, Map, List)
              ======================================================== */}
            {/* Konten sisa halaman dibungkus Container untuk membatasi lebar */}
            <Container maxWidth="lg" sx={{ mt: 4 }}>

                {/* QUICK FILTERS - POPULAR DESTINATIONS - ENHANCED */}
                <Box mt={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 15px rgba(238, 90, 36, 0.3)',
                            }}
                        >
                            <Typography sx={{ fontSize: '1.2rem' }}>📍</Typography>
                        </Box>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            {t('popular_destinations_icon')}
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                        <Chip
                            label={t('filter_all')}
                            onClick={() => setSelectedCity("")}
                            sx={{
                                mb: 1,
                                px: 2,
                                py: 2.5,
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                borderRadius: '12px',
                                background: selectedCity === ""
                                    ? 'linear-gradient(135deg, #003b95 0%, #1a73e8 100%)'
                                    : 'rgba(255, 255, 255, 0.9)',
                                color: selectedCity === "" ? 'white' : '#333',
                                border: selectedCity === "" ? 'none' : '1px solid #e0e0e0',
                                boxShadow: selectedCity === ""
                                    ? '0 4px 15px rgba(0, 59, 149, 0.3)'
                                    : '0 2px 8px rgba(0, 0, 0, 0.08)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: selectedCity === ""
                                        ? '0 6px 20px rgba(0, 59, 149, 0.4)'
                                        : '0 4px 15px rgba(0, 0, 0, 0.12)',
                                    background: selectedCity === ""
                                        ? 'linear-gradient(135deg, #002d75 0%, #1565c0 100%)'
                                        : 'rgba(255, 255, 255, 1)',
                                },
                            }}
                        />
                        {popularCities.map((city) => (
                            <Chip
                                key={city}
                                label={city}
                                onClick={() => setSelectedCity(city)}
                                sx={{
                                    mb: 1,
                                    px: 2,
                                    py: 2.5,
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    borderRadius: '12px',
                                    background: selectedCity === city
                                        ? 'linear-gradient(135deg, #003b95 0%, #1a73e8 100%)'
                                        : 'rgba(255, 255, 255, 0.9)',
                                    color: selectedCity === city ? 'white' : '#333',
                                    border: selectedCity === city ? 'none' : '1px solid #e0e0e0',
                                    boxShadow: selectedCity === city
                                        ? '0 4px 15px rgba(0, 59, 149, 0.3)'
                                        : '0 2px 8px rgba(0, 0, 0, 0.08)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: selectedCity === city
                                            ? '0 6px 20px rgba(0, 59, 149, 0.4)'
                                            : '0 4px 15px rgba(0, 0, 0, 0.12)',
                                        background: selectedCity === city
                                            ? 'linear-gradient(135deg, #002d75 0%, #1565c0 100%)'
                                            : 'rgba(255, 255, 255, 1)',
                                    },
                                }}
                            />
                        ))}
                    </Stack>
                </Box>

                {/* FILTERS & SORT SECTION - ENHANCED */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            mt: 4,
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
                            border: '1px solid rgba(0, 0, 0, 0.06)',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <Grid container spacing={4} alignItems="center">
                            {/* PRICE RANGE SLIDER */}
                            <Grid item xs={12} md={7}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                    <Box
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: '10px',
                                            background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 4px 12px rgba(0, 184, 148, 0.3)',
                                        }}
                                    >
                                        <Typography sx={{ fontSize: '1rem' }}>💰</Typography>
                                    </Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                                        {t('price_range_label')}
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    px: 2,
                                    py: 2,
                                    background: 'rgba(0, 59, 149, 0.04)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(0, 59, 149, 0.08)',
                                }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            color: '#003b95',
                                            mb: 2,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {formatCurrency(priceRange[0])} — {formatCurrency(priceRange[1])}
                                    </Typography>
                                    <Slider
                                        value={priceRange}
                                        onChange={(e, newValue) => setPriceRange(newValue)}
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={(value) => formatCurrency(value)}
                                        min={0}
                                        max={Math.max(...hotels.map((h) => h.price || 0), 10000000)}
                                        sx={{
                                            color: "#003b95",
                                            height: 8,
                                            '& .MuiSlider-track': {
                                                background: 'linear-gradient(90deg, #003b95 0%, #1a73e8 100%)',
                                                border: 'none',
                                            },
                                            '& .MuiSlider-rail': {
                                                background: '#e0e0e0',
                                            },
                                            '& .MuiSlider-thumb': {
                                                width: 24,
                                                height: 24,
                                                background: 'white',
                                                border: '3px solid #003b95',
                                                boxShadow: '0 2px 10px rgba(0, 59, 149, 0.3)',
                                                '&:hover': {
                                                    boxShadow: '0 4px 15px rgba(0, 59, 149, 0.4)',
                                                },
                                            },
                                            '& .MuiSlider-valueLabel': {
                                                background: '#003b95',
                                                borderRadius: '8px',
                                                fontWeight: 600,
                                            },
                                        }}
                                    />
                                </Box>
                            </Grid>

                            {/* SORT BY */}
                            <Grid item xs={12} md={5}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                    <Box
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: '10px',
                                            background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 4px 12px rgba(108, 92, 231, 0.3)',
                                        }}
                                    >
                                        <Typography sx={{ fontSize: '1rem' }}>🔄</Typography>
                                    </Box>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
                                        {t('sort_by')}
                                    </Typography>
                                </Box>
                                <FormControl fullWidth>
                                    <Select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        displayEmpty
                                        sx={{
                                            borderRadius: '12px',
                                            background: 'white',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(0, 0, 0, 0.1)',
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#003b95',
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#003b95',
                                                borderWidth: '2px',
                                            },
                                            '& .MuiSelect-select': {
                                                py: 1.5,
                                                fontWeight: 600,
                                            },
                                        }}
                                    >
                                        <MenuItem value="popular">{t('sort_popular')}</MenuItem>
                                        <MenuItem value="price-low">{t('sort_price_low')}</MenuItem>
                                        <MenuItem value="price-high">{t('sort_price_high')}</MenuItem>
                                        <MenuItem value="name">{t('sort_name')}</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Paper>
                </motion.div>

                {/* FEATURED HOTELS / BEST DEALS */}
                {featuredHotels.length > 0 && (
                    <Box mt={5}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                                <LocalOfferIcon sx={{ color: "#ed6c02", fontSize: 28 }} />
                                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                    {hotels.some(h => h.isFlashSale) ? t('flash_deals_title') : t('best_deals')}
                                </Typography>
                            </Box>
                            <Grid container spacing={3}>
                                {featuredHotels.map((hotel) => (
                                    <Grid item xs={12} md={4} key={hotel.id}>
                                        <FlashSaleHotelCard hotel={hotel} />
                                    </Grid>
                                ))}
                            </Grid>
                        </motion.div>
                    </Box>
                )}

                {/* MAP SECTION */}
                <Box mt={5}>
                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                        {t('hotel_in_destination_icon')}
                    </Typography>
                    <HotelMap hotels={filteredHotels} />
                </Box>

                {/* LIST SECTION */}
                <Box mt={5} sx={{ mb: 8 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                {t('popular_hotels')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {filteredHotels.length} {t('hotels_found')}
                            </Typography>
                        </Box>

                        {loading ? (
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={4}><LoadingPlaceholder /></Grid>
                                <Grid item xs={12} sm={6} md={4}><LoadingPlaceholder /></Grid>
                            </Grid>
                        ) : filteredHotels.length === 0 ? (
                            <Paper sx={{ p: 4, textAlign: "center" }}>
                                <Typography variant="h6" color="text.secondary">
                                    {t('no_hotels_found')}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    {t('try_adjusting_filters')}
                                </Typography>
                            </Paper>
                        ) : (
                            <div className="grid-cards">
                                {filteredHotels.map((h) => (
                                    <FlashSaleHotelCard key={h.id} hotel={h} />
                                ))}
                            </div>
                        )}
                    </motion.div>
                </Box>

            </Container >

            {/* Footer */}
            <Footer />

            {/* Floating Travel Assistant */}
            < TravelAssistant />
        </>
    );
}