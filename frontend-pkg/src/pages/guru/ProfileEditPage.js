// frontend-pkg/src/pages/guru/ProfileEditPage.js
import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import './ProfileEditPage.css';

const ProfileEditPage = () => {
    const [profile, setProfile] = useState({});
    const [schools, setSchools] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    
    // Base URL untuk gambar, agar bisa ditampilkan
    const API_URL = 'http://localhost:5001';

    useEffect(() => {
        // Fetch data profil dan data sekolah secara bersamaan
        Promise.all([
            apiClient.get('/profiles/me'),
            apiClient.get('/schools')
        ]).then(([profileRes, schoolsRes]) => {
            const profileData = profileRes.data;
            if (profileData) {
                // Format tanggal dan siapkan data untuk form
                setProfile({
                    ...profileData,
                    birth_date: profileData.birth_date ? profileData.birth_date.split('T')[0] : ''
                });
                // Set preview jika ada foto
                if (profileData.photo_url) {
                    setPreview(`${API_URL}${profileData.photo_url}`);
                }
            }
            setSchools(schoolsRes.data);
        }).catch(error => {
            console.error("Gagal mengambil data:", error);
            setMessage('Gagal memuat data, silakan refresh halaman.');
        }).finally(() => setLoading(false));
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // Buat URL sementara untuk preview gambar
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Konversi ke angka jika inputnya adalah number
        const finalValue = e.target.type === 'number' ? parseInt(value, 10) || '' : value;
        setProfile(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        
        // Gunakan FormData karena kita mengirim file
        const formData = new FormData();

        // Tambahkan semua data teks ke formData
        for (const key in profile) {
            if (profile[key] !== null && key !== 'photo_url') {
                formData.append(key, profile[key]);
            }
        }
        
        // Tambahkan file foto jika ada yang dipilih
        if (selectedFile) {
            formData.append('profilePhoto', selectedFile);
        } else if (profile.photo_url) {
            // Kirim path foto lama jika tidak ada file baru
            formData.append('existing_photo_url', profile.photo_url);
        }

        try {
            const response = await apiClient.put('/profiles/me', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Gagal memperbarui profil. Silakan coba lagi.');
            console.error(error);
        }
    };

    if (loading) return <div>Memuat biodata...</div>;

    return (
        <div className="biodata-container">
            <h2>Informasi Pribadi</h2>
            <p>Perbarui informasi pribadi Anda.</p>
            <form onSubmit={handleSubmit} className="biodata-form">
                
                {/* Kolom Upload Foto */}
                <div className="photo-upload-section">
                    <div className="photo-preview" style={{width: '177px', height: '236px'}}>
                        {preview ? <img src={preview} alt="Profile Preview" /> : <span>Foto Profil</span>}
                    </div>
                    <label htmlFor="file-upload" className="custom-file-upload">
                        Pilih Foto
                    </label>
                    <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} />
                </div>
                
                {/* Kolom Form */}
                <div className="form-fields-section">
                    <div className="form-group">
                        <label>Nama</label>
                        <input type="text" name="user_name" value={profile.user_name || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>NIP</label>
                        <input 
                          type="text" 
                          pattern="\d{18}" 
                          title="NIP harus terdiri dari 18 digit angka"
                          maxLength="18"
                          name="nip" 
                          value={profile.nip || ''} 
                          onChange={handleChange} 
                      />
                    </div>
                    <div className="form-group">
                        <label>No. Telepon</label>
                        <input type="number" name="phone_number" value={profile.phone_number || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Jenis Kelamin</label>
                        <select name="gender" value={profile.gender || 'Laki-laki'} onChange={handleChange}>
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                    </div>
                     <div className="form-group">
                        <label>Tempat, Tanggal Lahir</label>
                        <div className="inline-group">
                            <input type="text" name="birth_place" placeholder="Tempat Lahir" value={profile.birth_place || ''} onChange={handleChange} />
                            <input type="date" name="birth_date" value={profile.birth_date || ''} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Tempat Tugas</label>
                        <select name="school_id" value={profile.school_id || ''} onChange={handleChange}>
                            <option value="" disabled>-- Pilih Sekolah --</option>
                            {schools.map(school => (
                                <option key={school.id} value={school.id}>{school.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Status Kepegawaian</label>
                        <input type="text" name="employment_status" value={profile.employment_status || 'Belum diatur'} onChange={handleChange} disabled />
                    </div>
                    <div className="form-group full-width">
                        <label>Alamat</label>
                        <textarea name="address" rows="3" value={profile.address || ''} onChange={handleChange}></textarea>
                    </div>
                </div>

                <div className="form-actions full-width">
                    {message && <p className="status-message">{message}</p>}
                    <button type="submit" className="submit-button">Simpan Perubahan</button>
                </div>
            </form>
        </div>
    );
};

export default ProfileEditPage;