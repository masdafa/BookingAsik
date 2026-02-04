import React from "react";
import { Box, Card, Typography, Stack, Button, Divider, Paper, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useTranslation } from "react-i18next";
import { Hotel, Event, Payment, AttachMoney, Home } from "@mui/icons-material";

export default function YourBooking() {
  const { t } = useTranslation();
  // Mengambil dan memastikan data bookings diinisialisasi dengan benar
  const bookings = JSON.parse(localStorage.getItem("userBookings") || "[]");
  const navigate = useNavigate();
  // Menggunakan useRef untuk referensi elemen yang akan dicetak
  const listRef = React.useRef();

  // --- Fungsi Pencetakan PDF ---
  const handlePrint = async () => {
    // Hanya mencetak Stack bookings, bukan seluruh Box
    const input = listRef.current; 
    
    // Memberikan feedback visual saat proses dimulai (Opsional: Tambahkan state loading)
    console.log("Membuat PDF...");

    // Menggunakan html2canvas untuk mengubah komponen menjadi gambar
    const canvas = await html2canvas(input, {
        scale: 2, // Meningkatkan skala untuk kualitas gambar yang lebih baik pada PDF
        useCORS: true, // Penting jika ada gambar eksternal
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0); // Menggunakan JPEG dengan kualitas tinggi
    const pdf = new jsPDF({ 
        orientation: 'portrait', 
        unit: 'pt', 
        format: 'a4' 
    });

    const width = pdf.internal.pageSize.getWidth();
    // Menghitung tinggi agar rasio aspek tetap terjaga
    const height = (canvas.height * width) / canvas.width; 

    // Menambahkan gambar ke PDF. Margin atas 20pt untuk estetika.
    pdf.addImage(imgData, 'JPEG', 0, 20, width, height); 
    pdf.save('ringkasan-booking-hotel.pdf');
  };
  // ------------------------------

  return (
    <Box sx={{ 
        minHeight: '70vh', 
        maxWidth: 800, // Lebar maksimal sedikit diperbesar
        mx: 'auto', 
        mt: 8, 
        p: 3,
        // Gaya latar belakang lembut atau shadow pada Box luar
        borderRadius: 2,
    }}>
      <Typography 
        variant="h4" 
        fontWeight={700} 
        mb={4} 
        color="primary"
        sx={{ 
            textAlign: 'center', 
            borderBottom: '3px solid', 
            borderColor: 'primary.main', 
            pb: 1 
        }}
      >
        {t('your_booking_title')} 🛎️
      </Typography>

      {/* --- Bagian Tanpa Booking --- */}
      {bookings.length === 0 ? (
        <Card 
            elevation={4} 
            sx={{ 
                p: 5, 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                borderRadius: 4,
                backgroundColor: 'grey.50',
            }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('no_bookings_found')}
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Home />} 
            onClick={() => navigate("/")}
            sx={{ mt: 2 }}
          >
            {t('back_to_home')}
          </Button>
        </Card>
      ) : (
        /* --- Bagian Ada Booking --- */
        <>
          <Stack 
            ref={listRef} 
            spacing={3} 
            sx={{ 
                p: 2, 
                backgroundColor: 'background.paper' 
            }}
          >
            {bookings.map((b, i) => (
              <Card 
                key={i} 
                elevation={6} // Menambahkan shadow yang lebih menonjol
                sx={{ 
                    p: 4, 
                    borderRadius: 3, 
                    borderLeft: '5px solid', 
                    borderColor: 'secondary.main', // Garis samping warna sekunder
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-5px)', // Efek hover mengangkat card
                        boxShadow: 8,
                    }
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    <Hotel color="primary" sx={{ fontSize: 30 }} />
                    <Typography variant="h5" fontWeight={700} color="primary">
                        {b.hotelName}
                    </Typography>
                </Stack>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ ml: 1 }}>
                    {/* Tanggal Check-in/Check-out */}
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                        <Event color="action" fontSize="small" />
                        <Typography variant="body1">
                            **{t('check_in_out_label')}**: 
                            <span style={{ fontWeight: 600 }}> {b.checkIn} </span>
                            -
                            <span style={{ fontWeight: 600 }}> {b.checkOut}</span>
                        </Typography>
                    </Stack>

                    {/* Metode Pembayaran */}
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                        <Payment color="action" fontSize="small" />
                        <Typography variant="body1">
                            **{t('booking_method_label')}**: {b.paymentLabel}
                        </Typography>
                    </Stack>

                    {/* Total Pembayaran (Dibuat paling menonjol) */}
                    <Stack 
                        direction="row" 
                        spacing={1} 
                        alignItems="center" 
                        mt={2} 
                        sx={{ 
                            p: 1, 
                            backgroundColor: 'success.light', 
                            borderRadius: 1 
                        }}
                    >
                        <AttachMoney color="success" sx={{ fontSize: 24 }} />
                        <Typography variant="h6" color="success.dark" fontWeight={700}>
                            {t('booking_total_label')}: Rp {b.total?.toLocaleString('id-ID') || 'N/A'}
                        </Typography>
                    </Stack>
                </Box>
              </Card>
            ))}
          </Stack>

          {/* --- Bagian Tombol Aksi --- */}
          <Box sx={{ display: 'flex', gap: 3, mt: 5, justifyContent: 'center' }}>
            <Button 
                variant="contained" 
                color="secondary" 
                onClick={handlePrint}
                sx={{ 
                    fontWeight: 600, 
                    py: 1.5 
                }}
            >
                {t('print_pdf_summary')}
            </Button>
            <Button 
                variant="outlined" 
                startIcon={<Home />} 
                onClick={() => navigate("/")}
                sx={{ 
                    fontWeight: 600, 
                    py: 1.5 
                }}
            >
                {t('back_to_home')}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}