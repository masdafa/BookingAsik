import React, { useState, useEffect } from 'react';
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
    Chip,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    FormControlLabel,
    Switch,
    Alert,
    Snackbar,
    CircularProgress,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import api from '../../api/axios';

const categories = [
    { value: 'temple', label: 'Pura/Candi' },
    { value: 'nature', label: 'Alam' },
    { value: 'heritage', label: 'Warisan Budaya' },
    { value: 'culture', label: 'Budaya' },
    { value: 'landmark', label: 'Landmark' },
    { value: 'theme_park', label: 'Taman Hiburan' },
    { value: 'beach', label: 'Pantai' },
    { value: 'adventure', label: 'Petualangan' },
];

const initialFormState = {
    name: '',
    city: '',
    price: '',
    description: '',
    image: '',
    category: 'nature',
    duration: '',
    latitude: '',
    longitude: '',
    address: '',
    rating: 4.5,
    amenities: '',
    opening_hours: '',
    is_flash_sale: false,
    discount_percent: 0,
};

export default function AttractionAdminPage() {
    const [attractions, setAttractions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [form, setForm] = useState(initialFormState);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchAttractions();
    }, []);

    const fetchAttractions = async () => {
        try {
            const res = await api.get('/attractions');
            setAttractions(res.data);
        } catch (err) {
            console.error('Error fetching attractions:', err);
            setSnackbar({ open: true, message: 'Gagal memuat data wisata', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setEditMode(false);
        setSelectedId(null);
        setForm(initialFormState);
        setDialogOpen(true);
    };

    const handleOpenEdit = (attraction) => {
        setEditMode(true);
        setSelectedId(attraction.id);
        setForm({
            name: attraction.name || '',
            city: attraction.city || '',
            price: attraction.price?.toString() || '',
            description: attraction.description || '',
            image: attraction.image || '',
            category: attraction.category || 'nature',
            duration: attraction.duration || '',
            latitude: attraction.latitude?.toString() || '',
            longitude: attraction.longitude?.toString() || '',
            address: attraction.address || '',
            rating: attraction.rating || 4.5,
            amenities: Array.isArray(attraction.amenities) ? attraction.amenities.join(', ') : '',
            opening_hours: attraction.opening_hours || '',
            is_flash_sale: attraction.is_flash_sale || false,
            discount_percent: attraction.discount_percent || 0,
        });
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setForm(initialFormState);
    };

    const handleChange = (field) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm({ ...form, [field]: value });
    };

    const handleSubmit = async () => {
        if (!form.name || !form.city || !form.price) {
            setSnackbar({ open: true, message: 'Nama, Kota, dan Harga wajib diisi', severity: 'error' });
            return;
        }

        setSaving(true);
        try {
            const payload = {
                name: form.name.trim(),
                city: form.city.trim(),
                price: parseInt(form.price),
                description: form.description.trim(),
                image: form.image.trim(),
                category: form.category,
                duration: form.duration.trim(),
                latitude: form.latitude ? parseFloat(form.latitude) : null,
                longitude: form.longitude ? parseFloat(form.longitude) : null,
                address: form.address.trim(),
                rating: parseFloat(form.rating),
                amenities: form.amenities ? form.amenities.split(',').map(a => a.trim()) : [],
                opening_hours: form.opening_hours.trim(),
                is_flash_sale: form.is_flash_sale,
                discount_percent: parseInt(form.discount_percent) || 0,
            };

            if (editMode) {
                await api.put(`/attractions/${selectedId}`, payload);
                setSnackbar({ open: true, message: 'Wisata berhasil diupdate!', severity: 'success' });
            } else {
                await api.post('/attractions', payload);
                setSnackbar({ open: true, message: 'Wisata berhasil ditambahkan!', severity: 'success' });
            }

            handleCloseDialog();
            fetchAttractions();
        } catch (err) {
            console.error('Save error:', err);
            setSnackbar({
                open: true,
                message: err.response?.data?.error || 'Gagal menyimpan data',
                severity: 'error'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/attractions/${deleteId}`);
            setSnackbar({ open: true, message: 'Wisata berhasil dihapus', severity: 'success' });
            setDeleteDialogOpen(false);
            fetchAttractions();
        } catch (err) {
            console.error('Delete error:', err);
            setSnackbar({ open: true, message: 'Gagal menghapus wisata', severity: 'error' });
        }
    };

    const filteredAttractions = attractions.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#f3f6fb', minHeight: '100vh' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#21366d' }}>
                    🏝️ Kelola Tempat Wisata
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreate}
                    sx={{ borderRadius: 2 }}
                >
                    Tambah Wisata
                </Button>
            </Box>

            {/* Search */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <TextField
                    fullWidth
                    placeholder="Cari wisata..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            {/* Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                {loading ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Table>
                        <TableHead sx={{ bgcolor: '#f5f7fa' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Nama</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Kota</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Kategori</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Harga</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Rating</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Flash Sale</TableCell>
                                <TableCell sx={{ fontWeight: 700 }} align="center">Aksi</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredAttractions.map((attraction) => (
                                <TableRow key={attraction.id} hover>
                                    <TableCell>{attraction.id}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {attraction.image && (
                                                <Box
                                                    component="img"
                                                    src={attraction.image}
                                                    alt={attraction.name}
                                                    sx={{ width: 50, height: 50, borderRadius: 1, objectFit: 'cover' }}
                                                />
                                            )}
                                            <Typography fontWeight={600}>{attraction.name}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{attraction.city}</TableCell>
                                    <TableCell>
                                        <Chip label={attraction.category} size="small" />
                                    </TableCell>
                                    <TableCell>
                                        {attraction.price > 0 ? formatCurrency(attraction.price) : 'Gratis'}
                                    </TableCell>
                                    <TableCell>⭐ {attraction.rating}</TableCell>
                                    <TableCell>
                                        {attraction.is_flash_sale ? (
                                            <Chip
                                                icon={<LocalOfferIcon />}
                                                label={`-${attraction.discount_percent}%`}
                                                color="error"
                                                size="small"
                                            />
                                        ) : (
                                            <Chip label="Tidak" size="small" variant="outlined" />
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton color="primary" onClick={() => handleOpenEdit(attraction)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => {
                                                setDeleteId(attraction.id);
                                                setDeleteDialogOpen(true);
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                Total: {filteredAttractions.length} wisata
            </Typography>

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>
                    {editMode ? 'Edit Wisata' : 'Tambah Wisata Baru'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Nama Wisata *"
                                value={form.name}
                                onChange={handleChange('name')}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Kota *"
                                value={form.city}
                                onChange={handleChange('city')}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Harga (IDR) *"
                                type="number"
                                value={form.price}
                                onChange={handleChange('price')}
                                helperText="0 untuk gratis"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth>
                                <InputLabel>Kategori</InputLabel>
                                <Select
                                    value={form.category}
                                    label="Kategori"
                                    onChange={handleChange('category')}
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Durasi Kunjungan"
                                value={form.duration}
                                onChange={handleChange('duration')}
                                placeholder="2-3 jam"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Deskripsi"
                                multiline
                                rows={3}
                                value={form.description}
                                onChange={handleChange('description')}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="URL Gambar"
                                value={form.image}
                                onChange={handleChange('image')}
                                helperText="URL gambar dari internet"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Alamat"
                                value={form.address}
                                onChange={handleChange('address')}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Latitude"
                                type="number"
                                value={form.latitude}
                                onChange={handleChange('latitude')}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Longitude"
                                type="number"
                                value={form.longitude}
                                onChange={handleChange('longitude')}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Rating"
                                type="number"
                                inputProps={{ step: 0.1, min: 0, max: 5 }}
                                value={form.rating}
                                onChange={handleChange('rating')}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Fasilitas"
                                value={form.amenities}
                                onChange={handleChange('amenities')}
                                helperText="Pisahkan dengan koma: Toilet, Parkir, WiFi"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Jam Buka"
                                value={form.opening_hours}
                                onChange={handleChange('opening_hours')}
                                placeholder="08:00 - 17:00"
                            />
                        </Grid>

                        {/* Flash Sale Section */}
                        <Grid item xs={12}>
                            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fff3cd' }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={form.is_flash_sale}
                                            onChange={handleChange('is_flash_sale')}
                                            color="warning"
                                        />
                                    }
                                    label="🔥 Aktifkan Flash Sale"
                                />
                                {form.is_flash_sale && (
                                    <TextField
                                        label="Diskon (%)"
                                        type="number"
                                        value={form.discount_percent}
                                        onChange={handleChange('discount_percent')}
                                        inputProps={{ min: 0, max: 100 }}
                                        sx={{ mt: 2, width: 150 }}
                                    />
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleCloseDialog} disabled={saving}>
                        Batal
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={saving}
                        startIcon={saving && <CircularProgress size={20} />}
                    >
                        {saving ? 'Menyimpan...' : editMode ? 'Update' : 'Simpan'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Konfirmasi Hapus</DialogTitle>
                <DialogContent>
                    <Typography>Apakah Anda yakin ingin menghapus wisata ini?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Batal</Button>
                    <Button variant="contained" color="error" onClick={handleDelete}>
                        Hapus
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
