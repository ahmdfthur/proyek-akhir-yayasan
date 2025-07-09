// frontend/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/api';
import './HomePage.css'; // Import CSS

const HomePage = () => {
    const [featuredArticle, setFeaturedArticle] = useState(null);
    const [intro, setIntro] = useState(null);
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Contoh URL Youtube, nanti bisa diambil dari API settings
    const youtubeUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ"; 

    useEffect(() => {
        const fetchHomepageData = async () => {
            try {
                setLoading(true);
                // Mengambil semua data secara paralel untuk efisiensi
                const [articleRes, introRes, schoolsRes] = await Promise.all([
                    apiClient.get('/articles/featured'),
                    apiClient.get('/pages/slug/intro-pengenalan-yayasan'),
                    apiClient.get('/schools?limit=4')
                ]);

                setFeaturedArticle(articleRes.data);
                setIntro(introRes.data);
                setSchools(schoolsRes.data);

            } catch (error) {
                console.error("Gagal memuat data homepage:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomepageData();
    }, []);

    if (loading) {
        return <div className="loading-container">Memuat Halaman...</div>;
    }

    return (
        <div className="homepage-container">
            {/* 1. Banner Berita */}
            {featuredArticle && (
                <section 
                    className="hero-banner" 
                    style={{ backgroundImage: `url(${featuredArticle.thumbnail_url || 'https://via.placeholder.com/1200x400'})` }}
                >
                    <div className="hero-content">
                        <h1>{featuredArticle.title}</h1>
                        <p>{featuredArticle.excerpt}</p>
                        <Link to={`/artikel/${featuredArticle.slug}`} className="btn-primary">
                            Baca Selengkapnya
                        </Link>
                    </div>
                </section>
            )}

            {/* 2. Intro Pengenalan & Video Youtube */}
            <section className="intro-section">
                <div className="intro-text">
                    <h2>Intro Pengenalan Yayasan</h2>
                    {intro ? (
                        <div dangerouslySetInnerHTML={{ __html: intro.content }} />
                    ) : (
                        <p>Selamat datang di website resmi yayasan kami.</p>
                    )}
                    <Link to="/profil-yayasan" className="btn-secondary">
                        Selengkapnya
                    </Link>
                </div>
                <div className="intro-video">
                    <iframe 
                        width="560" 
                        height="315" 
                        src={youtubeUrl}
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                </div>
            </section>

            {/* 3. Sekolah Kami */}
            <section className="schools-section">
                <h2>Sekolah Kami</h2>
                <div className="schools-grid">
                    {schools.length > 0 ? schools.map(school => (
                        <div key={school.id} className="school-card">
                            <img src={school.image_url || 'https://via.placeholder.com/400x300'} alt={school.name} />
                            <div className="school-card-content">
                                <h3>{school.name}</h3>
                                <p>{school.description.substring(0, 100)}...</p>
                                <Link to={`/pendidikan/${school.slug}`} className="btn-tertiary">
                                    Lihat Detail
                                </Link>
                            </div>
                        </div>
                    )) : (
                        <p>Data sekolah tidak ditemukan.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default HomePage;