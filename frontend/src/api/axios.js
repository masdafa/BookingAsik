// src/api/axios.js

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api", // Ganti port jika backend Anda berbeda
  withCredentials: false,
});

// REQUEST Interceptor: Menambahkan token JWT ke header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // Jangan set Content-Type untuk FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE Interceptor: Menangani token kadaluarsa (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Cek jika status 401 dan bukan rute login/register
        if (
            error.response && 
            error.response.status === 401 &&
            error.config.url !== '/auth/login' &&
            error.config.url !== '/auth/register'
        ) {
            console.warn("Token expired atau tidak valid. Mengarahkan ke halaman login.");
            localStorage.removeItem('token');
            // Arahkan ke halaman login
            // Ini akan memicu perubahan URL dan memuat ulang AuthContext
            window.location.replace('/login'); 
        }
        return Promise.reject(error);
    }
);

export default api;