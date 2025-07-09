// frontend-pkg/src/pages/GuruHomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import { useOutletContext } from 'react-router-dom';
import './GuruHomePage.css'; // Kita akan buat file CSS ini
import { FaFileAlt, FaCheckCircle, FaClock, FaTimesCircle, FaArrowRight, FaUserEdit } from 'react-icons/fa';

const GuruHomePage = () => {
    const { user } = useOutletContext(); // Ambil data user dari DashboardLayout
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/dashboard/teacher-summary')
            .then(response => {
                setSummary(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Gagal memuat ringkasan:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Memuat dashboard...</div>;
    }

    return (
        <div className="guru-homepage">
            <h1>Selamat Datang, {user?.name || 'Guru'}!</h1>
            <p className="subtitle">Ini adalah ringkasan aktivitas dan penilaian kinerja Anda.</p>

            {/* Bagian Kartu Statistik */}
            <div className="summary-cards">
                <div className="card-stat">
                    <FaFileAlt className="icon total" />
                    <div className="info">
                        <span className="value">{summary?.rpp_total || 0}</span>
                        <span className="label">Total RPP Diunggah</span>
                    </div>
                </div>
                <div className="card-stat">
                    <FaCheckCircle className="icon approved" />
                    <div className="info">
                        <span className="value">{summary?.rpp_approved || 0}</span>
                        <span className="label">RPP Disetujui</span>
                    </div>
                </div>
                <div className="card-stat">
                    <FaClock className="icon pending" />
                    <div className="info">
                        <span className="value">{summary?.rpp_pending || 0}</span>
                        <span className="label">Menunggu Validasi</span>
                    </div>
                </div>
                <div className="card-stat">
                    <FaTimesCircle className="icon rejected" />
                    <div className="info">
                        <span className="value">{summary?.rpp_rejected || 0}</span>
                        <span className="label">RPP Ditolak</span>
                    </div>
                </div>
            </div>

            {/* Bagian Aksi Cepat */}
            <div className="quick-actions">
                <h2>Aksi Cepat</h2>
                <div className="action-buttons">
                    <Link to="/dashboard/upload-rpp" className="action-button">
                        <div className="action-info">
                            <h3>Upload RPP Baru</h3>
                            <p>Unggah RPP tahunan, semester, atau harian.</p>
                        </div>
                        <FaArrowRight className="action-icon" />
                    </Link>
                    <Link to="/dashboard/biodata/edit" className="action-button">
                        <div className="action-info">
                            <h3>Perbarui Biodata</h3>
                            <p>Pastikan data pribadi Anda selalu mutakhir.</p>
                        </div>
                        <FaUserEdit className="action-icon" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default GuruHomePage;