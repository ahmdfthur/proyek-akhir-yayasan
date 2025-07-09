// frontend-pkg/src/components/layout/DashboardLayout.js
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';
import Sidebar from './Sidebar'; // Akan kita buat selanjutnya
import './DashboardLayout.css';

const DashboardLayout = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await apiClient.get('/auth/me');
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                // Jika token tidak valid, hapus dan redirect ke login
                localStorage.removeItem('token');
                navigate('/login');
            }
        };
        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return <div>Memuat sesi Anda...</div>;
    }

    return (
        <div className="dashboard-layout">
            <Sidebar userRole={user.role} />
            <div className="main-content-wrapper">
                <header className="dashboard-header">
                    <div>Selamat Datang, <strong>{user.name}</strong></div>
                    <button onClick={handleLogout} className="logout-button">Logout</button>
                </header>
                <main className="dashboard-content">
                    <Outlet context={{ user }} /> {/* Mengirim data user ke komponen anak */}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;