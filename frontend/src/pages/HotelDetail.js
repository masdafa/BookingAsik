import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // 🚨 Tambahkan useLocation
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  Grid,
  Chip,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import StarIcon from "@mui/icons-material/Star";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MapIcon from "@mui/icons-material/Map";
import FlashOnIcon from "@mui/icons-material/FlashOn"; // Icon untuk Flash Sale
import { Alert, Snackbar } from "@mui/material";
import {
  addFavoriteHotel,
  removeFavoriteHotel,
  isFavoriteHotel,
} from "../utils/favorites";

import RealTimeAvailability from "../features/RealTimeAvailability";
import ReviewSystem from "../features/ReviewSystem";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar";
import api from "../api/axios";
import LoadingPlaceholder from "../components/LoadingPlaceholder";
import "../styles/global.css";

// Helper function untuk format mata uang
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // 🚨 Hook untuk menangkap state navigasi
  const { user } = useAuth();
  const { t } = useTranslation();

  // 🚨 Tangkap state flash sale dari navigasi sebelumnya (dari Deals.js)
  const flashSaleData = location.state || {}; // { flashSalePrice, originalPrice, isFlashSale }

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarHotels, setSimilarHotels] = useState([]);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await api.get(`/hotels/${id}`);
        setHotel(response.data);
        setIsFavorite(isFavoriteHotel(response.data.id));
      } catch (err) {
        console.error("Error fetching hotel:", err);
        setError(t('hotel_not_found'));
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  useEffect(() => {
    const fetchSimilar = async () => {
      if (!hotel?.city) return;
      try {
        const response = await api.get("/hotels");
        const filtered = (response.data || [])
          .filter((h) => h.id !== hotel.id && h.city === hotel.city)
          .slice(0, 3);
        setSimilarHotels(filtered);
      } catch (err) {
        console.error("Fetch similar error:", err);
      }
    };

    fetchSimilar();
  }, [hotel]);

  // 🚨 Hitung Harga Akhir
  const finalPrice = useMemo(() => {
    // Jika ada data flashSalePrice dari state navigasi, gunakan itu
    if (flashSaleData.isFlashSale && flashSaleData.flashSalePrice) {
      return flashSaleData.flashSalePrice;
    }
    // Jika tidak, gunakan harga default hotel dari data yang difetch
    return hotel?.price || 0;
  }, [hotel, flashSaleData]);

  // Harga yang dicoret (harga normal)
  const originalPrice = useMemo(() => {
    return flashSaleData.isFlashSale ? flashSaleData.originalPrice : hotel?.price || 0;
  }, [hotel, flashSaleData]);

  const handleBookNow = () => {
    // 🚨 Kirim HARGA FINAL dan status Flash Sale ke halaman Booking
    navigate(`/booking?hotelId=${hotel.id}`, {
      state: {
        hotel, // Data hotel lengkap
        finalPrice: finalPrice,
        isFlashSale: flashSaleData.isFlashSale || false
      }
    });
  };

  const handleToggleFavorite = () => {
    if (!hotel) return;
    if (isFavorite) {
      removeFavoriteHotel(hotel.id);
      setIsFavorite(false);
      setSnackbar({
        open: true,
        message: t('hotel_removed_favorite'),
        severity: "info",
      });
    } else {
      addFavoriteHotel(hotel);
      setIsFavorite(true);
      setSnackbar({
        open: true,
        message: t('hotel_saved_favorite'),
        severity: "success",
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: hotel?.name,
      text: t('share_text', { hotelName: hotel?.name, city: hotel?.city }),
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Share error:", err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setSnackbar({
        open: true,
        message: t('link_copied'),
        severity: "success",
      });
    }
  };

  const amenities = useMemo(() => {
    if (!hotel?.description) return [];
    const raw = hotel.description
      .replace(/Waktu\s*check\s*in.*$/gim, "")
      .replace(/Waktu\s*check\s*out.*$/gim, "");
    return raw
      .split(/[,;•\-\n]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 3)
      .slice(0, 8);
  }, [hotel]);

  const hasLocation = hotel?.latitude && hotel?.longitude;
  // Perbaikan URL Google Maps
  const mapSrc = hasLocation
    ? `https://maps.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=15&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(
      hotel?.city || "Indonesia"
    )}&z=12&output=embed`;

  const shortDescription =
    hotel?.description?.length > 500 && !showFullDesc
      ? `${hotel.description.substring(0, 500)}...`
      : hotel?.description;

  // LOADING UI
  if (loading) {
    return (
      <>
        <Navbar />
        <Container sx={{ mt: 6 }}>
          <LoadingPlaceholder />
        </Container>
      </>
    );
  }

  // ERROR UI
  if (error || !hotel) {
    return (
      <>
        <Navbar />
        <Container sx={{ mt: 6 }}>
          <Typography variant="h5" color="error">
            {error || t('hotel_not_found')}
          </Typography>
        </Container>
      </>
    );
  }

  // Cek apakah Flash Sale aktif untuk tampilan
  const isFlashSaleActive = flashSaleData.isFlashSale && flashSaleData.flashSalePrice > 0;

  return (
    <>
      <Navbar />

      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        <Paper
          elevation={4}
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: "16px",
            background: "var(--card-bg)",
          }}
        >

          {/* 🔙 BUTTON KEMBALI */}
          <Button
            onClick={() => navigate("/")}
            startIcon={<ArrowBackIcon />}
            sx={{
              mb: 3,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
              background: "#f0f0f0",
              "&:hover": { background: "#e0e0e0" },
            }}
          >
            {t('back')}
          </Button>

          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              {/* JUDUL */}
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 1,
                  fontSize: { xs: "28px", md: "34px" },
                }}
              >
                {hotel.name}
              </Typography>

              {/* LOKASI + ACTIONS */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label={hotel.city} color="primary" variant="outlined" />
                  {hasLocation && (
                    <Chip
                      label={t('coordinates_available')}
                      icon={<MapIcon />}
                      color="success"
                      variant="outlined"
                    />
                  )}
                  {isFlashSaleActive && ( // Tampilkan badge Flash Sale
                    <Chip
                      label={t('flash_sale')}
                      icon={<FlashOnIcon />}
                      color="error"
                      sx={{ fontWeight: 'bold' }}
                    />
                  )}
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Tooltip
                    title={isFavorite ? t('remove_from_favorite') : t('add_to_favorite')}
                  >
                    <IconButton onClick={handleToggleFavorite}>
                      {isFavorite ? (
                        <BookmarkIcon color="primary" />
                      ) : (
                        <BookmarkBorderIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('share')}>
                    <IconButton onClick={handleShare}>
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>

              {/* GAMBAR */}
              {hotel.image && (
                <Box sx={{ mb: 4 }}>
                  <img
                    src={`http://localhost:4000/hotels/${hotel.image}`}
                    alt={hotel.name}
                    style={{
                      width: "100%",
                      height: "420px",
                      objectFit: "cover",
                      borderRadius: "18px",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/800x420?text=No+Image";
                    }}
                  />
                </Box>
              )}
            </Grid>

            {/* SIDE PANEL */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background:
                    "linear-gradient(135deg, rgba(26,115,232,0.1), rgba(0,87,216,0.1))",
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: "#1976d2", width: 48, height: 48 }}>
                    <StarIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      Rating 4.7
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      1200+ {t('guest_reviews_count')}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* 🚨 TAMPILAN HARGA */}
                {isFlashSaleActive && (
                  <Box mb={0.5}>
                    <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                      {t('normal_price')}: {formatCurrency(originalPrice)}
                    </Typography>
                    <Chip
                      label={`${t('save_percentage')} ${Math.round(((originalPrice - finalPrice) / originalPrice) * 100)}%`}
                      size="small"
                      color="error"
                      sx={{ fontWeight: 'bold', mb: 1 }}
                    />
                  </Box>
                )}

                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: isFlashSaleActive ? '#ff385c' : 'var(--primary-color)'
                  }}
                >
                  {formatCurrency(finalPrice)}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {t('per_night_tax')}
                </Typography>

                <Stack spacing={1} mb={3}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocalOfferIcon fontSize="small" color="success" />
                    <Typography variant="body2" color="text.secondary">
                      {t('free_cancellation')}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocalOfferIcon fontSize="small" color="success" />
                    <Typography variant="body2" color="text.secondary">
                      {t('breakfast_wifi_included')}
                    </Typography>
                  </Stack>
                </Stack>

                <RealTimeAvailability
                  hotelId={id}
                  checkIn={new Date()}
                  checkOut={new Date(new Date().setDate(new Date().getDate() + 1))}
                />

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleBookNow} // 🚨 Memanggil fungsi dengan harga final
                  sx={{
                    py: 1.6,
                    fontSize: "16px",
                    fontWeight: 600,
                    borderRadius: "10px",
                    textTransform: "none",
                  }}
                >
                  {t('book_now_button')}
                </Button>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* DESKRIPSI */}
          {hotel.description && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{ mb: 1.5, fontWeight: 700, fontSize: "20px" }}
              >
                {t('description_title')}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.7,
                  fontSize: "16px",
                  color: "var(--text)",
                  whiteSpace: "pre-line",
                }}
              >
                {shortDescription}
              </Typography>
              {hotel.description.length > 500 && (
                <Button
                  variant="text"
                  sx={{ mt: 1, textTransform: "none" }}
                  onClick={() => setShowFullDesc((prev) => !prev)}
                >
                  {showFullDesc ? t('show_less') : t('read_more')}
                </Button>
              )}
            </Box>
          )}

          {/* AMENITIES */}
          {amenities.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
                {t('featured_facilities')}
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {amenities.map((item, index) => (
                  <Chip
                    key={`${item}-${index}`}
                    label={item}
                    sx={{
                      mb: 1,
                      background: "rgba(25,118,210,0.08)",
                      borderRadius: "10px",
                      fontWeight: 600,
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* MAP SECTION */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
              {t('location_title')}
            </Typography>
            <Box
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 10px 35px rgba(0,0,0,0.15)",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <iframe
                title="Hotel Location"
                src={mapSrc}
                style={{ width: "100%", height: 380, border: "none" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Box>
            {!hasLocation && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                {t('coordinates_not_available')}
              </Typography>
            )}
          </Box>

          {/* REVIEWS */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
              {t('guest_reviews_title')}
            </Typography>
            <ReviewSystem hotelId={id} userId={user?.id} />
          </Box>

          {/* SIMILAR HOTELS */}
          {similarHotels.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                {t('other_hotels_in')} {hotel.city}
              </Typography>
              <Grid container spacing={2}>
                {similarHotels.map((item) => (
                  <Grid item xs={12} md={4} key={item.id}>
                    <Paper
                      elevation={3}
                      sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "transform 0.3s",
                        "&:hover": {
                          transform: "translateY(-6px)",
                        },
                      }}
                      onClick={() => navigate(`/hotel/${item.id}`)}
                    >
                      <Box sx={{ height: 150, overflow: "hidden" }}>
                        <img
                          src={`http://localhost:4000/hotels/${item.image}`}
                          alt={item.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/400x200?text=Hotel";
                          }}
                        />
                      </Box>
                      <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.city}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, mt: 1, color: "#2e7d32" }}
                        >
                          Rp {item.price?.toLocaleString("id-ID")}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Paper>
      </Container >

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}