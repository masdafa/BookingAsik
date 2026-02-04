import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Button,
} from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import api from "../../api/axios";

export default function InvoiceAdminPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await api.get("/bookings/admin");
      // Invoice = booking yang sudah confirmed/paid
      setBookings(res.data || []);
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const generateInvoiceNumber = (id) => {
    return `INV-${String(id).padStart(6, "0")}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0);

  return (
    <Box sx={{ p: 3, bgcolor: "#f3f6fb", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#21366d" }}>
          Invoice Management
        </Typography>
        <Chip
          icon={<ReceiptIcon />}
          label={`Total Revenue: ${formatCurrency(totalRevenue)}`}
          color="success"
          sx={{ fontSize: "0.9rem", fontWeight: 600, px: 1 }}
        />
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: 700 }}>Invoice #</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Booking ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Hotel</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Check-in</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Check-out</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">Belum ada invoice</Typography>
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{generateInvoiceNumber(booking.id)}</TableCell>
                  <TableCell>#{booking.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{booking.userName || "-"}</TableCell>
                  <TableCell>{booking.hotelName || "-"}</TableCell>
                  <TableCell>{formatDate(booking.start_date)}</TableCell>
                  <TableCell>{formatDate(booking.end_date)}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: "#2e7d32" }}>
                    {formatCurrency(booking.total_price || 0)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
