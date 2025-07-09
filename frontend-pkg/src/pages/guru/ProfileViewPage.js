import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';
import './ProfileViewPage.css';

const ProfileViewPage = () => {
    // Inisialisasi state sebagai null untuk penanganan loading yang lebih jelas
    const [profile, setProfile] = useState(null);
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const API_URL = 'http://localhost:5001';

    useEffect(() => {
        // Ambil data profil dan data sekolah secara bersamaan
        Promise.all([
            apiClient.get('/profiles/me', {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
            }),
            apiClient.get('/schools')
        ]).then(([profileRes, schoolsRes]) => {
            // Pastikan data yang diterima tidak kosong sebelum di-set
            if (profileRes.data) {
                setProfile(profileRes.data);
            }
            if (schoolsRes.data) {
                setSchools(schoolsRes.data);
            }
        }).catch(err => {
            console.error("Gagal mengambil data:", err);
            setError('Gagal memuat data profil. Silakan coba refresh halaman.');
        }).finally(() => {
            setLoading(false);
        });
    }, []); // Dependency array kosong, hanya berjalan sekali saat komponen dimuat

    const getSchoolName = (schoolId) => {
        if (!schools.length || !schoolId) return 'Belum diatur';
        const school = schools.find(s => s.id === schoolId);
        return school ? school.name : 'ID Sekolah tidak valid';
    };
    
    // Tampilkan pesan loading saat data sedang diambil
    if (loading) {
        return <div className="loading-message">Memuat profil Anda...</div>;
    }
    
    // Tampilkan pesan error jika terjadi kegagalan fetch data
    if (error) {
        return <div className="error-message">{error}</div>;
    }
    
    // Tampilkan pesan jika profil belum ada sama sekali
    if (!profile) {
        return (
            <div className="profile-view-container">
                <p>Data profil belum lengkap.</p>
                <Link to="/dashboard/biodata/edit" className="edit-button">
                    Lengkapi Informasi Pribadi
                </Link>
            </div>
        );
    }

    // Tampilkan data jika semua sudah siap
    return (
        <div className="profile-view-container">
            <div className="profile-view-header">
                <h2>Informasi Pribadi</h2>
                <Link to="/dashboard/biodata/edit" className="edit-button">
                    Perbarui Informasi
                </Link>
            </div>

            <div className="profile-view-body">
                <div className="profile-view-photo">
                    <img 
                        src={profile.photo_url ? `${API_URL}${profile.photo_url}` : 'https://via.placeholder.com/177x236.png?text=Foto+Profil'} 
                        alt="Foto Profil" 
                    />
                </div>
                <div className="profile-view-details">
                    <div className="detail-item">
                        <label>Nama</label>
                        <p>{profile.user_name || '-'}</p>
                    </div>
                    <div className="detail-item">
                        <label>Email</label>
                        <p>{profile.email || '-'}</p>
                    </div>
                    <div className="detail-item">
                        <label>NIP</label>
                        <p>{profile.nip || '-'}</p>
                    </div>
                    <div className="detail-item">
                        <label>No. Telepon</label>
                        <p>{profile.phone_number || '-'}</p>
                    </div>
                    <div className="detail-item">
                        <label>Jenis Kelamin</label>
                        <p>{profile.gender || '-'}</p>
                    </div>
                    <div className="detail-item">
                        <label>Tempat, Tanggal Lahir</label>
                        <p>{profile.birth_place || '-'}, {profile.birth_date ? new Date(profile.birth_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}</p>
                    </div>
                    <div className="detail-item">
                        <label>Tempat Tugas</label>
                        <p>{getSchoolName(profile.school_id)}</p>
                    </div>
                    <div className="detail-item">
                        <label>Status Kepegawaian</label>
                        <p>{profile.employment_status || 'Belum diatur'}</p>
                    </div>
                    <div className="detail-item full-width">
                        <label>Alamat</label>
                        <p>{profile.address || '-'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileViewPage;