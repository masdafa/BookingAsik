import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

const ProtectedRoute = ({ children, admin }) => {
    // Asumsi: useAuth() mengembalikan { user: object | null, loading: boolean }
    const { user, loading } = useAuth(); 

    // --- 1. TAMPILKAN LOADING STATE ---
    if (loading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', minHeight: '80vh' }}>
                <CircularProgress color="primary" />
                <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>Verifying identity...</Typography>
            </Box>
        );
    }

    // --- 2. CEK STATUS LOGIN (Wajib) ---
    if (!user) {
        // Jika belum login, redirect ke halaman login
        // console.log("ProtectedRoute: User not logged in, redirecting to /login");
        return <Navigate to="/login" replace />;
    }

    // --- 3. CEK HAK AKSES ADMIN (Hanya jika prop 'admin' = true) ---
    if (admin === true) {
        // Cek properti role. PASTIKAN USER ADMIN MEMILIKI user.role === 'admin'
        const isUserAdmin = user.role === 'admin'; 
        
        // console.log(`ProtectedRoute: Admin check for user ${user.name}. Role: ${user.role}. Is Admin: ${isUserAdmin}`);

        if (!isUserAdmin) {
            // Jika rute memerlukan admin, tapi user bukan admin, redirect ke Home
            // console.warn("ProtectedRoute: Access denied for non-admin user. Redirecting to /");
            return <Navigate to="/" replace />;
        }
    }

    // --- 4. SEMUA CEK LULUS, RENDER ANAK KOMPONEN ---
    // Gunakan children (jika ada) atau Outlet (jika di dalam Route parent)
    return children ? children : <Outlet />;
};

export default ProtectedRoute;