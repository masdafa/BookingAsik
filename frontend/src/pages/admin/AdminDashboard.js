import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography, Box, Stack, Avatar, CircularProgress } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HotelIcon from "@mui/icons-material/Hotel";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import api from "../../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalHotels: 0,
    bookingsToday: 0,
    totalRevenue: 0,
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarColors = ["#1976d2", "#2e7d32", "#ed6c02", "#9c27b0", "#f44336"];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, minHeight: "100vh", bgcolor: "#f3f6fb" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 800, color: "#21366d", letterSpacing: 1 }}>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              borderRadius: 3,
              minHeight: 130,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar sx={{ bgcolor: "#1976d2", width: 56, height: 56 }}>
              <HotelIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ color: "#64748b", fontWeight: 500 }}>
                Total Hotels
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: "#21366d", mt: 0.5 }}>
                {stats.totalHotels}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              borderRadius: 3,
              minHeight: 130,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar sx={{ bgcolor: "#2e7d32", width: 56, height: 56 }}>
              <BookOnlineIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ color: "#64748b", fontWeight: 500 }}>
                Bookings Today
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: "#21366d", mt: 0.5 }}>
                {stats.bookingsToday}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={4}
            sx={{
              p: 3,
              borderRadius: 3,
              minHeight: 130,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar sx={{ bgcolor: "#ed6c02", width: 56, height: 56 }}>
              <TrendingUpIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ color: "#64748b", fontWeight: 500 }}>
                Revenue (IDR)
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#21366d", mt: 0.5 }}>
                {formatCurrency(stats.totalRevenue)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Paper elevation={3} sx={{ mt: 5, p: 4, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: "#21366d" }}>
          Recent Activities
        </Typography>
        {stats.recentBookings.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No recent bookings
          </Typography>
        ) : (
          <Stack spacing={2}>
            {stats.recentBookings.map((booking, index) => (
              <Box key={booking.id} display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: avatarColors[index % avatarColors.length] }}>
                  {getInitials(booking.userName)}
                </Avatar>
                <Box>
                  <Typography fontWeight={700}>Booking #{booking.id}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    User <b>{booking.userName}</b> booked <b>{booking.hotelName}</b> —{" "}
                    {formatDate(booking.start_date)} to {formatDate(booking.end_date)} •{" "}
                    {formatCurrency(booking.total_price)} • {getTimeAgo(booking.start_date)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
