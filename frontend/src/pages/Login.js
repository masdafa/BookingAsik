import React, { useState } from "react";
import {
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    useTheme,
    Container,
    Avatar
} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
// Background Image (Local) - Ensure this file is moved to public or imported correctly
// For now, we use the generated artifact path directly or serve it via a public URL if possible.
// Since we can't move files to public easily, we will reference the artifact in the project if it was in src.
// But mostly we assume the user puts assets in `public`. 
// For this environment, we will use a placeholder or data URI if needed, but let's try a direct path or URL.
// Actually, best practice here is to simply use the path provided by the user upload if permissible, 
// OR simpler: Use the generated image as a locally imported file if we could move it.
// Given constraints, I will use a high-quality Unsplash URL as a reliable placeholder for "Raja Ampat" 
// to ensure it renders immediately without file system issues, OR I'll assume standard project structure.
// Let's use the local file technique: assuming the image is in the public folder.
// I will update the code to use the generated image path.

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    const theme = useTheme();

    const { login } = useAuth();
    const { t } = useTranslation();

    const submit = async () => {
        setErrorMsg("");

        if (!form.email || !form.password) {
            setErrorMsg(t('error_email_password_required'));
            return;
        }

        try {
            setLoading(true);
            const loggedInUser = await login(form.email, form.password);

            if (loggedInUser.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }
        } catch (err) {
            setErrorMsg(err.message || t('error_login_failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // Local generated background or reliable URL
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/raja_ampat_background_login.png')`,
                // Fallback to a nice gradient if image fails

                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    elevation={24}
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        borderRadius: 4,
                        // Glassmorphism
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
                        <LockOutlinedIcon fontSize="large" />
                    </Avatar>

                    <Typography component="h1" variant="h4" sx={{
                        color: 'white',
                        fontWeight: 800,
                        mb: 1,
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        BookingAsik<span style={{ color: '#ffb74d' }}>.com</span>
                    </Typography>

                    <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3 }}>
                        {t('welcome_back_title')}
                    </Typography>

                    {errorMsg && (
                        <Box sx={{
                            p: 2,
                            width: '100%',
                            bgcolor: 'rgba(211, 47, 47, 0.8)',
                            color: 'white',
                            borderRadius: 2,
                            mb: 2,
                            backdropFilter: 'blur(4px)'
                        }}>
                            <Typography variant="body2" align="center">{errorMsg}</Typography>
                        </Box>
                    )}

                    <Box component="form" noValidate sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label={t('email_label')}
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                                    '&:hover fieldset': { borderColor: 'white' },
                                    '&.Mui-focused fieldset': { borderColor: '#ffb74d' },
                                },
                                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#ffb74d' },
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label={t('password_label')}
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={form.password}
                            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                                    '&:hover fieldset': { borderColor: 'white' },
                                    '&.Mui-focused fieldset': { borderColor: '#ffb74d' },
                                },
                                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#ffb74d' },
                            }}
                        />

                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            onClick={submit}
                            disabled={loading}
                            sx={{
                                mt: 3,
                                mb: 2,
                                py: 1.5,
                                bgcolor: '#ffb74d', // Gold button
                                color: '#000',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                '&:hover': {
                                    bgcolor: '#ffa726',
                                }
                            }}
                        >
                            {loading ? t('logging_in') : t('login_button')}
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => navigate("/register")}
                            sx={{
                                mb: 1,
                                color: 'white',
                                borderColor: 'white',
                                '&:hover': {
                                    borderColor: '#ffb74d',
                                    color: '#ffb74d',
                                    bgcolor: 'rgba(255,255,255,0.1)'
                                }
                            }}
                        >
                            {t('create_account_button')}
                        </Button>

                        <Button
                            fullWidth
                            size="small"
                            onClick={() => navigate("/")}
                            sx={{ color: 'rgba(255,255,255,0.7)', textTransform: 'none' }}
                        >
                            {t('back_to_home')}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}