// frontend/src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import './ProfilePage.css';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [vision, setVision] = useState(null); // 'visi'
    const [mission, setMission] = useState(null); // 'misi'
    const [boardMembers, setBoardMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Kita asumsikan URL Youtube sama dengan di beranda
    const youtubeUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ";

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const [profileRes, visionRes, missionRes, membersRes] = await Promise.all([
                    apiClient.get('/pages/slug/profil-yayasan-utama'),
                    apiClient.get('/pages/slug/visi'),
                    apiClient.get('/pages/slug/misi'),
                    apiClient.get('/board-members')
                ]);
                
                setProfile(profileRes.data);
                setVision(visionRes.data);
                setMission(missionRes.data);
                setBoardMembers(membersRes.data);

            } catch (error) {
                console.error("Gagal memuat data halaman profil:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    if (loading) {
        return <div className="loading-container">Memuat Halaman...</div>;
    }

    return (
        <div className="profile-page-container">
            {/* Bagian 1: Deskripsi Utama & Video */}
            <section className="profile-header-section section-padding">
                <div className="profile-description">
                    <h2>Yayasan Baitul Muslim Lampung Timur</h2>
                    {profile ? (
                        <div dangerouslySetInnerHTML={{ __html: profile.content }} />
                    ) : <p>Informasi profil tidak tersedia.</p>}
                </div>
                <div className="profile-video">
                    <iframe 
                        src={youtubeUrl}
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen>
                    </iframe>
                </div>
            </section>

            {/* Bagian 2: Sambutan Pengurus */}
            <section className="board-members-section section-padding bg-light">
                <h2>Sambutan Pengurus Yayasan</h2>
                <div className="board-members-grid">
                    {boardMembers.length > 0 ? boardMembers.map(member => (
                        <div key={member.name} className="member-card">
                            <img src={member.photo_url || 'https://via.placeholder.com/150'} alt={member.name} />
                            <h4>{member.name}</h4>
                            <h5>{member.position}</h5>
                            <p>{member.welcome_speech}</p>
                        </div>
                    )) : <p>Data pengurus tidak tersedia.</p>}
                </div>
            </section>

            {/* Bagian 3: Visi & Misi */}
            <section className="vision-mission-section section-padding">
                <div className="vision-card">
                    <h3>Visi</h3>
                    {vision ? (
                        <div dangerouslySetInnerHTML={{ __html: vision.content }} />
                    ) : <p>Informasi visi tidak tersedia.</p>}
                </div>
                <div className="mission-card">
                    <h3>Misi</h3>
                    {mission ? (
                        <div dangerouslySetInnerHTML={{ __html: mission.content }} />
                    ) : <p>Informasi misi tidak tersedia.</p>}
                </div>
            </section>

            {/* Bagian selanjutnya (Program, Mitra) bisa ditambahkan di sini dengan pola yang sama */}
        </div>
    );
};

export default ProfilePage;