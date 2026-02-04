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
  Button,
  IconButton,
  CircularProgress,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import api from "../../api/axios";

export default function HotelAdminPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await api.get("/hotels");
      setHotels(res.data || []);
    } catch (err) {
      console.error("Failed to fetch hotels:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus hotel ini?")) return;

    try {
      await api.delete(`/hotels/${id}`);
      setHotels(hotels.filter((h) => h.id !== id));
      setSnackbar({ open: true, message: "Hotel berhasil dihapus", severity: "success" });
    } catch (err) {
      console.error("Delete failed:", err);
      setSnackbar({ open: true, message: "Gagal menghapus hotel", severity: "error" });
    }
  };

  const handleUpdateCoordinates = async () => {
    if (!window.confirm("Update koordinat untuk semua hotel yang belum punya koordinat? Proses ini mungkin memakan waktu beberapa detik.")) return;

    try {
      setUpdating(true);
      const res = await api.post("/hotels/update-coordinates");
      setSnackbar({ 
        open: true, 
        message: `Berhasil update koordinat untuk ${res.data.updated} hotel`, 
        severity: "success" 
      });
      // Refresh data hotel
      await fetchHotels();
    } catch (err) {
      console.error("Update coordinates failed:", err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || "Gagal update koordinat", 
        severity: "error" 
      });
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: "#f3f6fb", minHeight: "100vh", height: "100vh", boxSizing: 'border-box' }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#21366d" }}>
          Hotel Management
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<LocationOnIcon />}
            onClick={handleUpdateCoordinates}
            disabled={updating}
            sx={{ borderRadius: 2 }}
          >
            {updating ? "Updating..." : "Update Coordinates"}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/hotels/create")}
            sx={{ borderRadius: 2 }}
          >
            Tambah Hotel
          </Button>
        </Box>
      </Box>

      {/* TableContainer tanpa custom maxHeight/overflow agar scroll di main content */}
      <TableContainer component={Paper} elevation={3} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Nama Hotel</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Kota</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Harga</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Koordinat</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Deskripsi</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hotels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">Belum ada data hotel</Typography>
                </TableCell>
              </TableRow>
            ) : (
              hotels.map((hotel) => (
                <TableRow key={hotel.id} hover>
                  <TableCell>{hotel.id}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{hotel.name}</TableCell>
                  <TableCell>
                    <Chip label={hotel.city} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{formatCurrency(hotel.price || 0)}</TableCell>
                  <TableCell>
                    {hotel.latitude && hotel.longitude ? (
                      <Chip 
                        label="✓ Ada" 
                        size="small" 
                        color="success" 
                        variant="filled"
                        sx={{ fontSize: "0.7rem" }}
                      />
                    ) : (
                      <Chip 
                        label="✗ Belum" 
                        size="small" 
                        color="warning" 
                        variant="outlined"
                        sx={{ fontSize: "0.7rem" }}
                      />
                    )}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography variant="body2" noWrap>
                      {hotel.description || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => navigate(`/admin/hotels/edit/${hotel.id}`)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" size="small" onClick={() => handleDelete(hotel.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
