// frontend-pkg/src/pages/BerandaPage.js
import React from 'react';
import { useOutletContext } from 'react-router-dom';

// Import semua halaman beranda untuk setiap peran
import GuruHomePage from './GuruHomePage';
import AdminDashboardPage from './admin/AdminDashboardPage';
import KepsekHomePage from './headmaster/KepsekHomePage';

const BerandaPage = () => {
    const { user } = useOutletContext(); // Ambil data user yang login dari AdminLayout

    // Jika data user belum ada, tampilkan loading
    if (!user) {
        return <div>Memuat...</div>;
    }

    // Tampilkan komponen yang sesuai berdasarkan peran user
    switch (user.role) {
        case 'admin_yayasan':
            return <AdminDashboardPage />;
        case 'guru':
            return <GuruHomePage />;
        case 'kepala_sekolah':
            return <KepsekHomePage />;
        default:
            return <div>Peran tidak dikenali.</div>;
    }
};

export default BerandaPage;