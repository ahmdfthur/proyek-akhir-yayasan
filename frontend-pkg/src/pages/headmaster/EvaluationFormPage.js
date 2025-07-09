import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../services/api';
import './PenilaianGuruPage.css'; // Memakai CSS yang sama

const EvaluationFormPage = () => {
    const { teacherId } = useParams();
    const navigate = useNavigate();
    
    // State untuk data
    const [teacher, setTeacher] = useState(null);
    const [aspects, setAspects] = useState([]);
    const [evaluations, setEvaluations] = useState({});
    const [period, setPeriod] = useState({ academic_year: '2024/2025', semester: 'Ganjil' });

    // State untuk UI
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Ambil daftar guru, aspek penilaian, dan detail guru yang dinilai
        Promise.all([
            apiClient.get('/users/teachers'),
            apiClient.get('/evaluations/aspects')
        ]).then(([teachersRes, aspectsRes]) => {
            const current = teachersRes.data.find(t => t.id === parseInt(teacherId));
            setTeacher(current);
            setAspects(aspectsRes.data);

            const initialEvals = {};
            aspectsRes.data.forEach(aspect => {
                initialEvals[aspect.id] = { score: 1 }; // Default skor 1
            });
            setEvaluations(initialEvals);
        }).catch(error => {
            console.error("Gagal memuat data awal:", error);
            setMessage("Gagal memuat data yang dibutuhkan untuk form.");
        }).finally(() => {
            setLoading(false);
        });
    }, [teacherId]);

    const handleScoreChange = (aspectId, score) => {
        setEvaluations(prev => ({
            ...prev,
            [aspectId]: { ...prev[aspectId], score: parseInt(score) }
        }));
    };

    const groupedAspects = useMemo(() => {
        return aspects.reduce((acc, aspect) => {
            const category = aspect.category || 'Lainnya';
            if (!acc[category]) acc[category] = [];
            acc[category].push(aspect);
            return acc;
        }, {});
    }, [aspects]);
    
    // --- PERBAIKAN DI SINI ---
    const calculatedResults = useMemo(() => {
        // Ambil semua skor dari state evaluations. Pastikan ada nilai default (0) jika belum ada.
        const scores = Object.values(evaluations).map(e => e.score || 0);

        // Jika belum ada skor sama sekali, kembalikan nilai default agar tidak error
        if (scores.length === 0) {
            return { total: 0, finalValue: "0.00" };
        }

        // Lakukan kalkulasi jika sudah ada skor
        const totalScore = scores.reduce((sum, current) => sum + current, 0);
        const finalValue = totalScore * 1.25;
        
        // Selalu kembalikan objek dengan struktur yang sama
        return { total: totalScore, finalValue: finalValue.toFixed(2) };
    }, [evaluations]); // Hanya bergantung pada `evaluations`

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            teacher_id: teacherId,
            academic_year: period.academic_year,
            semester: period.semester,
            evaluations: Object.keys(evaluations).map(aspectId => ({
                aspect_id: aspectId,
                score: evaluations[aspectId].score || 1,
            }))
        };
        try {
            const response = await apiClient.post('/evaluations', payload);
            alert(response.data.message);
            navigate('/dashboard/penilaian-guru'); // Kembali ke daftar guru
        } catch (error) {
            setMessage(error.response?.data?.message || 'Gagal menyimpan penilaian.');
        }
    };

    if (loading) {
        return <div className="loading-message">Memuat formulir penilaian...</div>;
    }

    return (
        <div className="evaluation-container">
            <h2>Formulir Penilaian Kinerja Guru: {teacher?.name || ''}</h2>
            <form onSubmit={handleSubmit} className="card">
                {/* ... (Pemilihan Periode) ... */}
                
                {Object.entries(groupedAspects).map(([category, items]) => (
                    <div key={category} className="competency-group">
                        <h3 className="competency-title">Kompetensi: {category}</h3>
                        <table className="evaluation-table">
                            <thead>
                                <tr>
                                    <th>Indikator Penilaian</th>
                                    <th>Skor (1-4)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(aspect => (
                                    <tr key={aspect.id}>
                                        <td>{aspect.id}. {aspect.aspect_name}</td>
                                        <td className="score-cell">
                                            <select value={evaluations[aspect.id]?.score || 1} onChange={e => handleScoreChange(aspect.id, e.target.value)} required>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
                
                <div className="results-summary">
                    <h4>Ringkasan Hasil</h4>
                    <p>Total Skor: <strong>{calculatedResults.total}</strong></p>
                    <p>Nilai Kinerja Akhir: <strong>{calculatedResults.finalValue}</strong></p>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-button">Simpan Penilaian</button>
                    {message && <p className="status-message error">{message}</p>}
                </div>
            </form>
        </div>
    );
};

export default EvaluationFormPage;