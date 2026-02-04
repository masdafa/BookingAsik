import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    const companyLinks = [
        { label: t('footer_about_us'), to: '/team' },
        { label: t('footer_careers'), to: '/' },
        { label: t('footer_blog'), to: '/' },
        { label: t('footer_press'), to: '/' },
        { label: t('footer_partners'), to: '/' },
    ];

    const supportLinks = [
        { label: t('footer_help_center'), to: '/' },
        { label: t('footer_faq'), to: '/' },
        { label: t('footer_privacy_policy'), to: '/' },
        { label: t('footer_terms'), to: '/' },
        { label: t('footer_security'), to: '/' },
    ];

    return (
        <Box
            component="footer"
            sx={{
                background: 'linear-gradient(180deg, #0a1628 0%, #0d1f3c 100%)',
                color: 'white',
                pt: 8,
                pb: 4,
                mt: 8,
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Company Profile */}
                    <Grid item xs={12} md={4}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 800,
                                mb: 2,
                                background: 'linear-gradient(135deg, #1a73e8 0%, #00b4d8 100%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            {t('footer_company_name')}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, mb: 3 }}>
                            {t('footer_company_desc')}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                                size="small"
                                sx={{
                                    color: 'white',
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    '&:hover': { bgcolor: '#1877f2', transform: 'translateY(-3px)' },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <FacebookIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                sx={{
                                    color: 'white',
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    '&:hover': { bgcolor: '#1da1f2', transform: 'translateY(-3px)' },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <TwitterIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                sx={{
                                    color: 'white',
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                                        transform: 'translateY(-3px)'
                                    },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <InstagramIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                sx={{
                                    color: 'white',
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    '&:hover': { bgcolor: '#0077b5', transform: 'translateY(-3px)' },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <LinkedInIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                sx={{
                                    color: 'white',
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    '&:hover': { bgcolor: '#ff0000', transform: 'translateY(-3px)' },
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <YouTubeIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: 'white' }}>
                            {t('footer_company_section')}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {companyLinks.map((item) => (
                                <Link
                                    key={item.label}
                                    component={RouterLink}
                                    to={item.to}
                                    sx={{
                                        color: 'rgba(255,255,255,0.7)',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s ease',
                                        '&:hover': { color: '#1a73e8', pl: 0.5 },
                                    }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </Box>
                    </Grid>

                    {/* Support */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: 'white' }}>
                            {t('footer_support_section')}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {supportLinks.map((item) => (
                                <Link
                                    key={item.label}
                                    component={RouterLink}
                                    to={item.to}
                                    sx={{
                                        color: 'rgba(255,255,255,0.7)',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s ease',
                                        '&:hover': { color: '#1a73e8', pl: 0.5 },
                                    }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </Box>
                    </Grid>

                    {/* Contact Info */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: 'white' }}>
                            {t('footer_contact_section')}
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #1a73e8 0%, #0057d8 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <LocationOnIcon sx={{ fontSize: 18, color: 'white' }} />
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', mb: 0.3 }}>
                                        {t('footer_office_address')}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                                        {t('footer_address_line1')}<br />
                                        {t('footer_address_line2')}
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #00b894 0%, #00cec9 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <PhoneIcon sx={{ fontSize: 18, color: 'white' }} />
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', mb: 0.3 }}>
                                        {t('footer_phone')}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                        +62 21 1234 5678<br />
                                        +62 812 3456 7890 (WhatsApp)
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #e17055 0%, #fdcb6e 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <EmailIcon sx={{ fontSize: 18, color: 'white' }} />
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', mb: 0.3 }}>
                                        {t('footer_email')}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                        info@bookingasik.com<br />
                                        support@bookingasik.com
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    <AccessTimeIcon sx={{ fontSize: 18, color: 'white' }} />
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'white', mb: 0.3 }}>
                                        {t('footer_hours')}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                        {t('footer_weekday_hours')}<br />
                                        {t('footer_weekend_hours')}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

                {/* Bottom Bar */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', textAlign: { xs: 'center', md: 'left' } }}>
                        © {currentYear} {t('footer_company_name')}. {t('footer_copyright')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {[t('footer_privacy_policy'), t('footer_service_terms'), t('footer_cookie_policy')].map((item) => (
                            <Link
                                key={item}
                                component={RouterLink}
                                to="/"
                                sx={{
                                    color: 'rgba(255,255,255,0.5)',
                                    textDecoration: 'none',
                                    fontSize: '0.85rem',
                                    transition: 'color 0.2s ease',
                                    '&:hover': { color: '#1a73e8' },
                                }}
                            >
                                {item}
                            </Link>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
