import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../../services/api';
import './UploadRppPage.css';
import { FaTrash, FaUpload } from 'react-icons/fa6';

const UploadRppPage = () => {
    const [rppList, setRppList] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    
    // 1. Kembalikan state untuk form data Tahun Akademik dan Semester
    const [formData, setFormData] = useState({
        academic_year: '2024/2025',
        semester: 'Ganjil',
    });

    const fileInputRefs = {
        tahunan: useRef(null),
        semester: useRef(null),
        harian: useRef(null),
    };
    const API_URL = 'http://localhost:5001';

    const fetchRpp = async () => {
        try {
            const response = await apiClient.get('/rpp/my-rpp');
            setRppList(response.data);
        } catch (err) {
            console.error("Gagal mengambil daftar RPP:", err);
        }
    };

    useEffect(() => {
        fetchRpp();
    }, []);

    // 2. Buat kembali fungsi handleChange untuk mengupdate state form
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpload = async (rppType, file) => {
        if (!file) {
            setError('Silakan pilih file terlebih dahulu.');
            return;
        }

        setError('');
        setMessage(`Mengunggah ${rppType}...`);

        const data = new FormData();
        data.append('rppFile', file);
        // 3. Ambil data dari state saat upload, bukan hardcoded
        data.append('academic_year', formData.academic_year);
        data.append('semester', formData.semester);
        data.append('rpp_type', rppType);

        try {
            const response = await apiClient.post('/rpp', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage(response.data.message);
            fetchRpp();
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Gagal mengunggah RPP.';
            setError(errorMessage);
            setMessage('');
        }
    };

    const handleFileChange = (e, rppType) => {
        const file = e.target.files[0];
        if (file) {
            handleUpload(rppType, file);
        }
        // Reset input file agar bisa memilih file yang sama lagi
        e.target.value = null; 
    };

    const handleDelete = async (rppId) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus RPP ini?')) {
            try {
                const response = await apiClient.delete(`/rpp/${rppId}`);
                setMessage(response.data.message);
                fetchRpp();
            } catch (err) {
                setError('Gagal menghapus RPP.');
            }
        }
    };

    const rppTypes = [
        { key: 'tahunan', label: 'Rencana Program Tahunan' },
        { key: 'semester', label: 'Rencana Program Semester' },
        { key: 'harian', label: 'Rencana Program Harian' },
    ];

    return (
        <div className="rpp-container">
            <h2>Upload Rencana Pelaksanaan Pembelajaran</h2>
            <div className="card upload-section">
                
                {/* 4. Tambahkan field Tahun Akademik dan Semester di sini */}
                <div className="period-selection">
                    <div className="form-group">
                        <label>Pilih Tahun Akademik</label>
                        <input type="text" name="academic_year" value={formData.academic_year} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Pilih Semester</label>
                        <select name="semester" value={formData.semester} onChange={handleChange}>
                            <option value="Ganjil">Ganjil</option>
                            <option value="Genap">Genap</option>
                        </select>
                    </div>
                </div>

                <hr className="divider" />

                {rppTypes.map(({ key, label }) => (
                    <div key={key} className="upload-item">
                        <span>{label}</span>
                        <input
                            type="file"
                            ref={fileInputRefs[key]}
                            style={{ display: 'none' }}
                            onChange={(e) => handleFileChange(e, key)}
                            accept=".pdf,.doc,.docx"
                        />
                        <button
                            onClick={() => fileInputRefs[key].current.click()}
                            className="upload-button"
                        >
                            <FaUpload /> Upload
                        </button>
                    </div>
                ))}
            </div>
            {message && <p className="status-message success">{message}</p>}
            {error && <p className="status-message error">{error}</p>}

            <h3 className="history-title">Riwayat Upload RPP</h3>
            <div className="card">
                <table className="rpp-table">
                    <thead>
                        <tr>
                            <th>Jenis RPP</th>
                            <th>File</th>
                            <th>Tanggal Upload</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rppList.length > 0 ? (
                            rppList.map(rpp => (
                                <tr key={rpp.id}>
                                    <td className="rpp-type">{rpp.rpp_type}</td>
                                    <td><a href={`${API_URL}${rpp.file_url}`} target="_blank" rel="noopener noreferrer">{rpp.file_name}</a></td>
                                    <td>{new Date(rpp.submitted_at).toLocaleDateString('id-ID')}</td>
                                    <td><span className={`status status-${rpp.status}`}>{rpp.status}</span></td>
                                    <td>
                                        <button onClick={() => handleDelete(rpp.id)} className="delete-button" title="Hapus">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center' }}>Belum ada RPP yang diunggah.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UploadRppPage;