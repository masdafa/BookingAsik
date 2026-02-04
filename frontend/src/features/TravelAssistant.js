import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Avatar,
  CircularProgress,
  Chip,
  Fab,
  Zoom,
  Fade,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Button
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import api from '../api/axios';

// Component untuk menampilkan hotel card di dalam chat
const HotelChatCard = ({ hotel, onClick }) => {
  const imageUrl = hotel.image?.startsWith('http')
    ? hotel.image
    : `http://localhost:4000/hotels/${hotel.image}`;

  return (
    <Card
      onClick={onClick}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 280,
        cursor: 'pointer',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        }
      }}
    >
      <CardMedia
        component="img"
        height="120"
        image={imageUrl}
        alt={hotel.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ p: 1.5, pb: '12px !important' }}>
        <Typography
          variant="subtitle2"
          fontWeight={700}
          noWrap
          sx={{ color: '#003b95', mb: 0.5 }}
        >
          {hotel.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <LocationOnIcon sx={{ fontSize: 14, color: '#757575' }} />
          <Typography variant="caption" color="text.secondary">
            {hotel.city}
          </Typography>
        </Box>
        {hotel.rating && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <Rating value={hotel.rating} size="small" readOnly precision={0.5} />
            <Typography variant="caption" color="text.secondary">
              ({hotel.rating})
            </Typography>
          </Box>
        )}
        <Typography
          variant="caption"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            color: '#666',
            lineHeight: 1.4,
            mb: 1
          }}
        >
          {hotel.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" fontWeight={700} color="primary">
            Rp {hotel.price?.toLocaleString('id-ID')}
          </Typography>
          <Button
            size="small"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
            sx={{
              fontSize: '0.7rem',
              textTransform: 'none',
              color: '#003b95',
              p: 0,
              minWidth: 'auto',
              '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
            }}
          >
            Lihat Detail
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

const TravelAssistant = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Halo! Saya asisten travel kamu. Mau cari hotel di mana? Ketik nama kota atau tipe hotel yang kamu inginkan!",
      sender: 'ai',
      timestamp: new Date(),
      hotels: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [allHotels, setAllHotels] = useState([]);
  const messagesEndRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Fetch hotels on component mount
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await api.get('/hotels');
        setAllHotels(response.data || []);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };
    fetchHotels();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 8000);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setShowTooltip(false);
    }
  }, [messages, isOpen]);

  const findHotelsFromQuery = (query) => {
    const lowerQuery = query.toLowerCase();

    // Keywords untuk berbagai kriteria pencarian
    const cityKeywords = ['bali', 'jakarta', 'bandung', 'bogor', 'surabaya', 'yogyakarta', 'medan', 'makassar', 'semarang', 'palembang', 'serang', 'depok', 'tangerang', 'bekasi', 'malang', 'tangerang selatan'];
    const budgetKeywords = ['murah', 'budget', 'hemat', 'affordable', 'cheap', 'ekonomis'];
    const luxuryKeywords = ['mewah', 'luxury', 'premium', 'bintang 5', 'five star', 'mahal'];
    const familyKeywords = ['keluarga', 'family', 'anak', 'kids', 'children'];
    const beachKeywords = ['pantai', 'beach', 'laut', 'seaside'];
    const mountainKeywords = ['gunung', 'mountain', 'highland', 'sejuk', 'dingin'];

    let filteredHotels = [...allHotels];
    let responseText = '';

    // Filter berdasarkan kota
    const matchedCity = cityKeywords.find(city => lowerQuery.includes(city));
    if (matchedCity) {
      filteredHotels = filteredHotels.filter(h =>
        h.city?.toLowerCase().includes(matchedCity)
      );
      responseText = `Ini dia rekomendasi hotel terbaik di ${matchedCity.charAt(0).toUpperCase() + matchedCity.slice(1)}! 🏨`;
    }

    // Filter berdasarkan budget
    if (budgetKeywords.some(k => lowerQuery.includes(k))) {
      filteredHotels = filteredHotels.sort((a, b) => (a.price || 0) - (b.price || 0));
      responseText = responseText || 'Ini pilihan hotel dengan harga terjangkau untuk kamu! 💰';
    }

    // Filter berdasarkan luxury
    if (luxuryKeywords.some(k => lowerQuery.includes(k))) {
      filteredHotels = filteredHotels.sort((a, b) => (b.price || 0) - (a.price || 0));
      responseText = responseText || 'Berikut hotel mewah dengan fasilitas premium! ✨';
    }

    // Filter berdasarkan family
    if (familyKeywords.some(k => lowerQuery.includes(k))) {
      responseText = responseText || 'Hotel-hotel ini cocok untuk liburan keluarga! 👨‍👩‍👧‍👦';
    }

    // Filter berdasarkan pantai
    if (beachKeywords.some(k => lowerQuery.includes(k))) {
      filteredHotels = filteredHotels.filter(h =>
        h.description?.toLowerCase().includes('pantai') ||
        h.description?.toLowerCase().includes('beach') ||
        h.city?.toLowerCase() === 'bali'
      );
      responseText = responseText || 'Hotel dengan pemandangan pantai yang indah! 🏖️';
    }

    // Filter berdasarkan gunung
    if (mountainKeywords.some(k => lowerQuery.includes(k))) {
      filteredHotels = filteredHotels.filter(h =>
        h.description?.toLowerCase().includes('gunung') ||
        h.description?.toLowerCase().includes('mountain') ||
        h.city?.toLowerCase() === 'bandung' ||
        h.city?.toLowerCase() === 'bogor'
      );
      responseText = responseText || 'Hotel dengan suasana pegunungan yang sejuk! 🏔️';
    }

    // Jika tidak ada filter yang cocok, tampilkan rekomendasi umum
    if (!responseText) {
      responseText = 'Berikut beberapa rekomendasi hotel terbaik untuk kamu! Klik untuk melihat detail. 🌟';
    }

    // Ambil maksimal 3 hotel
    const recommendedHotels = filteredHotels.slice(0, 3);

    if (recommendedHotels.length === 0) {
      return {
        text: 'Maaf, saya tidak menemukan hotel yang sesuai. Coba cari dengan kata kunci lain seperti nama kota (Bali, Jakarta, Bandung) atau tipe hotel (mewah, murah, keluarga).',
        hotels: []
      };
    }

    return {
      text: responseText,
      hotels: recommendedHotels
    };
  };

  const getAIResponse = async (userMessage) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = findHotelsFromQuery(userMessage);
        resolve(result);
      }, 800 + Math.random() * 1000);
    });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const aiResponse = await getAIResponse(input);
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse.text,
        sender: 'ai',
        timestamp: new Date(),
        hotels: aiResponse.hotels || []
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        sender: 'ai',
        timestamp: new Date(),
        hotels: []
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleHotelClick = (hotelId) => {
    setIsOpen(false);
    navigate(`/hotel/${hotelId}`);
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const quickQuestions = [
    "Hotel di Bali",
    "Hotel murah",
    "Hotel keluarga",
    "Hotel mewah"
  ];

  return (
    <>
      {/* Toggle Button (FAB) */}
      <Zoom in={!isOpen}>
        <Fab
          color="primary"
          aria-label="chat"
          onClick={() => setIsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            zIndex: 1300,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            background: 'linear-gradient(135deg, #003b95, #1a73e8)',
            width: 56, // Standard FAB size
            height: 56,
            overflow: 'visible' // Allow text bubble to be visible
          }}
        >
          {/* Text Bubble - Shows when chat is closed */}
          {!isOpen && showTooltip && (
            <Fade in={true} timeout={1000}>
              <Paper
                sx={{
                  position: 'absolute',
                  right: '100%',
                  bottom: '50%',
                  transform: 'translateY(50%)', // Center text vertically relative to fab
                  mr: 2, // Margin from fab
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'white',
                  color: '#333',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  '&::after': { // Arrow pointing to fab
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    right: '-8px',
                    marginTop: '-8px',
                    borderWidth: '8px',
                    borderStyle: 'solid',
                    borderColor: 'transparent transparent transparent white'
                  }
                }}
              >
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.85rem' }}>
                  Bingung milihnya? Chat kami aja!
                </Typography>
              </Paper>
            </Fade>
          )}
          <ChatIcon />
        </Fab>
      </Zoom>

      {/* Chat Window */}
      <Fade in={isOpen}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 100, // Above FAB
            right: 30,
            zIndex: 1300,
            width: { xs: '90%', sm: '400px' }, // Responsive width
            maxHeight: '600px',
            display: isOpen ? 'block' : 'none' // Prevent interaction when closed
          }}
        >
          <Paper
            elevation={10}
            sx={{
              height: '500px',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 2,
                background: 'linear-gradient(135deg, #003b95, #1a73e8)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: 'white', color: '#003b95', width: 36, height: 36 }}>
                  <SmartToyIcon fontSize="small" />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
                    Travel Assistant
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Online & Ready to help
                  </Typography>
                </Box>
              </Box>
              <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Quick Questions */}
            <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #f0f0f0' }}>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {quickQuestions.map((question, index) => (
                  <Chip
                    key={index}
                    label={question}
                    size="small"
                    onClick={() => handleQuickQuestion(question)}
                    sx={{
                      cursor: 'pointer',
                      bgcolor: 'white',
                      border: '1px solid #e0e0e0',
                      '&:hover': { bgcolor: '#e3f2fd', borderColor: '#2196f3', color: '#0d47a1' }
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Messages */}
            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                p: 2,
                bgcolor: '#f8f9fa',
                backgroundImage: 'radial-gradient(#e0e0e0 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            >
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2,
                    animation: 'fadeIn 0.3s ease-in'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%', justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                    {message.sender === 'ai' && (
                      <Avatar sx={{ mr: 1, bgcolor: '#003b95', width: 32, height: 32, flexShrink: 0 }}>
                        <SmartToyIcon sx={{ fontSize: 16 }} />
                      </Avatar>
                    )}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        maxWidth: '75%',
                        bgcolor: message.sender === 'user' ? '#003b95' : 'white',
                        color: message.sender === 'user' ? 'white' : 'text.primary',
                        borderRadius: message.sender === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                        border: message.sender === 'ai' ? '1px solid #e0e0e0' : 'none'
                      }}
                    >
                      <Typography variant="body2" lineHeight={1.5}>{message.text}</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                          opacity: 0.7,
                          fontSize: '0.65rem',
                          textAlign: message.sender === 'user' ? 'right' : 'left'
                        }}
                      >
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Paper>
                  </Box>

                  {/* Hotel Cards - Only show for AI messages with hotels */}
                  {message.sender === 'ai' && message.hotels && message.hotels.length > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1.5,
                        mt: 1.5,
                        ml: 5, // Align with message content (Avatar width + margin)
                        width: 'calc(100% - 40px)'
                      }}
                    >
                      {message.hotels.map((hotel) => (
                        <HotelChatCard
                          key={hotel.id || hotel._id}
                          hotel={hotel}
                          onClick={() => handleHotelClick(hotel.id || hotel._id)}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
              {loading && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Avatar sx={{ mr: 1, bgcolor: '#003b95', width: 32, height: 32 }}>
                    <SmartToyIcon sx={{ fontSize: 16 }} />
                  </Avatar>
                  <Box sx={{ bgcolor: 'white', p: 1.5, borderRadius: '4px 18px 18px 18px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <CircularProgress size={16} />
                  </Box>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input */}
            <Box
              sx={{
                p: 2,
                bgcolor: 'white',
                borderTop: '1px solid #e0e0e0',
                display: 'flex',
                gap: 1
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '24px',
                    backgroundColor: '#f5f5f5',
                    '& fieldset': { borderColor: 'transparent' },
                    '&:hover fieldset': { borderColor: '#e0e0e0' },
                    '&.Mui-focused fieldset': { borderColor: '#003b95' },
                  }
                }}
              />
              <IconButton
                onClick={handleSendMessage}
                disabled={!input.trim() || loading}
                sx={{
                  bgcolor: '#003b95',
                  color: 'white',
                  width: 40,
                  height: 40,
                  '&:hover': { bgcolor: '#00296b' },
                  '&.Mui-disabled': { bgcolor: '#bdbdbd', color: 'white' }
                }}
              >
                <SendIcon fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        </Box>
      </Fade>
    </>
  );
};

export default TravelAssistant;
