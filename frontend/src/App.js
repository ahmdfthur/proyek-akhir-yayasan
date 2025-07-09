import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// --- Import Komponen Layout & Halaman Publik ---
// Pastikan semua file ini ada di lokasi yang benar
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import EducationPage from './pages/EducationPage';
import ArticleListPage from './pages/ArticleListPage';
// import ArticleDetailPage from './pages/ArticleDetailPage'; // Anda bisa aktifkan ini nanti
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';

/**
 * Komponen PublicLayout berfungsi sebagai kerangka untuk semua halaman
 * yang dapat diakses oleh publik. Ini memastikan Navbar dan Footer
 * selalu ditampilkan di halaman-halaman tersebut.
 */
const PublicLayout = () => (
    <div className="app-container">
        <Navbar />
        <main className="main-content">
            {/* Outlet akan merender komponen anak dari rute, misal: HomePage */}
            <Outlet />
        </main>
        <Footer />
    </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Semua halaman publik dibungkus oleh PublicLayout */}
        <Route path="/" element={<PublicLayout />}>
            {/* 'index' berarti ini adalah halaman default untuk path "/" */}
            <Route index element={<HomePage />} />
            
            <Route path="profil-yayasan" element={<ProfilePage />} />
            <Route path="pendidikan" element={<EducationPage />} />
            <Route path="artikel" element={<ArticleListPage />} />
            {/* <Route path="artikel/:slug" element={<ArticleDetailPage />} /> */}
            <Route path="galeri" element={<GalleryPage />} />
            <Route path="hubungi-kami" element={<ContactPage />} />

            {/* Rute 'catch-all' untuk halaman tidak ditemukan (opsional) */}
            <Route path="*" element={
                <div style={{ textAlign: 'center', padding: '50px' }}>
                    <h2>404: Halaman Tidak Ditemukan</h2>
                    <p>Maaf, halaman yang Anda cari tidak ada.</p>
                </div>
            } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;