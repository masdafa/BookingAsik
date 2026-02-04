import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Stack,
  Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addDays, differenceInCalendarDays, format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';
import api from "../api/axios";
import { useTranslation } from "react-i18next";

// Icons
import QrCodeIcon from '@mui/icons-material/QrCode2';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Helper for currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const Booking = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const hotelId = paramId || searchParams.get('hotelId') || location.state?.hotel?.id;

  const navigate = useNavigate();
  const { user, fetchUser } = useAuth();

  // Initial Hotel State from location or null
  const [hotel, setHotel] = useState(location.state?.hotel || null);

  // Booking Form State
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // UI State
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('qris');

  // Voucher State
  const [myVouchers, setMyVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState('');
  const [discount, setDiscount] = useState(0);

  // Prefill User Data
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Fetch Hotel & Vouchers
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 1. Fetch Hotel if not already in state
        if (!hotel) {
          const hotelRes = await api.get(`/hotels/${hotelId}`);
          setHotel(hotelRes.data);
        }

        // 2. Fetch User Vouchers
        if (user) {
          const voucherRes = await api.get('/vouchers/my');
          setMyVouchers(voucherRes.data.filter(v => !v.is_used));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Gagal memuat data booking.");
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) {
      fetchInitialData();
    } else {
      setLoading(false);
      setError("Hotel ID tidak ditemukan.");
    }
  }, [hotelId, user]); // Removed 'hotel' from dependency to avoid loop if hotel is set

  // Handle Voucher Change
  const handleVoucherChange = (e) => {
    const voucherId = e.target.value;
    setSelectedVoucher(voucherId);

    if (voucherId) {
      const voucher = myVouchers.find(v => v.id === voucherId);
      setDiscount(voucher ? voucher.discount_amount : 0);
    } else {
      setDiscount(0);
    }
  };

  // Calculations
  const nights = checkIn && checkOut ? differenceInCalendarDays(checkOut, checkIn) : 0;
  // Price logic: verification against flash sale price in state
  const pricePerNight = location.state?.finalPrice || (hotel ? hotel.price_per_night : 0);
  const subtotal = nights * rooms * pricePerNight;
  const taxes = subtotal * 0.1;
  const totalPrice = Math.max(0, subtotal + taxes - discount);

  const handleNext = () => {
    if (activeStep === 0) {
      if (!checkIn || !checkOut || !name || !email) {
        alert("Mohon lengkapi semua data");
        return;
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleBooking = async () => {
    if (!user) {
      alert("Silakan login untuk memesan");
      navigate('/login');
      return;
    }

    try {
      await api.post('/bookings', {
        user_id: user.id,
        hotel_id: parseInt(hotelId),
        check_in: format(checkIn, 'yyyy-MM-dd'),
        check_out: format(checkOut, 'yyyy-MM-dd'),
        total_price: totalPrice,
        rooms: rooms,
        voucher_id: selectedVoucher || null
      });

      // Update user data
      await fetchUser();

      // Navigate to Success Page with State
      navigate('/booking-success', {
        state: {
          hotel,
          form: { name, email, checkIn: format(checkIn, 'yyyy-MM-dd'), checkOut: format(checkOut, 'yyyy-MM-dd'), rooms, guests },
          estimatedTotal: totalPrice,
          paymentMethod
        }
      });
    } catch (err) {
      console.error("Booking failed:", err);
      alert(err.response?.data?.message || "Booking Gagal");
    }
  };

  if (loading) return <Container sx={{ py: 10 }}><Typography>Loading...</Typography></Container>;
  if (error) return <Container sx={{ py: 10 }}><Alert severity="error">{error}</Alert></Container>;
  if (!hotel) return <Container sx={{ py: 10 }}><Typography>Hotel tidak ditemukan</Typography></Container>;

  const steps = ['Data Tamu', 'Metode Bayar', 'Review & Bayar'];

  // Payment Options Data
  const paymentOptions = [
    { value: "qris", label: "QRIS", icon: <QrCodeIcon fontSize="large" />, color: "#ff8c00" },
    { value: "gopay", label: "GoPay", icon: <PaymentIcon fontSize="large" />, color: "#00c4ff" },
    { value: "transfer", label: "Bank Transfer", icon: <AccountBalanceIcon fontSize="large" />, color: "#31b057" },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={id}>
      <Container maxWidth="lg" sx={{ py: 4 }}>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={4}>
          {/* KIRI: Main Content */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 4, mb: 3 }}>

              {/* STEP 0: DATA TAMU */}
              {activeStep === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom fontWeight={700}>Informasi Tamu</Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                      <TextField label="Nama Lengkap" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Grid>
                  </Grid>

                  <Typography variant="h6" gutterBottom fontWeight={700} sx={{ mt: 2 }}>Detail Menginap</Typography>
                  <Box display="flex" gap={2} mb={3}>
                    <DatePicker
                      label="Check-in"
                      value={checkIn}
                      onChange={(newValue) => setCheckIn(newValue)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                      minDate={new Date()}
                    />
                    <DatePicker
                      label="Check-out"
                      value={checkOut}
                      onChange={(newValue) => setCheckOut(newValue)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                      minDate={checkIn ? addDays(checkIn, 1) : new Date()}
                    />
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Jumlah Kamar"
                        type="number"
                        fullWidth
                        InputProps={{ inputProps: { min: 1 } }}
                        value={rooms}
                        onChange={(e) => setRooms(parseInt(e.target.value) || 1)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Tamu"
                        type="number"
                        fullWidth
                        InputProps={{ inputProps: { min: 1 } }}
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* STEP 1: PEMBAYARAN */}
              {activeStep === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom fontWeight={700}>Pilih Metode Pembayaran</Typography>
                  <Grid container spacing={2}>
                    {paymentOptions.map((opt) => (
                      <Grid item xs={12} sm={4} key={opt.value}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 3,
                            border: `2px solid ${paymentMethod === opt.value ? opt.color : '#e0e0e0'}`,
                            borderRadius: 3,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                            bgcolor: paymentMethod === opt.value ? `${opt.color}10` : 'white',
                            '&:hover': { transform: 'translateY(-4px)', boxShadow: 2 }
                          }}
                          onClick={() => setPaymentMethod(opt.value)}
                        >
                          <Box sx={{ color: opt.color }}>{opt.icon}</Box>
                          <Typography fontWeight={600} align="center">{opt.label}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* STEP 2: REVIEW */}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom fontWeight={700}>Review Pesanan</Typography>
                  <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}><Typography color="textSecondary">Nama:</Typography> <Typography fontWeight={600}>{name}</Typography></Grid>
                      <Grid item xs={6}><Typography color="textSecondary">Email:</Typography> <Typography fontWeight={600}>{email}</Typography></Grid>
                      <Grid item xs={6}><Typography color="textSecondary">Check-in:</Typography> <Typography fontWeight={600}>{checkIn ? format(checkIn, 'dd MMM yyyy') : '-'}</Typography></Grid>
                      <Grid item xs={6}><Typography color="textSecondary">Check-out:</Typography> <Typography fontWeight={600}>{checkOut ? format(checkOut, 'dd MMM yyyy') : '-'}</Typography></Grid>
                    </Grid>
                  </Paper>

                  {/* VOUCHER SECTION IN REVIEW */}
                  <Box sx={{ mt: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <CardGiftcardIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" fontWeight={700}>Voucher Diskon</Typography>
                    </Box>
                    {myVouchers.length > 0 ? (
                      <FormControl fullWidth size="small">
                        <InputLabel>Pilih Voucher</InputLabel>
                        <Select
                          value={selectedVoucher}
                          label="Pilih Voucher"
                          onChange={handleVoucherChange}
                        >
                          <MenuItem value=""><em>Tidak pakai voucher</em></MenuItem>
                          {myVouchers.map((v) => (
                            <MenuItem key={v.id} value={v.id}>
                              {v.code} - Hemat {formatCurrency(v.discount_amount)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <Typography variant="body2" color="textSecondary">Tidak ada voucher tersedia.</Typography>
                    )}
                    {discount > 0 && (
                      <Alert severity="success" sx={{ mt: 2 }}>Disk {formatCurrency(discount)} diterapkan!</Alert>
                    )}
                  </Box>
                </Box>
              )}

              {/* NAVIGATION BUTTONS */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button disabled={activeStep === 0} onClick={handleBack} startIcon={<KeyboardArrowLeft />}>
                  Kembali
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button variant="contained" color="secondary" size="large" onClick={handleBooking} sx={{ px: 4 }}>
                    Bayar Sekarang
                  </Button>
                ) : (
                  <Button variant="contained" onClick={handleNext} endIcon={<KeyboardArrowRight />}>
                    Lanjut
                  </Button>
                )}
              </Box>

            </Paper>
          </Grid>

          {/* KANAN: Ringkasan Harga (Sticky) */}
          <Grid item xs={12} md={4}>
            <Paper elevation={4} sx={{ p: 3, bgcolor: 'primary.light', color: 'primary.contrastText', position: 'sticky', top: 100 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Ringkasan</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>{hotel.name} - {hotel.city}</Typography>
              <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', mb: 2 }} />

              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Per malam</Typography>
                <Typography variant="body2">{formatCurrency(pricePerNight)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">{nights} Malam, {rooms} Kamar</Typography>
                <Typography variant="body2">{formatCurrency(subtotal)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Pajak (10%)</Typography>
                <Typography variant="body2">{formatCurrency(taxes)}</Typography>
              </Box>

              {discount > 0 && (
                <Box display="flex" justifyContent="space-between" mb={1} sx={{ color: '#C8E6C9', fontWeight: 'bold' }}>
                  <Typography>Diskon</Typography>
                  <Typography>- {formatCurrency(discount)}</Typography>
                </Box>
              )}

              <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', my: 2 }} />

              <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h5" fontWeight={700}>Total</Typography>
                <Typography variant="h5" fontWeight={700}>{formatCurrency(totalPrice)}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

export default Booking;