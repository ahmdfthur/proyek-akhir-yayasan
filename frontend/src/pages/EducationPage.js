// frontend/src/pages/EducationPage.js
import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import './EducationPage.css';

const EducationPage = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/schools');
                setSchools(response.data);
            } catch (error) {
                console.error("Gagal memuat data sekolah:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchools();
    }, []);

    if (loading) {
        return <div className="loading-container">Memuat Data Pendidikan...</div>;
    }

    return (
        <div className="education-page-container">
            <div className="page-header">
                <h1>Unit Pendidikan Kami</h1>
                <p>Komitmen kami untuk mencetak generasi unggul melalui pendidikan berkualitas di setiap jenjang.</p>
            </div>
            <div className="schools-list">
                {schools.length > 0 ? (
                    schools.map((school, index) => (
                        // Logika untuk layout zig-zag ada di className
                        // Jika index genap (0, 2, ...), layout normal.
                        // Jika index ganjil (1, 3, ...), layout dibalik (reverse).
                        <div 
                            key={school.id} 
                            className={`school-item ${index % 2 !== 0 ? 'layout-reverse' : ''}`}
                        >
                            <div className="school-text-content">
                                <h2>{school.name}</h2>
                                <p>{school.description}</p>
                                <a 
                                    href={school.website_link || '#'} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="btn-visit"
                                >
                                    Kunjungi
                                </a>
                            </div>
                            <div className="school-image-content">
                                <img src={school.image_url || 'https://via.placeholder.com/500x350'} alt={school.name} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Belum ada data unit pendidikan yang tersedia.</p>
                )}
            </div>
        </div>
    );
};

export default EducationPage;