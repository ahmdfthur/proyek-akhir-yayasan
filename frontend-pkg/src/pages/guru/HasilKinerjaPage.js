// frontend-pkg/src/pages/guru/HasilKinerjaPage.js

import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import { Link } from 'react-router-dom';
import './HasilKinerjaPage.css'; // Kita akan buat file CSS ini

const HasilKinerjaPage = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/evaluations/my-results')
            .then(response => {
                setResults(response.data);
            })
            .catch(error => {
                console.error("Gagal mengambil hasil kinerja:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="loading-message">Memuat hasil kinerja...</div>;
    }

    return (
        <div className="hasil-kinerja-container">
            <h2>Riwayat Hasil Kinerja Anda</h2>
            <p>Berikut adalah rekapitulasi hasil penilaian kinerja Anda per periode.</p>

            {results.length > 0 ? (
                <div className="results-grid">
                    {results.map(result => (
                        <div key={result.id} className="result-card">
                            <div className="result-card-header">
                                <h4>Periode Penilaian</h4>
                                <p>{result.academic_year} - Semester {result.semester}</p>
                            </div>
                            <div className="result-card-body">
                                <div className="final-score">
                                    <span className="score-value">{result.performance_value}</span>
                                    <span className="score-label">Nilai Akhir</span>
                                </div>
                                <div className="detail-score">
                                    <p>Total Skor: <strong>{result.total_score}</strong> / {result.max_score}</p>
                                    <p>Tanggal Dinilai: {new Date(result.evaluation_date).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
                                </div>
                            </div>
                            <div className="result-card-footer">
                                <Link to={`/dashboard/hasil-kinerja/${result.id}`} className="detail-button">
                                    Lihat Rincian
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card-no-data">
                    <p>Belum ada hasil penilaian yang tersedia untuk Anda.</p>
                </div>
            )}
        </div>
    );
};

export default HasilKinerjaPage;