// frontend-pkg/src/pages/admin/AddUserPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';
import './UserForm.css'; // Kita akan pakai CSS bersama

const AddUserPage = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'guru',
        school_id: ''
    });
    const [schools, setSchools] = useState([]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Ambil daftar sekolah untuk dropdown
        apiClient.get('/schools').then(res => setSchools(res.data));
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiClient.post('/admin/users', user);
            alert(response.data.message);
            navigate('/dashboard/manajemen-pengguna');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Gagal membuat pengguna.');
        }
    };

    return (
        <div className="user-form-container">
            <h2>Tambah Pengguna Baru</h2>
            <form onSubmit={handleSubmit} className="card">
                <div className="form-group">
                    <label>Nama Lengkap</label>
                    <input type="text" name="name" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Peran (Role)</label>
                    <select name="role" value={user.role} onChange={handleChange}>
                        <option value="guru">Guru</option>
                        <option value="kepala_sekolah">Kepala Sekolah</option>
                        <option value="admin_yayasan">Admin Yayasan</option>
                    </select>
                </div>
                {user.role !== 'admin_yayasan' && (
                    <div className="form-group">
                        <label>Tempat Tugas</label>
                        <select name="school_id" value={user.school_id} onChange={handleChange} required>
                            <option value="">-- Pilih Sekolah --</option>
                            {schools.map(school => (
                                <option key={school.id} value={school.id}>{school.name}</option>
                            ))}
                        </select>
                    </div>
                )}
                {message && <p className="error-message">{message}</p>}
                <div className="form-actions">
                    <button type="button" onClick={() => navigate(-1)} className="btn-cancel">Batal</button>
                    <button type="submit" className="btn-submit">Simpan Pengguna</button>
                </div>
            </form>
        </div>
    );
};

export default AddUserPage;