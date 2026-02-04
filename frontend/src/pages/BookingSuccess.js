import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Stack,
  Chip,
  Grid,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import QrCodeIcon from '@mui/icons-material/QrCode2';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const paymentIcons = {
  gopay: <PaymentIcon color="info" sx={{ mr: 0.5 }} />,
  qris: <QrCodeIcon color="secondary" sx={{ mr: 0.5 }} />,
  transfer: <AccountBalanceIcon color="success" sx={{ mr: 0.5 }} />
};

const paymentLabels = {
  gopay: "GoPay",
  qris: "QRIS",
  transfer: "Transfer Bank"
};

export default function BookingSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  if (!state) {
    return (
      <Box sx={{ p: 6, textAlign: "center" }}>
        <Typography variant="h6">Data booking tidak ditemukan.</Typography>
      </Box>
    );
  }

  const { hotel, form, estimatedTotal, paymentMethod } = state;
  const cardRef = React.useRef();

  // Generate booking ID
  const bookingId = `${hotel?.name?.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-6)}`;

  const handlePrint = async () => {
    const input = cardRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("bukti-booking.pdf");
  };

  // Fungsi untuk mengirim email melalui API
  const sendEmailNotification = async () => {
    setEmailLoading(true);
    
    try {
      const bookingData = {
        id: bookingId,
        hotel_id: hotel?.id,
        hotel_name: hotel?.name,
        customer_name: form?.name,
        customer_email: form?.email,
        check_in: form?.checkIn,
        check_out: form?.checkOut,
        rooms: form?.room,
        total: estimatedTotal,
        payment_method: paymentLabels[paymentMethod],
        booking_date: new Date().toLocaleDateString('id-ID'),
        customer_phone: form?.phone || 'N/A'
      };

      console.log('📧 Sending email with data:', bookingData);

      // Kirim ke backend API
      const response = await fetch('http://localhost:4000/api/bookings/send-booking-email/public', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: form?.email,
          booking: bookingData
        })
      });

      const result = await response.json();
      console.log('📧 Email API Response:', response.status, result);
      
      if (response.ok) {
        setEmailSent(true);
        setSnackbar({
          open: true,
          message: 'Bukti booking telah dikirim ke email Anda!',
          severity: 'success'
        });
      } else {
        throw new Error(result.message || `HTTP ${response.status}: ${result.error || 'Failed to send email'}`);
      }
    } catch (error) {
      console.error('❌ Error sending email:', error);
      setSnackbar({
        open: true,
        message: `Gagal mengirim email: ${error.message}. Booking tetap berhasil!`,
        severity: 'warning'
      });
    } finally {
      setEmailLoading(false);
    }
  };

  // Simpan booking ke localStorage dan kirim email secara otomatis
  useEffect(() => {
    if (!state) return;

    const newBooking = {
      hotelName: hotel?.name,
      checkIn: form?.checkIn,
      checkOut: form?.checkOut,
      total: estimatedTotal,
      paymentMethod,
      paymentLabel: paymentLabels[paymentMethod],
      bookingId: bookingId,
      timestamp: new Date().toISOString()
    };

    // Simpan ke localStorage
    const bookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
    bookings.push(newBooking);
    localStorage.setItem("userBookings", JSON.stringify(bookings));

    // Kirim email secara otomatis (dengan delay kecil untuk memastikan UI siap)
    const timer = setTimeout(() => {
      sendEmailNotification();
    }, 2000);

    return () => clearTimeout(timer);
  }, [state]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafd", p: 2, pt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Card ref={cardRef} sx={{ maxWidth: 600, width: "100%", borderRadius: 4, boxShadow: 4, mb: 5, p: 2 }}>
        <CardContent>
          {/* Header dengan Logo */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Box
                component="img"
                src="/logo.png"
                alt="Logo"
                sx={{ height: 60, mb: 1 }}
                onError={(e) => e.target.style.display = 'none'}
              />
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ color: "#17439b", mb: 1 }}>
              TRAVEL BOOKING
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Bukti Booking Resmi
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Informasi Hotel */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <img
              src={hotel?.image ? `http://localhost:4000/hotels/${hotel.image}` : "https://via.placeholder.com/400x160?text=No+Image"}
              alt={hotel?.name}
              style={{ width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 12, marginBottom: 16 }}
              onError={(e) => (e.target.src = "https://via.placeholder.com/400x160?text=No+Image")}
            />
            <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5, color: "#17439b" }}>
              {hotel?.name}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              {hotel?.city}
            </Typography>
            <Chip label="Booking Berhasil!" color="success" sx={{ fontWeight: 700 }} />
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Detail Booking */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Nama</Typography>
              <Typography>{form?.name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Email</Typography>
              <Typography>{form?.email}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Check-in</Typography>
              <Typography>{form?.checkIn}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Check-out</Typography>
              <Typography>{form?.checkOut}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Jumlah Kamar</Typography>
              <Typography>{form?.room}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Metode Bayar</Typography>
              <Typography>
                {paymentIcons[paymentMethod]} {paymentLabels[paymentMethod]}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">Booking ID</Typography>
              <Typography sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                {bookingId}
              </Typography>
            </Grid>
          </Grid>

          {/* Total Pembayaran */}
          <Paper elevation={0} sx={{ mt: 3, p: 2, bgcolor: "#e8f5e9", borderRadius: 2 }}>
            <Typography variant="h6" align="center" sx={{ fontWeight: 700, color: "#0a3" }}>
              Total: Rp {estimatedTotal.toLocaleString("id-ID")}
            </Typography>
          </Paper>

          {/* Informasi Customer Service */}
          <Paper elevation={0} sx={{ mt: 3, p: 2, bgcolor: "#fff3cd", borderRadius: 2, border: "1px solid #ffeaa7" }}>
            <Typography variant="body2" align="center" sx={{ fontWeight: 600, color: "#856404", mb: 1 }}>
              ⚠️ Informasi Penting
            </Typography>
            <Typography variant="body2" align="center" sx={{ color: "#856404" }}>
              Jika ada masalah ketika menunjukkan bukti booking di lokasi, silahkan hubungi customer service kami:
            </Typography>
            <Typography variant="body2" align="center" sx={{ fontWeight: 600, mt: 1 }}>
              📞 +62 21 1234 5678
            </Typography>
            <Typography variant="body2" align="center" sx={{ fontWeight: 600 }}>
              📧 support@bookingasik.com
            </Typography>
          </Paper>

          {/* Footer */}
          <Box sx={{ textAlign: "center", mt: 3, pt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Terima kasih telah menggunakan layanan kami
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button variant="contained" color="primary" onClick={() => navigate("/")}>
          Kembali ke Beranda
        </Button>
        <Button variant="outlined" color="success" onClick={() => navigate("/booking")}>
          Booking Lain
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={handlePrint} 
          sx={{ px: 4 }}
        >
          Cetak Booking PDF
        </Button>
        
        <Button 
          variant="outlined" 
          color="info" 
          onClick={sendEmailNotification}
          disabled={emailLoading || emailSent}
          sx={{ px: 4 }}
        >
          {emailLoading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Mengirim...
            </>
          ) : emailSent ? (
            'Email Terkirim ✓'
          ) : (
            'Kirim Ulang Email'
          )}
        </Button>
      </Stack>

      {/* Snackbar untuk notifikasi email */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
