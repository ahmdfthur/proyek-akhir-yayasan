import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import apiClient from '../../services/api';
import './AdminDashboardPage.css'; // Kita akan buat file CSS ini
import { FaUsers, FaSchool, FaClipboardCheck, FaUserShield, FaUserTie, FaChalkboardTeacher, FaArrowRight } from 'react-icons/fa';

const AdminDashboardPage = () => {
    const { user } = useOutletContext(); // Ambil data admin yang login
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/admin/dashboard-summary')
            .then(response => {
                setSummary(response.data);
            })
            .catch(error => {
                console.error("Gagal memuat ringkasan dasbor:", error);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div>Memuat dasbor admin...</div>;
    }

    return (
        <div className="admin-dashboard">
            <h1>Dasbor Admin Yayasan</h1>
            <p className="subtitle">Selamat datang kembali, {user?.name}. Berikut adalah ringkasan sistem saat ini.</p>

            {/* Kartu Statistik Utama */}
            <div className="summary-cards">
                <div className="card-stat">
                    <FaUsers className="icon total-users" />
                    <div className="info">
                        <span className="value">{summary?.total_users || 0}</span>
                        <span className="label">Total Pengguna</span>
                    </div>
                </div>
                <div className="card-stat">
                    <FaSchool className="icon total-schools" />
                    <div className="info">
                        <span className="value">{summary?.total_schools || 0}</span>
                        <span className="label">Total Sekolah</span>
                    </div>
                </div>
                <div className="card-stat">
                    <FaClipboardCheck className="icon total-evals" />
                    <div className="info">
                        <span className="value">{summary?.total_evaluations || 0}</span>
                        <span className="label">Penilaian Selesai</span>
                    </div>
                </div>
            </div>

            {/* Rincian Pengguna per Peran */}
            <div className="role-details">
                <h3>Rincian Pengguna per Peran</h3>
                <div className="summary-cards">
                    <div className="card-stat role-card">
                        <FaUserShield className="icon admin" />
                        <div className="info">
                            <span className="value">{summary?.users_by_role.admin || 0}</span>
                            <span className="label">Admin Yayasan</span>
                        </div>
                    </div>
                    <div className="card-stat role-card">
                        <FaUserTie className="icon headmaster" />
                        <div className="info">
                            <span className="value">{summary?.users_by_role.headmaster || 0}</span>
                            <span className="label">Kepala Sekolah</span>
                        </div>
                    </div>
                    <div className="card-stat role-card">
                        <FaChalkboardTeacher className="icon teacher" />
                        <div className="info">
                            <span className="value">{summary?.users_by_role.teacher || 0}</span>
                            <span className="label">Guru</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Aksi Cepat */}
            <div className="quick-actions">
                <h2>Akses Cepat</h2>
                <div className="action-buttons">
                    <Link to="/dashboard/manajemen-pengguna" className="action-button">
                        <div className="action-info">
                            <h3>Manajemen Pengguna</h3>
                            <p>Tambah, edit, atau hapus data pengguna sistem.</p>
                        </div>
                        <FaArrowRight className="action-icon" />
                    </Link>
                    <Link to="/dashboard/laporan-kinerja" className="action-button">
                        <div className="action-info">
                            <h3>Laporan Kinerja</h3>
                            <p>Lihat dan unduh rekapitulasi penilaian kinerja.</p>
                        </div>
                        <FaArrowRight className="action-icon" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
