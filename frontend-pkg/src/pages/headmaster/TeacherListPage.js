import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api';
import './TeacherListPage.css';

const TeacherListPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get('/users/teachers')
            .then(res => setTeachers(res.data))
            .catch(err => console.error("Gagal mengambil data guru:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Memuat daftar guru...</div>;

    return (
        <div className="teacher-list-container">
            <h2>Penilaian Kinerja Guru</h2>
            <p>Pilih guru yang akan dinilai kinerjanya.</p>
            <div className="teacher-list-card">
                {teachers.length > 0 ? teachers.map(teacher => (
                    <div key={teacher.id} className="teacher-item">
                        <span className="teacher-name">{teacher.name}</span>
                        <Link to={`/dashboard/penilaian-guru/${teacher.id}`} className="assess-button">
                            Nilai
                        </Link>
                    </div>
                )) : (
                    <p>Tidak ada data guru yang ditemukan di sekolah Anda.</p>
                )}
            </div>
        </div>
    );
};

export default TeacherListPage;