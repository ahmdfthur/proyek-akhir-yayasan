// frontend-pkg/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts and Core Pages
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Halaman-halaman Guru
import GuruHomePage from './pages/GuruHomePage';
import ProfileViewPage from './pages/guru/ProfileViewPage'; 
import ProfileEditPage from './pages/guru/ProfileEditPage';  
import UploadRppPage from './pages/guru/UploadRppPage'; 
import HasilKinerjaPage from './pages/guru/HasilKinerjaPage'; 
import HasilKinerjaDetailPage from './pages/guru/HasilKinerjaDetailPage';

//headmaster
import ValidasiRppPage from './pages/headmaster/ValidasiRppPage';
import TeacherListPage from './pages/headmaster/TeacherListPage';
import EvaluationFormPage from './pages/headmaster/EvaluationFormPage';

//Admin
import UserManagementPage from './pages/admin/UserManagementPage';
import AddUserPage from './pages/admin/AddUserPage';
import EditUserPage from './pages/admin/EditUserPage';
import ReportPage from './pages/admin/ReportPage';

const RoleBasedRedirect = () => {
    return <Navigate to="/dashboard/beranda" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute Publik */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rute Terproteksi dengan Layout Dashboard */}
        <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<RoleBasedRedirect />} />

                {/* --- RUTE UNTUK PERAN GURU --- */}
                {/* Pastikan path di sini SAMA PERSIS dengan path di Sidebar.js */}
                <Route path="/dashboard/beranda" element={<GuruHomePage />} />
                <Route path="/dashboard/biodata" element={<ProfileViewPage />} />
                <Route path="/dashboard/biodata/edit" element={<ProfileEditPage />} />
                <Route path="/dashboard/upload-rpp" element={<UploadRppPage />} />
                <Route path="/dashboard/hasil-kinerja" element={<HasilKinerjaPage />} />
                <Route path="/dashboard/hasil-kinerja/:resultId" element={<HasilKinerjaDetailPage />} />
                
                {/* --- RUTE UNTUK KEPALA SEKOLAH --- */}
                <Route path="/dashboard/validasi-rpp" element={<ValidasiRppPage />} />
                <Route path="/dashboard/penilaian-guru" element={<TeacherListPage />} />
                <Route path="/dashboard/penilaian-guru/:teacherId" element={<EvaluationFormPage />} />

                {/* --- RUTE UNTUK ADMIN YAYASAN --- */}
                <Route path="/dashboard/manajemen-pengguna" element={<UserManagementPage />} />
                <Route path="/dashboard/manajemen-pengguna/tambah" element={<AddUserPage />} />
                <Route path="/dashboard/manajemen-pengguna/edit/:id" element={<EditUserPage />} />
                <Route path="/dashboard/laporan-kinerja" element={<ReportPage />} />

            </Route>
        </Route>

        {/* Rute default aplikasi */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;