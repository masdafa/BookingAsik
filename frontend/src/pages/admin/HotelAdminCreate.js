import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function HotelAdminCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [form, setForm] = useState({
    name: "",
    city: "",
    price: "",
    description: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    // Clear error saat user mulai mengetik
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setSnackbar({
          open: true,
          message: "Hanya file gambar yang diizinkan (JPEG, PNG, GIF, WEBP)",
          severity: "error",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: "Ukuran file maksimal 5MB",
          severity: "error",
        });
        return;
      }

      setImageFile(file);
      // Preview gambar
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error
      if (errors.image) {
        setErrors({ ...errors, image: "" });
      }
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) {
      setErrors({ ...errors, image: "Pilih gambar terlebih dahulu" });
      return null;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', imageFile);

      // Jangan set Content-Type manual, biarkan axios set otomatis untuk FormData
      const response = await api.post('/upload-local/hotel', formData, {
        headers: {
          // Axios akan otomatis set Content-Type: multipart/form-data dengan boundary
        },
        timeout: 30000, // 30 detik timeout
      });

      if (response.data && response.data.filename) {
        return response.data.filename;
      } else {
        throw new Error('Response tidak valid dari server');
      }
    } catch (err) {
      console.error('Upload error:', err);
      
      let errorMessage = "Gagal upload gambar.";
      
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        errorMessage = "Upload timeout. Pastikan koneksi internet stabil dan file tidak terlalu besar.";
      } else if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        errorMessage = "Network error. Pastikan backend server sedang running di http://localhost:4000";
      } else if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      `Server error: ${err.response.status}`;
      } else {
        errorMessage = err.message || "Gagal upload gambar. Pastikan file adalah gambar dan ukurannya tidak lebih dari 5MB.";
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Nama hotel wajib diisi";
    if (!form.city.trim()) newErrors.city = "Kota wajib diisi";
    if (!form.price || parseFloat(form.price) <= 0) {
      newErrors.price = "Harga harus lebih dari 0";
    }
    if (!form.description.trim()) {
      newErrors.description = "Deskripsi wajib diisi";
    }
    if (!imageFile && !form.image.trim()) {
      newErrors.image = "Gambar wajib diisi";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setSnackbar({
        open: true,
        message: "Mohon lengkapi semua field yang wajib",
        severity: "error",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Upload gambar jika ada
      let imageFilename = form.image.trim();
      if (imageFile) {
        const uploadedFilename = await handleUploadImage();
        if (!uploadedFilename) {
          setLoading(false);
          return; // Stop jika upload gagal
        }
        imageFilename = uploadedFilename;
      }

      // Create hotel
      const response = await api.post("/hotels", {
        name: form.name.trim(),
        city: form.city.trim(),
        price: parseInt(form.price),
        description: form.description.trim(),
        image: imageFilename,
      });

      setSnackbar({
        open: true,
        message: "Hotel berhasil dibuat! Koordinat akan otomatis terisi.",
        severity: "success",
      });

      // Redirect setelah 1.5 detik
      setTimeout(() => {
        navigate("/admin/hotels");
      }, 1500);
    } catch (err) {
      console.error("Create hotel error:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.error || "Gagal membuat hotel",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#f3f6fb", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate("/admin/hotels")} sx={{ bgcolor: "white" }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#21366d" }}>
          Create Hotel
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, maxWidth: 900, mx: "auto" }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Hotel Name */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nama Hotel"
                placeholder="Contoh: Grand Hotel"
                value={form.name}
                onChange={handleChange("name")}
                error={!!errors.name}
                helperText={errors.name}
                required
                sx={{ mb: 2 }}
              />
            </Grid>

            {/* City */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Kota"
                placeholder="Contoh: Jakarta"
                value={form.city}
                onChange={handleChange("city")}
                error={!!errors.city}
                helperText={errors.city}
                required
                sx={{ mb: 2 }}
              />
            </Grid>

            {/* Price */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Harga per Malam (IDR)"
                placeholder="Contoh: 500000"
                type="number"
                value={form.price}
                onChange={handleChange("price")}
                error={!!errors.price}
                helperText={errors.price || "Masukkan harga dalam Rupiah"}
                required
                InputProps={{
                  inputProps: { min: 0 },
                }}
                sx={{ mb: 2 }}
              />
            </Grid>

            {/* Image Upload */}
            <Grid item xs={12} md={6}>
              <Box>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      mb: 2,
                      py: 1.5,
                      borderStyle: 'dashed',
                      borderWidth: 2,
                      borderRadius: 2,
                    }}
                  >
                    {imageFile ? imageFile.name : "Upload Gambar Hotel"}
                  </Button>
                </label>
                {errors.image && (
                  <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1 }}>
                    {errors.image}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Format: JPEG, PNG, GIF, WEBP (Max 5MB)
                </Typography>
                
                {/* Image Preview */}
                {imagePreview && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Preview"
                      sx={{
                        maxWidth: '100%',
                        maxHeight: 200,
                        borderRadius: 2,
                        border: '1px solid #ddd',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                )}

                {/* Fallback: Manual input filename */}
                <TextField
                  fullWidth
                  label="Atau masukkan nama file yang sudah ada"
                  placeholder="Contoh: hotel1.jpg"
                  value={form.image}
                  onChange={handleChange("image")}
                  sx={{ mt: 2 }}
                  helperText="Jika gambar sudah ada di server, masukkan nama file saja"
                />
              </Box>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Deskripsi"
                placeholder="Deskripsi lengkap tentang hotel..."
                value={form.description}
                onChange={handleChange("description")}
                error={!!errors.description}
                helperText={errors.description}
                required
                multiline
                rows={4}
                sx={{ mb: 3 }}
              />
            </Grid>

            {/* Info Box */}
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Catatan:</strong> Setelah hotel dibuat, koordinat (latitude/longitude) akan otomatis
                  diisi berdasarkan nama hotel dan kota menggunakan geocoding. Pastikan nama hotel dan kota
                  sudah benar.
                </Typography>
              </Alert>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/admin/hotels")}
                  disabled={loading}
                  sx={{ borderRadius: 2 }}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading || uploading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  disabled={loading || uploading}
                  sx={{ borderRadius: 2, minWidth: 120 }}
                >
                  {uploading ? "Uploading..." : loading ? "Menyimpan..." : "Simpan Hotel"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
