import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import apiClient from '../../services/api';
import '../../pages/admin/AdminDashboardPage.css'; // Memakai ulang CSS dari dasbor admin
import { FaChalkboardTeacher, FaFileSignature, FaClipboardCheck, FaArrowRight } from 'react-icons/fa';

const KepsekHomePage = () => {
    const { user } = useOutletContext();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/dashboard/headmaster-summary')
            .then(response => {
                setSummary(response.data);
            })
            .catch(error => {
                console.error("Gagal memuat ringkasan dasbor:", error);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div>Memuat dasbor...</div>;
    }

    return (
        <div className="admin-dashboard"> {/* Menggunakan class yang sama untuk styling */}
            <h1>Dasbor Kepala Sekolah</h1>
            <p className="subtitle">Selamat datang, {user?.name}. Kelola penilaian kinerja guru di sekolah Anda.</p>

            {/* Kartu Statistik */}
            <div className="summary-cards">
                <div className="card-stat">
                    <FaChalkboardTeacher className="icon teacher" />
                    <div className="info">
                        <span className="value">{summary?.total_teachers || 0}</span>
                        <span className="label">Total Guru</span>
                    </div>
                </div>
                <div className="card-stat">
                    <FaFileSignature className="icon pending" />
                    <div className="info">
                        <span className="value">{summary?.pending_rpp || 0}</span>
                        <span className="label">RPP Perlu Validasi</span>
                    </div>
                </div>
                <div className="card-stat">
                    <FaClipboardCheck className="icon total-evals" />
                    <div className="info">
                        <span className="value">{summary?.completed_evaluations || 0}</span>
                        <span className="label">Penilaian Selesai</span>
                    </div>
                </div>
            </div>

            {/* Aksi Cepat */}
            <div className="quick-actions">
                <h2>Akses Cepat</h2>
                <div className="action-buttons">
                    <Link to="/dashboard/validasi-rpp" className="action-button">
                        <div className="action-info">
                            <h3>Validasi RPP</h3>
                            <p>Setujui atau tolak RPP yang diajukan oleh guru.</p>
                        </div>
                        <FaArrowRight className="action-icon" />
                    </Link>
                    <Link to="/dashboard/penilaian-guru" className="action-button">
                        <div className="action-info">
                            <h3>Penilaian Kinerja</h3>
                            <p>Isi formulir penilaian kinerja untuk setiap guru.</p>
                        </div>
                        <FaArrowRight className="action-icon" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default KepsekHomePage;
