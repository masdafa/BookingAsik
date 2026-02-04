import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { LanguageProvider } from "./context/LanguageContext";

// Public Pages
import Home from "./pages/Home";
import HotelDetail from "./pages/HotelDetail";
import Booking from "./pages/Booking";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookingSuccess from './pages/BookingSuccess';
import YourBooking from './pages/YourBooking';
import Profile from './pages/Profile';
import Loyalty from './pages/Loyalty';
import Deals from './pages/Deals'; // Komponen yang akan menangani Flash Deals
import SearchResults from './pages/SearchResults';
import Attractions from './pages/Attractions';
import AttractionDetail from './pages/AttractionDetail';
import AttractionBooking from './pages/AttractionBooking';
import TeamPage from './pages/TeamPage'; // 👈 Import TeamPage

// Layouts
import MainLayout from "./layout/MainLayout";
import AdminLayout from "./layout/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin Pages
import HotelAdminPage from "./pages/admin/HotelAdminPage";
import HotelAdminCreate from "./pages/admin/HotelAdminCreate";
import HotelAdminEdit from "./pages/admin/HotelAdminEdit";
import AttractionAdminPage from "./pages/admin/AttractionAdminPage";
import UserAdminPage from "./pages/admin/UserAdminPage";
import BookingAdminPage from "./pages/admin/BookingAdminPage";
import InvoiceAdminPage from "./pages/admin/InvoiceAdminPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ReviewAdminPage from "./pages/admin/ReviewAdminPage";
import LoyaltyAdminPage from "./pages/admin/LoyaltyAdminPage";

// Features
import TravelAssistant from "./features/TravelAssistant";
import './i18n';

// Theme Configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#003b95',
    },
    secondary: {
      main: '#ff6b00',
    },
    success: {
      main: '#00b289',
    },
    warning: {
      main: '#ffb100',
    },
    error: {
      main: '#ff385c',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Handle online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <FavoritesProvider>
          <LanguageProvider>
            <Routes>
              {/* ========= PUBLIC AREA ========= */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/hotel/:id" element={<HotelDetail />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/your-booking" element={
                  <ProtectedRoute>
                    <YourBooking />
                  </ProtectedRoute>
                } />
                <Route path="/favorites" element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/loyalty" element={
                  <ProtectedRoute>
                    <Loyalty />
                  </ProtectedRoute>
                } />
                {/* Rute /deals yang sudah ada */}
                <Route path="/deals" element={<Deals />} />
                {/* 🚀 RUTE BARU UNTUK FLASH SALE */}
                <Route path="/flash-deals" element={<Deals />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/assistant" element={<TravelAssistant />} />
                {/* 🏝️ ATTRACTIONS ROUTES */}
                <Route path="/attractions" element={<Attractions />} />
                <Route path="/attractions/:id" element={<AttractionDetail />} />
                <Route path="/attractions/:id/book" element={
                  <ProtectedRoute>
                    <AttractionBooking />
                  </ProtectedRoute>
                } />
                {/* 👇 Route untuk TeamPage */}
                <Route path="/team" element={<TeamPage />} />
              </Route>

              <Route path="/booking-success" element={<BookingSuccess />} />

              {/* ========= AUTH ========= */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ========= ADMIN AREA (Menggunakan ProtectedRoute dengan admin=true) ========= */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute admin={true}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="hotels" element={<HotelAdminPage />} />
                <Route path="hotels/create" element={<HotelAdminCreate />} />
                <Route path="hotels/edit/:id" element={<HotelAdminEdit />} />
                <Route path="attractions" element={<AttractionAdminPage />} />
                <Route path="users" element={<UserAdminPage />} />
                <Route path="bookings" element={<BookingAdminPage />} />
                <Route path="invoices" element={<InvoiceAdminPage />} />
                <Route path="reviews" element={<ReviewAdminPage />} />
                <Route path="loyalty" element={<LoyaltyAdminPage />} />
              </Route>

              {/* ========= ERROR PAGES (404 Not Found) ========= */}
              <Route path="*" element={
                <MainLayout>
                  <div style={{
                    textAlign: 'center',
                    padding: '50px',
                    minHeight: '60vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <h1>404 - Page Not Found</h1>
                    <p>The page you are looking for doesn't exist.</p>
                    <button
                      onClick={() => window.history.back()}
                      style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        backgroundColor: '#003b95',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      Go Back
                    </button>
                  </div>
                </MainLayout>
              } />
            </Routes>

            {/* Offline Indicator */}
            {!isOnline && (
              <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#ff385c',
                color: 'white',
                textAlign: 'center',
                padding: '10px',
                zIndex: 9999
              }}>
                You are currently offline. Some features may not work properly.
              </div>
            )}
          </LanguageProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
