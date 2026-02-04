import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- Fungsi Helper ---

    // 🚨 Fungsi ini digunakan untuk mengambil data user terbaru saat aplikasi dimuat atau setelah login
    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            // Memanggil /auth/me untuk mendapatkan data user
            const response = await api.get('/auth/me'); 
            setUser(response.data); 
        } catch (error) {
            // Jika token tidak valid atau /auth/me 404/401
            console.error("Error fetching user:", error.message);
            localStorage.removeItem('token');
            setUser(null); 
        } finally {
            setLoading(false);
        }
    };
    
    // --- Lifecycle (Mount) ---

    useEffect(() => {
        fetchUser();
    }, []); // Dipanggil hanya sekali saat mount

    // --- Authentication Actions ---

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            
            // 🚨 PERBAIKAN KRITIS: Cek respons server dengan aman
            const token = response.data.token;
            const userData = response.data.id ? response.data : response.data.user; // Ambil data user dari respons
            
            if (!token || !userData) {
                 // Melempar error untuk ditangkap di catch dan ditampilkan ke frontend
                throw new Error('Format response server tidak sesuai (Missing token or user data).');
            }

            localStorage.setItem('token', token);
            // Panggil fetchUser untuk mengambil data user lengkap dari /auth/me
            // Ini membantu jika respons login hanya mengembalikan sebagian data
            await fetchUser(); 
            
            return userData; // Mengembalikan data user yang baru login
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            // Melemparkan kembali error agar dapat ditangkap oleh komponen Login.js
            throw new Error(errorMessage); 
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await api.post('/auth/register', { name, email, password });
            
            // 🚨 PERBAIKAN KRITIS: Cek respons server dengan aman
            const token = response.data.token;
            const userData = response.data.id ? response.data : response.data.user; 
            
            if (!token || !userData) {
                throw new Error('Format response server tidak sesuai (Missing token or user data).');
            }

            localStorage.setItem('token', token);
            // Panggil fetchUser untuk memuat data user yang baru terdaftar
            await fetchUser(); 

            return userData; 
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
            throw new Error(errorMessage);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateUser = async (userData) => {
        try {
            // Kirim data update ke backend
            const response = await api.put('/users/profile', userData); // 🚨 Asumsi rute update user di /users/profile

            // Update state user dengan data yang dikembalikan server
            setUser(response.data);
            
            // Mengembalikan user data yang diperbarui untuk konfirmasi di komponen Profile
            return response.data; 
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Update failed';
            throw new Error(errorMessage);
        }
    };
    
    // --- Context Value ---
    
    const value = {
        user,
        login,
        register,
        logout,
        updateUser,
        loading,
        isAuthenticated: !!user,
        // Tambahkan fetchUser agar bisa dipanggil manual jika diperlukan (misal setelah booking)
        fetchUser, 
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};