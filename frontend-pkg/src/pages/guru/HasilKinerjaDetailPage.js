import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';
import './HasilKinerjaDetailPage.css';

const HasilKinerjaDetailPage = () => {
    const { resultId } = useParams();
    const navigate = useNavigate();
    const [evaluation, setEvaluation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get(`/evaluations/results/${resultId}/details`)
            .then(response => {
                setEvaluation(response.data);
            })
            .catch(error => {
                console.error("Gagal mengambil rincian kinerja:", error);
            })
            .finally(() => setLoading(false));
    }, [resultId]);
    
    // Kode ini mengelompokkan 20 indikator berdasarkan kategorinya
    const groupedDetails = useMemo(() => {
        if (!evaluation?.details) return {};
        return evaluation.details.reduce((acc, detail) => {
            const category = detail.category || 'Lainnya';
            if (!acc[category]) acc[category] = [];
            acc[category].push(detail);
            return acc;
        }, {});
    }, [evaluation]);

    if (loading) return <div className="loading-message">Memuat rincian...</div>;
    if (!evaluation) return <div>Data tidak ditemukan.</div>;

    return (
        <div className="detail-container">
            <button onClick={() => navigate(-1)} className="back-button">
                &larr; Kembali ke Riwayat
            </button>
            <h2>Rincian Penilaian Kinerja</h2>
            <div className="detail-summary-card">
                <div><strong>Periode:</strong> {evaluation.academic_year} - {evaluation.semester}</div>
                <div><strong>Nilai Akhir:</strong> <span className="final-score-badge">{evaluation.performance_value}</span></div>
                <div><strong>Total Skor:</strong> {evaluation.total_score} / {evaluation.max_score}</div>
            </div>

            {/* Bagian ini akan me-render setiap kompetensi dan indikatornya */}
            {Object.entries(groupedDetails).map(([category, items]) => (
                <div key={category} className="card">
                    <h3 className="competency-title">Kompetensi: {category}</h3>
                    <ul className="detail-list">
                        {items.map((detail, index) => (
                            <li key={index} className="detail-list-item">
                                <span>{detail.aspect_name}</span>
                                <span className="score-badge">{detail.score}/4</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default HasilKinerjaDetailPage;