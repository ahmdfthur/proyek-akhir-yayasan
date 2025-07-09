// frontend-pkg/src/pages/headmaster/ValidasiRppPage.js
import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import './ValidasiRppPage.css';

const ValidasiRppPage = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = 'http://localhost:5001';

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/rpp/submissions');
            setSubmissions(response.data);
        } catch (error) {
            console.error("Gagal mengambil data RPP:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const handleStatusChange = async (rppId, newStatus) => {
        // Di aplikasi nyata, bisa tambahkan modal untuk mengisi 'notes' jika ditolak
        let notes = '';
        if (newStatus === 'rejected') {
            notes = prompt('Silakan masukkan alasan penolakan:');
            if (notes === null) return; // Batalkan jika pengguna menekan cancel
        }

        try {
            await apiClient.put(`/rpp/submissions/${rppId}/status`, {
                status: newStatus,
                notes: notes
            });
            fetchSubmissions(); // Refresh data setelah update
        } catch (error) {
            console.error("Gagal memperbarui status:", error);
            alert('Gagal memperbarui status.');
        }
    };

    if (loading) return <div>Memuat data...</div>;

    return (
        <div className="validation-container">
            <h2>Validasi Rencana Pelaksanaan Pembelajaran</h2>
            <p>Berikut adalah daftar RPP yang diajukan oleh guru untuk divalidasi.</p>
            <div className="card">
                <table className="validation-table">
                    <thead>
                        <tr>
                            <th>Nama Guru</th>
                            <th>Jenis RPP</th>
                            <th>File</th>
                            <th>Tanggal Upload</th>
                            <th>Status Saat Ini</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.length > 0 ? submissions.map(rpp => (
                            <tr key={rpp.id}>
                                <td>{rpp.teacher_name}</td>
                                <td className="rpp-type">{rpp.rpp_type}</td>
                                <td><a href={`${API_URL}${rpp.file_url}`} target="_blank" rel="noopener noreferrer">{rpp.file_name}</a></td>
                                <td>{new Date(rpp.submitted_at).toLocaleDateString('id-ID')}</td>
                                <td><span className={`status status-${rpp.status}`}>{rpp.status}</span></td>
                                <td>
                                    {rpp.status === 'pending' ? (
                                        <div className="action-group">
                                            <button onClick={() => handleStatusChange(rpp.id, 'approved')} className="action-button approve">Setujui</button>
                                            <button onClick={() => handleStatusChange(rpp.id, 'rejected')} className="action-button reject">Tolak</button>
                                        </div>
                                    ) : (
                                        <span>Selesai</span>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>Tidak ada RPP yang perlu divalidasi.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ValidasiRppPage;