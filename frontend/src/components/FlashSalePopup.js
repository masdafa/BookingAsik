import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const FlashSalePopup = ({ show, onClose }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(5);

    useEffect(() => {
        if (!show) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onClose();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [show, onClose]);

    const handleViewDeals = () => {
        onClose();
        navigate('/deals');
    };

    return (
        <AnimatePresence>
            {show && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            zIndex: 9998,
                            backdropFilter: 'blur(5px)',
                        }}
                        onClick={onClose}
                    />

                    {/* Popup Container - Centered with Flexbox */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{
                            type: 'spring',
                            damping: 15,
                            stiffness: 300,
                            duration: 0.5
                        }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pointerEvents: 'none',
                        }}
                    >
                        <Box
                            sx={{
                                width: '90%',
                                maxWidth: '500px',
                                pointerEvents: 'auto',
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 25%, #ff4757 50%, #c44569 75%, #ff6b35 100%)',
                                    backgroundSize: '400% 400%',
                                    animation: 'gradientShift 3s ease infinite',
                                    boxShadow: '0 25px 80px rgba(255, 107, 53, 0.5), 0 0 100px rgba(255, 71, 87, 0.3)',
                                    '@keyframes gradientShift': {
                                        '0%': { backgroundPosition: '0% 50%' },
                                        '50%': { backgroundPosition: '100% 50%' },
                                        '100%': { backgroundPosition: '0% 50%' },
                                    },
                                }}
                            >
                                {/* Animated particles background */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        overflow: 'hidden',
                                        pointerEvents: 'none',
                                    }}
                                >
                                    {[...Array(20)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{
                                                x: Math.random() * 500,
                                                y: Math.random() * 300,
                                                opacity: 0
                                            }}
                                            animate={{
                                                y: [null, Math.random() * -100 - 50],
                                                opacity: [0, 1, 0],
                                            }}
                                            transition={{
                                                duration: 2 + Math.random() * 2,
                                                repeat: Infinity,
                                                delay: Math.random() * 2,
                                            }}
                                            style={{
                                                position: 'absolute',
                                                width: 8 + Math.random() * 8,
                                                height: 8 + Math.random() * 8,
                                                borderRadius: '50%',
                                                background: 'rgba(255, 255, 255, 0.6)',
                                            }}
                                        />
                                    ))}
                                </Box>

                                {/* Close button */}
                                <IconButton
                                    onClick={onClose}
                                    sx={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        color: 'white',
                                        bgcolor: 'rgba(0, 0, 0, 0.2)',
                                        zIndex: 10,
                                        '&:hover': {
                                            bgcolor: 'rgba(0, 0, 0, 0.4)',
                                            transform: 'rotate(90deg)',
                                        },
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>

                                {/* Content */}
                                <Box sx={{ p: 4, pt: 5, textAlign: 'center', position: 'relative', zIndex: 5 }}>
                                    {/* Flash icon with pulse animation */}
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            rotate: [0, 5, -5, 0],
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            repeat: Infinity,
                                            repeatDelay: 0.5,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: 80,
                                                height: 80,
                                                borderRadius: '50%',
                                                background: 'rgba(255, 255, 255, 0.2)',
                                                mb: 2,
                                                boxShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
                                            }}
                                        >
                                            <LocalFireDepartmentIcon sx={{ fontSize: 50, color: 'white' }} />
                                        </Box>
                                    </motion.div>

                                    {/* Title with bounce effect */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <Typography
                                            variant="h3"
                                            sx={{
                                                fontWeight: 900,
                                                color: 'white',
                                                textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                                                mb: 1,
                                                letterSpacing: '-1px',
                                            }}
                                        >
                                            ⚡ FLASH SALE! ⚡
                                        </Typography>
                                    </motion.div>

                                    {/* Discount badge */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.4, type: 'spring' }}
                                    >
                                        <Chip
                                            icon={<LocalOfferIcon sx={{ color: '#ff4757 !important' }} />}
                                            label="UP TO 50% OFF"
                                            sx={{
                                                bgcolor: 'white',
                                                color: '#ff4757',
                                                fontWeight: 800,
                                                fontSize: '1.1rem',
                                                py: 3,
                                                px: 2,
                                                mb: 2,
                                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                                                animation: 'pulse 1.5s ease infinite',
                                                '@keyframes pulse': {
                                                    '0%, 100%': { transform: 'scale(1)' },
                                                    '50%': { transform: 'scale(1.05)' },
                                                },
                                            }}
                                        />
                                    </motion.div>

                                    {/* Subtitle */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.95)',
                                                mb: 3,
                                                fontWeight: 500,
                                            }}
                                        >
                                            Selamat datang kembali! 🎉<br />
                                            Nikmati penawaran spesial hanya untuk Anda!
                                        </Typography>
                                    </motion.div>

                                    {/* Timer */}
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 1,
                                            mb: 3,
                                            color: 'rgba(255, 255, 255, 0.9)',
                                        }}
                                    >
                                        <AccessTimeIcon />
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            Banner akan hilang dalam {timeLeft} detik
                                        </Typography>
                                    </Box>

                                    {/* CTA Button */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            variant="contained"
                                            size="large"
                                            onClick={handleViewDeals}
                                            sx={{
                                                bgcolor: 'white',
                                                color: '#ff4757',
                                                fontWeight: 800,
                                                fontSize: '1.1rem',
                                                px: 5,
                                                py: 1.5,
                                                borderRadius: '50px',
                                                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                                                '&:hover': {
                                                    bgcolor: '#ffe6e9',
                                                    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.3)',
                                                },
                                                transition: 'all 0.3s ease',
                                            }}
                                        >
                                            🔥 LIHAT PENAWARAN
                                        </Button>
                                    </motion.div>

                                    {/* Skip text */}
                                    <Typography
                                        variant="body2"
                                        onClick={onClose}
                                        sx={{
                                            color: 'rgba(255, 255, 255, 0.7)',
                                            mt: 2,
                                            cursor: 'pointer',
                                            '&:hover': { color: 'white', textDecoration: 'underline' },
                                            transition: 'color 0.2s ease',
                                        }}
                                    >
                                        Atau klik di mana saja untuk menutup
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FlashSalePopup;
