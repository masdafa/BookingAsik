import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Badge,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import FlashSale from '../features/FlashSale';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import api from '../api/axios';

// --- SIMULASI KOMPONEN HOTEL CARD KHUSUS FLASH SALE ---
const FlashSaleHotelCard = ({ hotel }) => {
  const navigate = useNavigate(); // <-- Tambahkan hook useNavigate

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const discountedPrice = hotel.price || 0;
  const originalPrice = hotel.originalPrice || discountedPrice * 1.5;

  const discountPercentage = originalPrice > discountedPrice
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

  // 🚨 FUNGSI BARU UNTUK NAVIGASI DAN MENGIRIM HARGA
  const handleCardClick = () => {
    navigate(`/hotel/${hotel.id}`, {
      state: {
        flashSalePrice: discountedPrice,
        originalPrice: originalPrice,
        isFlashSale: true
      }
    });
  };

  return (
    <Card
      // Hapus component={RouterLink} dan to={`/hotel/${hotel.id}`}
      onClick={handleCardClick} // <-- Gunakan onClick dengan useNavigate
      sx={{
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 4px 15px rgba(255, 69, 0, 0.4)",
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
        {discountPercentage > 0 && (
          <Badge
            badgeContent={`SALE ${discountPercentage}%`}
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
          image={hotel.image ? `http://localhost:4000/hotels/${hotel.image}` : 'placeholder-image.jpg'}
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
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#ff385c" }}>
          {hotel.name}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
          <StarIcon sx={{ color: "#ffc107", fontSize: 18 }} />
          <Typography variant="body2" color="text.secondary">
            {hotel.rating || '4.5'} ({hotel.reviewCount || '120'} reviews)
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {hotel.city}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mt: "auto" }}>
          <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
            {formatCurrency(originalPrice)}
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: "#2e7d32" }}
          >
            {formatCurrency(discountedPrice)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            /night
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

// --- KOMPONEN UTAMA DEALS ---
export default function Deals() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [flashSaleHotels, setFlashSaleHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Flash Sales');

  useEffect(() => {
    let mounted = true;

    const fetchFlashSales = async () => {
      try {
        const res = await api.get("/hotels");

        if (mounted) {
          const allHotels = res.data || [];

          const simulatedFlashSales = allHotels.filter(h => h.isFlashSale);

          if (simulatedFlashSales.length === 0 && allHotels.length > 0) {
            // Simulasi 3 deal jika API tidak mengembalikan isFlashSale
            const simulatedDeals = [
              { ...allHotels[0], id: allHotels[0].id, isFlashSale: true, price: (allHotels[0].price * 0.5), originalPrice: allHotels[0].price },
              { ...allHotels[1], id: allHotels[1].id, isFlashSale: true, price: (allHotels[1].price * 0.6), originalPrice: allHotels[1].price },
              { ...allHotels[2], id: allHotels[2].id, isFlashSale: true, price: (allHotels[2].price * 0.7), originalPrice: allHotels[2].price },
            ].filter(h => h.price);
            setFlashSaleHotels(simulatedDeals);
          } else {
            setFlashSaleHotels(simulatedFlashSales);
          }
        }
      } catch (err) {
        console.error("Error fetching deals:", err);
        setFlashSaleHotels([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFlashSales();

    return () => {
      mounted = false;
    };
  }, []);

  const getHotelsForActiveTab = () => {
    if (activeTab === 'Flash Sales') {
      return flashSaleHotels;
    }
    return [];
  }

  const currentHotels = getHotelsForActiveTab();

  return (
    <Container sx={{ mt: 4, minHeight: '80vh' }}>
      {/* Tombol Kembali ke Home */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        {t('back_to_home')}
      </Button>

      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
        {t('special_deals_title')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        {t('special_deals_subtitle')}
      </Typography>

      <FlashSale />

      {/* Navigasi Tab Deals */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Grid container spacing={2}>
          {['all_deals', 'flash_sales', 'package_deals', 'last_minute'].map((tabKey) => (
            <Grid item key={tabKey}>
              <Button
                variant={activeTab === t(`tab_${tabKey}`) ? 'contained' : 'text'}
                onClick={() => setActiveTab(t(`tab_${tabKey}`))}
                sx={{
                  bgcolor: activeTab === t(`tab_${tabKey}`) ? 'primary.main' : 'transparent',
                  color: activeTab === t(`tab_${tabKey}`) ? 'white' : 'text.primary',
                  '&:hover': {
                    bgcolor: activeTab === t(`tab_${tabKey}`) ? 'primary.dark' : 'action.hover'
                  }
                }}
              >
                {t(`tab_${tabKey}`)}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Daftar Hotel */}
      <Box mt={4}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center' }}>
          <LocalOfferIcon color="error" sx={{ mr: 1 }} />
          {activeTab} ({currentHotels.length} offers)
        </Typography>

        {loading ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}><LoadingPlaceholder /></Grid>
            <Grid item xs={12} sm={6} md={4}><LoadingPlaceholder /></Grid>
          </Grid>
        ) : currentHotels.length > 0 ? (
          <Grid container spacing={4}>
            {currentHotels.map((hotel) => (
              <Grid item xs={12} sm={6} lg={4} key={hotel.id}>
                <FlashSaleHotelCard hotel={hotel} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#fff3e0', border: '1px solid #ff9800' }}>
            <Typography variant="h6" color="text.secondary">
              {t('no_deals_available')}
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
}