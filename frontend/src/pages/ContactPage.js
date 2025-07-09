// frontend/src/pages/ContactPage.js
import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import './ContactPage.css';
// Import ikon yang akan kita gunakan
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram } from 'react-icons/fa';

const ContactPage = () => {
    const [info, setInfo] = useState({});
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState({ submitting: false, success: false, error: '' });

    useEffect(() => {
        // Set the contact information directly
        setInfo({
            contact_address: 'Jalan Padang Savana, Lampung',
            contact_phone: '(+62)858-8888-8888',
            contact_email: 'email@yayasan.com',
            maps_embed_url: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248.35089540430633!2d105.70203774498731!3d-5.165581280221731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e408bb81a355d7d%3A0x17f544434afc362e!2sBM%20Mart!5e0!3m2!1sid!2sid!4v1751012932524!5m2!1sid!2sid" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
            social_facebook_url: 'https://facebook.com/yayasan',
            social_instagram_url: 'https://instagram.com/yayasan'
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ submitting: true, success: false, error: '' });
        try {
            await apiClient.post('/messages', formData);
            setStatus({ submitting: false, success: true, error: '' });
            setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Gagal mengirim pesan. Silakan coba lagi.';
            setStatus({ submitting: false, success: false, error: errorMessage });
        }
    };

    return (
        <div className="contact-page-container">
            <div className="page-header">
                <h1>Hubungi Kami</h1>
                <p>Kami senang mendengar dari Anda. Silakan hubungi kami melalui detail di bawah atau kirimkan pesan melalui formulir.</p>
            </div>

            <div className="contact-content-wrapper">
                {/* Kolom Kiri: Info & Peta */}
                <div className="contact-info-column">
                    <h3>Informasi Kontak</h3>
                    <div className="info-item"><FaMapMarkerAlt /> <span>{info.contact_address || 'Alamat tidak tersedia'}</span></div>
                    <div className="info-item"><FaPhone /> <span>{info.contact_phone || 'Telepon tidak tersedia'}</span></div>
                    <div className="info-item"><FaEnvelope /> <span>{info.contact_email || 'Email tidak tersedia'}</span></div>
                    
                    <div className="social-icons">
                        {info.social_facebook_url && <a href={info.social_facebook_url} target="_blank" rel="noopener noreferrer"><FaFacebook /></a>}
                        {info.social_instagram_url && <a href={info.social_instagram_url} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>}
                        {/* Tambahkan ikon sosial media lainnya jika ada */}
                    </div>

                    <h3>Lokasi Kami</h3>
                    <div className="map-container" dangerouslySetInnerHTML={{ __html: info.maps_embed_url }}></div>
                </div>

                {/* Kolom Kanan: Formulir Kontak */}
                <div className="contact-form-column">
                    <h3>Kirim Pesan</h3>
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="name" placeholder="Nama Anda" value={formData.name} onChange={handleChange} required />
                        <input type="email" name="email" placeholder="Email Anda" value={formData.email} onChange={handleChange} required />
                        <input type="text" name="subject" placeholder="Subjek" value={formData.subject} onChange={handleChange} />
                        <textarea name="message" rows="6" placeholder="Pesan Anda" value={formData.message} onChange={handleChange} required></textarea>
                        <button type="submit" disabled={status.submitting}>
                            {status.submitting ? 'Mengirim...' : 'Kirim Pesan'}
                        </button>
                    </form>
                    {status.success && <p className="status-success">Pesan Anda telah berhasil terkirim. Terima kasih!</p>}
                    {status.error && <p className="status-error">{status.error}</p>}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
