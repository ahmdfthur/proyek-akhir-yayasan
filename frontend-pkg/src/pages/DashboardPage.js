// Impor useCallback dan useEffect
import React, { useState, useEffect, useCallback } from 'react'; 
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

const DashboardPage = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // 1. Bungkus handleLogout dengan useCallback
    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        navigate('/login');
    }, [navigate]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiClient.get('/auth/me');
                setUser(response.data);
            } catch (error) {
                console.error('Gagal mengambil data user', error);
                handleLogout(); // Panggil fungsi yang sudah di-memoize
            }
        };
        fetchUser();
    }, [handleLogout]); // 2. Tambahkan handleLogout sebagai dependency

    // ... sisa kode tidak berubah ...
    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Dashboard Sistem PKG</h1>
            <h2>Selamat Datang, {user.name}!</h2>
            <p>Anda login sebagai: <strong>{user.role}</strong></p>
            {/* Tombol logout tetap memanggil fungsi yang sama */}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default DashboardPage;