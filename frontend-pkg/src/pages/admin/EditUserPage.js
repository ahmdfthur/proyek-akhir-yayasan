import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../services/api';
import './UserForm.css'; // Menggunakan CSS yang sama dengan form Tambah User

const EditUserPage = () => {
    // Mengambil ID user dari parameter URL (contoh: /edit/10)
    const { id } = useParams(); 
    const navigate = useNavigate();

    // State untuk menampung data form
    const [user, setUser] = useState({
        name: '',
        email: '',
        role: 'guru',
        school_id: ''
    });
    // State terpisah untuk password agar bisa opsional
    const [password, setPassword] = useState('');
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Hook untuk mengambil data saat halaman pertama kali dimuat
    useEffect(() => {
        // Ambil data user yang akan diedit dan daftar semua sekolah secara bersamaan
        Promise.all([
            apiClient.get(`/admin/users/${id}`),
            apiClient.get('/schools')
        ]).then(([userRes, schoolsRes]) => {
            // Isi state form dengan data user yang ada
            setUser(userRes.data);
            setSchools(schoolsRes.data);
        }).catch(err => {
            console.error("Gagal mengambil data:", err);
            setMessage("Gagal memuat data pengguna.");
        }).finally(() => {
            setLoading(false);
        });
    }, [id]); // Efek ini akan berjalan lagi jika ID di URL berubah

    // Handler untuk setiap perubahan pada input form
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    // Handler saat form disubmit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        // Siapkan data yang akan dikirim ke backend
        const payload = {
            name: user.name,
            email: user.email,
            role: user.role,
            school_id: user.role === 'admin_yayasan' ? null : user.school_id
        };

        // Hanya tambahkan password ke payload jika diisi
        if (password) {
            payload.password = password;
        }

        try {
            const response = await apiClient.put(`/admin/users/${id}`, payload);
            alert(response.data.message); // Tampilkan notifikasi sukses
            navigate('/dashboard/manajemen-pengguna'); // Kembali ke halaman daftar user
        } catch (error) {
            setMessage(error.response?.data?.message || 'Gagal memperbarui pengguna.');
        }
    };

    // Tampilkan pesan loading selagi data diambil
    if (loading) {
        return <div>Memuat data pengguna...</div>;
    }

    return (
        <div className="user-form-container">
            <h2>Edit Pengguna: {user.name}</h2>
            <form onSubmit={handleSubmit} className="card">
                <div className="form-group">
                    <label>Nama Lengkap</label>
                    <input type="text" name="name" value={user.name || ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={user.email || ''} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Password Baru (Opsional)</label>
                    <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} placeholder="Isi hanya jika ingin mengubah password" />
                </div>
                <div className="form-group">
                    <label>Peran (Role)</label>
                    <select name="role" value={user.role || ''} onChange={handleChange}>
                        <option value="guru">Guru</option>
                        <option value="kepala_sekolah">Kepala Sekolah</option>
                        <option value="admin_yayasan">Admin Yayasan</option>
                    </select>
                </div>

                {/* Tampilkan pilihan sekolah hanya jika perannya bukan admin yayasan */}
                {user.role !== 'admin_yayasan' && (
                    <div className="form-group">
                        <label>Tempat Tugas</label>
                        <select name="school_id" value={user.school_id || ''} onChange={handleChange} required>
                            <option value="">-- Pilih Sekolah --</option>
                            {schools.map(school => (
                                <option key={school.id} value={school.id}>{school.name}</option>
                            ))}
                        </select>
                    </div>
                )}
                
                {message && <p className="error-message">{message}</p>}
                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/dashboard/manajemen-pengguna')} className="btn-cancel">Batal</button>
                    <button type="submit" className="btn-submit">Simpan Perubahan</button>
                </div>
            </form>
        </div>
    );
};

export default EditUserPage;