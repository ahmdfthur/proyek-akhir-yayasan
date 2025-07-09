// frontend/src/pages/GalleryPage.js
import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';

// Import komponen dan style dari library lightbox
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import './GalleryPage.css';

const GalleryPage = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    // State untuk mengontrol lightbox
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/gallery');
                setImages(response.data);
            } catch (error) {
                console.error("Gagal memuat data galeri:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    const openLightbox = (index) => {
        setCurrentIndex(index);
        setIsOpen(true);
    };

    // Menyiapkan data untuk format yang dibutuhkan oleh lightbox
    const lightboxSlides = images.map(img => ({
        src: img.image_url,
        title: img.caption,
    }));

    if (loading) {
        return <div className="loading-container">Memuat Galeri...</div>;
    }

    return (
        <>
            <div className="gallery-page-container">
                <div className="page-header">
                    <h1>Galeri Kegiatan</h1>
                    <p>Momen-momen berharga yang terekam dalam perjalanan kami.</p>
                </div>

                <div className="gallery-grid">
                    {images.map((image, index) => (
                        <div 
                            key={image.id} 
                            className="gallery-item" 
                            onClick={() => openLightbox(index)}
                        >
                            <img src={image.image_url} alt={image.caption || 'Galeri Yayasan'} />
                            <div className="overlay">
                                <p>{image.caption}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Komponen Lightbox akan muncul di atas halaman saat isOpen true */}
            <Lightbox
                open={isOpen}
                close={() => setIsOpen(false)}
                slides={lightboxSlides}
                index={currentIndex}
            />
        </>
    );
};

export default GalleryPage;