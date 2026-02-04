// src/pages/TeamPage.js
import React from 'react';
import { Container, Typography, Box, Card, CardContent, Avatar, Grid, Chip, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CodeIcon from '@mui/icons-material/Code';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import StorageIcon from '@mui/icons-material/Storage';
import WebIcon from '@mui/icons-material/Web';
import DatabaseIcon from '@mui/icons-material/Storage';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';

const TeamPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    
    const teamMembers = [
        { 
            name: "Dafa Naufal Yunidar", 
            nim: "14022300026", 
            role: "Ketua Kelompok dan Testing Control",
            avatar: null,
            description: "Memimpin tim dalam pengembangan sistem dan koordinasi proyek dengan penuh tanggung jawab.",
            gender: "male"
        },
        {
            name: "Aldi Nurhadi",
            nim: "140223000",
            role: "Frontend Developer",
            avatar: null,
            description: "Bertanggung jawab atas pengembangan antarmuka pengguna yang responsif dan menarik.",
            gender: "male"
        },
        {
            name: "Zweta Tri Rahma",
            nim: "140223000",
            role: "Backend Developer",
            avatar: null,
            description: "Mengelola logika server dan integrasi database untuk memastikan performa sistem yang optimal.",
            gender: "female"
        },
        {
            name: "Rindy Dwi Safitri",
            nim: "140223000",
            role: "Database Administrator",
            avatar: null,
            description: "Bertanggung jawab atas perancangan dan pemeliharaan database yang efisien dan aman.",
            gender: "female"
        }
    ];

    const technologies = [
        { name: "React", icon: <WebIcon />, color: "#61DAFB" },
        { name: "Node.js", icon: <CodeIcon />, color: "#339933" },
        { name: "MySQL", icon: <DatabaseIcon />, color: "#4479A1" },
        { name: "Material-UI", icon: <DesignServicesIcon />, color: "#007FFF" },
        { name: "Express", icon: <CodeIcon />, color: "#000000" },
        { name: "JWT", icon: <WebIcon />, color: "#000000" }
    ];

    const handleBackToHome = () => {
        navigate('/');
    };

    const getAvatar = (gender, name) => {
        if (gender === "male") {
            return (
                <Avatar 
                    sx={{ 
                        width: 120, 
                        height: 120, 
                        mb: 3,
                        bgcolor: '#2196F3',
                        fontSize: '3rem',
                        fontWeight: 600
                    }}
                >
                    <ManIcon sx={{ fontSize: '4rem' }} />
                </Avatar>
            );
        } else if (gender === "female") {
            return (
                <Avatar 
                    sx={{ 
                        width: 120, 
                        height: 120, 
                        mb: 3,
                        bgcolor: '#E91E63',
                        fontSize: '3rem',
                        fontWeight: 600
                    }}
                >
                    <WomanIcon sx={{ fontSize: '4rem' }} />
                </Avatar>
            );
        } else {
            return (
                <Avatar 
                    sx={{ 
                        width: 120, 
                        height: 120, 
                        mb: 3,
                        bgcolor: 'primary.main',
                        fontSize: '3rem',
                        fontWeight: 600
                    }}
                >
                    {name.split(' ').map(n => n.charAt(0)).join('')}
                </Avatar>
            );
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Back Button and Header Section */}
            <Box sx={{ mb: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBackToHome}
                    variant="outlined"
                    sx={{ 
                        mb: 3,
                        fontWeight: 600,
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                            borderColor: 'primary.dark',
                            backgroundColor: 'primary.light',
                            color: 'primary.dark'
                        }
                    }}
                >
                    Kembali ke Home
                </Button>
                
                <Box sx={{ textAlign: 'center' }}>
                    <Typography 
                        variant="h2" 
                        gutterBottom
                        sx={{ 
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #1a73e8 0%, #00b4d8 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 2
                        }}
                    >
                        Project Kelompok Hotel
                    </Typography>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            color: 'text.secondary',
                            maxWidth: '800px',
                            mx: 'auto',
                            lineHeight: 1.6
                        }}
                    >
                        Membangun solusi reservasi hotel modern dengan teknologi terkini untuk memberikan 
                        pengalaman terbaik bagi pengguna.
                    </Typography>
                </Box>
            </Box>

            {/* Project Description Section */}
            <Box sx={{ mb: 10, textAlign: 'center' }}>
                <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{ 
                        fontWeight: 700,
                        color: 'primary.main',
                        mb: 4
                    }}
                >
                    Tentang Proyek Ini
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Card 
                            sx={{ 
                                p: 4, 
                                height: '100%',
                                boxShadow: 3,
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 6
                                }
                            }}
                        >
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                                Tujuan Proyek
                            </Typography>
                            <Typography variant="body1" sx={{ lineHeight: 1.7, fontSize: '1.1rem' }}>
                                Mengembangkan sistem reservasi hotel yang efisien, user-friendly, dan dapat diandalkan 
                                untuk memenuhi kebutuhan bisnis perhotelan modern.
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card 
                            sx={{ 
                                p: 4, 
                                height: '100%',
                                boxShadow: 3,
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 6
                                }
                            }}
                        >
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                                Teknologi yang Digunakan
                            </Typography>
                            <Typography variant="body1" sx={{ lineHeight: 1.7, fontSize: '1.1rem', mb: 3 }}>
                                Menggunakan stack modern seperti React, Node.js, dan MySQL sebagai database untuk 
                                memastikan performa dan skalabilitas sistem reservasi.
                            </Typography>
                            
                            {/* Technology Chips */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                                {technologies.map((tech, index) => (
                                    <Chip
                                        key={index}
                                        icon={tech.icon}
                                        label={tech.name}
                                        sx={{ 
                                            bgcolor: tech.color,
                                            color: 'white',
                                            fontWeight: 600,
                                            '& .MuiChip-icon': {
                                                color: 'white'
                                            }
                                        }}
                                    />
                                ))}
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* Technology Showcase Section */}
            <Box sx={{ mb: 10, textAlign: 'center' }}>
                <Typography 
                    variant="h4" 
                    gutterBottom
                    sx={{ 
                        fontWeight: 700,
                        color: 'primary.main',
                        mb: 4
                    }}
                >
                    Stack Teknologi Utama
                </Typography>
                <Grid container spacing={3} justifyContent="center">
                    {technologies.map((tech, index) => (
                        <Grid item xs={6} sm={4} md={2} key={index}>
                            <Card 
                                sx={{ 
                                    p: 3, 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: 2,
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                <Box sx={{ 
                                    mb: 2,
                                    color: tech.color,
                                    fontSize: '3rem'
                                }}>
                                    {tech.icon}
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {tech.name}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Team Section */}
            <Box sx={{ mb: 6 }}>
                <Typography 
                    variant="h4" 
                    align="center" 
                    gutterBottom
                    sx={{ 
                        fontWeight: 700,
                        color: 'primary.main',
                        mb: 2
                    }}
                >
                    Tim Pengembang
                </Typography>
                <Typography 
                    variant="body1" 
                    align="center" 
                    sx={{ 
                        color: 'text.secondary',
                        maxWidth: '700px',
                        mx: 'auto',
                        mb: 6,
                        lineHeight: 1.7,
                        fontSize: '1.1rem'
                    }}
                >
                    Proyek ini dikembangkan oleh tim yang berdedikasi tinggi, terdiri dari individu-individu 
                    berbakat yang bekerja sama dengan komitmen untuk menciptakan solusi terbaik dalam bidang 
                    teknologi informasi perhotelan. Kami bangga mempersembahkan hasil kerja keras kami melalui proyek ini,
                    dan berterima kasih kepada bapak dosen mata kuliah Pemrograman Berbasis Web 2 Pak Rahadian Arief, ST., M.Kom atas bimbingannya.
                    Dengan bimbingannya kami dapat menyelesaikan proyek ini dengan baik.
                </Typography>
            </Box>

            {/* Team Members Grid */}
            <Grid container spacing={4} justifyContent="center">
                {teamMembers.map((member, index) => (
                    <Grid item xs={12} sm={8} md={6} key={index}>
                        <Card 
                            sx={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                p: 4,
                                textAlign: 'center',
                                boxShadow: 3,
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: 6
                                }
                            }}
                        >
                            {getAvatar(member.gender, member.name)}
                            
                            <CardContent>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                                    {member.name}
                                </Typography>
                                <Typography variant="body1" color="textSecondary" sx={{ mb: 1, fontSize: '1.1rem' }}>
                                    NIM: {member.nim}
                                </Typography>
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        fontWeight: 600,
                                        color: 'primary.main',
                                        mb: 2
                                    }}
                                >
                                    {member.role}
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        lineHeight: 1.7,
                                        fontStyle: 'italic',
                                        color: 'text.secondary',
                                        fontSize: '1rem'
                                    }}
                                >
                                    "{member.description}"
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Closing Message */}
            <Box sx={{ textAlign: 'center', mt: 10, p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Terima Kasih
                </Typography>
                <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto', lineHeight: 1.7, fontSize: '1.1rem' }}>
                    Kami mengucapkan terima kasih kepada semua pihak yang telah mendukung pengembangan proyek ini. 
                    Semoga solusi yang kami buat dapat bermanfaat bagi industri perhotelan dan memberikan pengalaman 
                    terbaik bagi para pengguna.
                </Typography>
            </Box>
        </Container>
    );
};

export default TeamPage;
