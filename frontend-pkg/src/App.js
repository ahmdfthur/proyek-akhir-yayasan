import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- Import Komponen Layout & Halaman Inti ---
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// --- Import Halaman Beranda Dinamis ---
import BerandaPage from './pages/BerandaPage'; // <-- Komponen cerdas yang baru

// --- Import Halaman untuk Peran Guru ---
import ProfileViewPage from './pages/guru/ProfileViewPage'; 
import ProfileEditPage from './pages/guru/ProfileEditPage'; 
import UploadRppPage from './pages/guru/UploadRppPage';
import HasilKinerjaPage from './pages/guru/HasilKinerjaPage';
import HasilKinerjaDetailPage from './pages/guru/HasilKinerjaDetailPage';

// --- Import Halaman untuk Peran Kepala Sekolah ---
import ValidasiRppPage from './pages/headmaster/ValidasiRppPage';
import TeacherListPage from './pages/headmaster/TeacherListPage';
import EvaluationFormPage from './pages/headmaster/EvaluationFormPage';

// --- Import Halaman untuk Peran Admin Yayasan ---
import UserManagementPage from './pages/admin/UserManagementPage';
import AddUserPage from './pages/admin/AddUserPage';
import EditUserPage from './pages/admin/EditUserPage';
import ReportPage from './pages/admin/ReportPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Publik (hanya untuk login) */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Grup Rute Terproteksi yang Memerlukan Login */}
        <Route element={<ProtectedRoute />}>
            {/* Semua halaman di dalam sini akan memiliki layout dasbor (Sidebar, Header) */}
            <Route element={<DashboardLayout />}>
                
                {/* Rute Utama Dasbor */}
                <Route path="/dashboard" element={<BerandaPage />} />

                {/* --- RUTE UNTUK PERAN GURU --- */}
                <Route path="/dashboard/biodata" element={<ProfileViewPage />} />
                <Route path="/dashboard/biodata/edit" element={<ProfileEditPage />} />
                <Route path="/dashboard/upload-rpp" element={<UploadRppPage />} />
                <Route path="/dashboard/hasil-kinerja" element={<HasilKinerjaPage />} />
                <Route path="/dashboard/hasil-kinerja/:resultId" element={<HasilKinerjaDetailPage />} />
                
                {/* --- RUTE UNTUK PERAN KEPALA SEKOLAH --- */}
                <Route path="/dashboard/validasi-rpp" element={<ValidasiRppPage />} />
                <Route path="/dashboard/penilaian-guru" element={<TeacherListPage />} />
                <Route path="/dashboard/penilaian-guru/:teacherId" element={<EvaluationFormPage />} />

                {/* --- RUTE UNTUK PERAN ADMIN YAYASAN --- */}
                <Route path="/dashboard/manajemen-pengguna" element={<UserManagementPage />} />
                <Route path="/dashboard/manajemen-pengguna/tambah" element={<AddUserPage />} />
                <Route path="/dashboard/manajemen-pengguna/edit/:id" element={<EditUserPage />} />
                <Route path="/dashboard/laporan-kinerja" element={<ReportPage />} />

            </Route>
        </Route>

        {/* Rute default aplikasi, arahkan ke dasbor jika sudah login */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </Router>
  );
}

export default App;
