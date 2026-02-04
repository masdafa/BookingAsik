import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    TextField,
    Button,
    Divider,
    Alert,
    Stepper,
    Step,
    StepLabel,
    Chip
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Icons
import QrCodeIcon from '@mui/icons-material/QrCode2';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '@mui/material/IconButton';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export default function AttractionBooking() {
    const { t } = useTranslation();
    const { id: attractionId } = useParams();
    const navigate = useNavigate();
    const { user, fetchUser } = useAuth();

    const [attraction, setAttraction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form State
    const [visitDate, setVisitDate] = useState(null);
    const [tickets, setTickets] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');

    // UI State
    const [activeStep, setActiveStep] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('qris');
    const [bookingLoading, setBookingLoading] = useState(false);

    // Prefill user data
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
        }
    }, [user]);

    // Fetch attraction
    useEffect(() => {
        const fetchAttraction = async () => {
            try {
                const res = await api.get(`/attractions/${attractionId}`);
                setAttraction(res.data);
            } catch (err) {
                console.error('Error fetching attraction:', err);
                setError('Gagal memuat data wisata');
            } finally {
                setLoading(false);
            }
        };
        fetchAttraction();
    }, [attractionId]);

    // Calculate price
    const calculatePrice = () => {
        if (!attraction) return 0;
        let price = parseFloat(attraction.price);
        if (attraction.is_flash_sale && attraction.discount_percent > 0) {
            price = price * (1 - attraction.discount_percent / 100);
        }
        return price * tickets;
    };

    const calculatePoints = () => {
        return Math.floor(calculatePrice() / 10000);
    };

    const steps = [t('guest_details'), t('select_payment_method'), t('review_booking')];

    const handleNext = () => {
        if (activeStep === 0) {
            if (!visitDate || !name || !email) {
                alert('Mohon lengkapi semua data');
                return;
            }
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleBooking = async () => {
        if (!user) {
            alert('Silakan login untuk memesan');
            navigate('/login');
            return;
        }

        setBookingLoading(true);
        try {
            const res = await api.post(`/attractions/${attractionId}/book`, {
                userId: user.id,
                visitDate: format(visitDate, 'yyyy-MM-dd'),
                tickets,
                paymentMethod,
                guestName: name,
                guestEmail: email,
                guestPhone: phone,
                notes,
            });

            // Update user data
            await fetchUser();

            // Navigate to success
            navigate('/booking-success', {
                state: {
                    attraction,
                    booking: res.data.booking,
                    form: { name, email, phone, visitDate: format(visitDate, 'yyyy-MM-dd'), tickets },
                    estimatedTotal: calculatePrice(),
                    pointsEarned: res.data.booking.pointsEarned,
                    paymentMethod
                }
            });
        } catch (err) {
            console.error('Booking error:', err);
            alert(err.response?.data?.error || 'Booking gagal');
        } finally {
            setBookingLoading(false);
        }
    };

    const paymentOptions = [
        { value: "qris", label: "QRIS", icon: <QrCodeIcon fontSize="large" />, color: "#ff8c00" },
        { value: "gopay", label: "GoPay", icon: <PaymentIcon fontSize="large" />, color: "#00c4ff" },
        { value: "transfer", label: "Bank Transfer", icon: <AccountBalanceIcon fontSize="large" />, color: "#31b057" },
    ];

    if (loading) return <><Navbar /><Container sx={{ py: 10 }}><Typography>Loading...</Typography></Container></>;
    if (error) return <><Navbar /><Container sx={{ py: 10 }}><Alert severity="error">{error}</Alert></Container></>;
    if (!attraction) return <><Navbar /><Container sx={{ py: 10 }}><Typography>{t('attraction_not_found')}</Typography></Container></>;

    const pricePerTicket = attraction.is_flash_sale && attraction.discount_percent > 0
        ? attraction.price * (1 - attraction.discount_percent / 100)
        : attraction.price;

    return (
        <>
            <Navbar />
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
                        {/* Main Content */}
                        <Grid item xs={12} md={8}>
                            <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: 3 }}>

                                {/* STEP 0: Guest Details */}
                                {activeStep === 0 && (
                                    <Box>
                                        <Typography variant="h6" gutterBottom fontWeight={700}>
                                            {t('guest_information')}
                                        </Typography>
                                        <Grid container spacing={2} sx={{ mb: 3 }}>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    label={t('full_name_label')}
                                                    fullWidth
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    label={t('email_label')}
                                                    fullWidth
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <TextField
                                                    label="No. Telepon"
                                                    fullWidth
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                />
                                            </Grid>
                                        </Grid>

                                        <Typography variant="h6" gutterBottom fontWeight={700} sx={{ mt: 3 }}>
                                            {t('attraction_visit_date')}
                                        </Typography>
                                        <Box sx={{ mb: 3 }}>
                                            <DatePicker
                                                label={t('attraction_select_date')}
                                                value={visitDate}
                                                onChange={(newValue) => setVisitDate(newValue)}
                                                minDate={new Date()}
                                                renderInput={(params) => <TextField {...params} fullWidth />}
                                            />
                                        </Box>

                                        <Typography variant="h6" gutterBottom fontWeight={700}>
                                            {t('attraction_ticket_count')}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 2,
                                                bgcolor: '#f5f7fa',
                                                borderRadius: 2,
                                                p: 2,
                                                width: 'fit-content',
                                            }}
                                        >
                                            <IconButton
                                                onClick={() => setTickets(Math.max(1, tickets - 1))}
                                                disabled={tickets <= 1}
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                            <Typography variant="h4" fontWeight={700} sx={{ minWidth: 60, textAlign: 'center' }}>
                                                {tickets}
                                            </Typography>
                                            <IconButton onClick={() => setTickets(tickets + 1)}>
                                                <AddIcon />
                                            </IconButton>
                                        </Box>

                                        <TextField
                                            label="Catatan (opsional)"
                                            fullWidth
                                            multiline
                                            rows={3}
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            sx={{ mt: 3 }}
                                        />
                                    </Box>
                                )}

                                {/* STEP 1: Payment Method */}
                                {activeStep === 1 && (
                                    <Box>
                                        <Typography variant="h6" gutterBottom fontWeight={700}>
                                            {t('select_payment_method')}
                                        </Typography>
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
                                                            '&:hover': { transform: 'translateY(-4px)', boxShadow: 2 },
                                                            transition: 'all 0.2s ease',
                                                        }}
                                                        onClick={() => setPaymentMethod(opt.value)}
                                                    >
                                                        <Box sx={{ color: opt.color }}>{opt.icon}</Box>
                                                        <Typography fontWeight={600}>{opt.label}</Typography>
                                                    </Paper>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                )}

                                {/* STEP 2: Review */}
                                {activeStep === 2 && (
                                    <Box>
                                        <Typography variant="h6" gutterBottom fontWeight={700}>
                                            {t('review_booking')}
                                        </Typography>
                                        <Paper variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <Typography color="textSecondary" variant="body2">Nama:</Typography>
                                                    <Typography fontWeight={600}>{name}</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography color="textSecondary" variant="body2">Email:</Typography>
                                                    <Typography fontWeight={600}>{email}</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography color="textSecondary" variant="body2">{t('attraction_visit_date')}:</Typography>
                                                    <Typography fontWeight={600}>{visitDate ? format(visitDate, 'dd MMM yyyy') : '-'}</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography color="textSecondary" variant="body2">{t('attraction_ticket_count')}:</Typography>
                                                    <Typography fontWeight={600}>{tickets} tiket</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography color="textSecondary" variant="body2">{t('payment_method')}:</Typography>
                                                    <Typography fontWeight={600}>{paymentMethod.toUpperCase()}</Typography>
                                                </Grid>
                                            </Grid>
                                        </Paper>

                                        <Alert severity="success" icon={<ConfirmationNumberIcon />}>
                                            <Typography fontWeight={600}>
                                                {t('you_will_earn')}: +{calculatePoints()} {t('points')}
                                            </Typography>
                                        </Alert>
                                    </Box>
                                )}

                                {/* Navigation Buttons */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                                    <Button
                                        disabled={activeStep === 0}
                                        onClick={handleBack}
                                        startIcon={<KeyboardArrowLeft />}
                                    >
                                        {t('back')}
                                    </Button>
                                    {activeStep === steps.length - 1 ? (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="large"
                                            onClick={handleBooking}
                                            disabled={bookingLoading}
                                            sx={{ px: 4 }}
                                        >
                                            {bookingLoading ? t('processing') : t('pay_now')}
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            endIcon={<KeyboardArrowRight />}
                                        >
                                            {t('review_booking')}
                                        </Button>
                                    )}
                                </Box>

                            </Paper>
                        </Grid>

                        {/* Right Sidebar - Summary */}
                        <Grid item xs={12} md={4}>
                            <Paper
                                elevation={4}
                                sx={{
                                    p: 3,
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    borderRadius: 3,
                                    position: 'sticky',
                                    top: 100,
                                }}
                            >
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    {t('booking_summary')}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                                    {attraction.name} - {attraction.city}
                                </Typography>
                                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', mb: 2 }} />

                                {/* Price breakdown */}
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="body2">{t('attraction_per_person')}</Typography>
                                    <Typography variant="body2">{formatCurrency(pricePerTicket)}</Typography>
                                </Box>
                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="body2">{tickets}x Tiket</Typography>
                                    <Typography variant="body2">{formatCurrency(calculatePrice())}</Typography>
                                </Box>

                                {attraction.is_flash_sale && (
                                    <Chip
                                        label={`Flash Sale -${attraction.discount_percent}%`}
                                        size="small"
                                        sx={{ bgcolor: '#ff4757', color: 'white', mt: 1 }}
                                    />
                                )}

                                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', my: 2 }} />

                                <Box display="flex" justifyContent="space-between" mb={1}>
                                    <Typography variant="h5" fontWeight={700}>Total</Typography>
                                    <Typography variant="h5" fontWeight={700}>{formatCurrency(calculatePrice())}</Typography>
                                </Box>

                                <Box
                                    sx={{
                                        mt: 2,
                                        p: 2,
                                        bgcolor: 'rgba(255,255,255,0.15)',
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <ConfirmationNumberIcon />
                                    <Typography variant="body2">
                                        {t('you_will_earn')} <strong>+{calculatePoints()}</strong> {t('points')}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </LocalizationProvider>
            <Footer />
        </>
    );
}
