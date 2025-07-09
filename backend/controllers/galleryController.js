// backend/controllers/galleryController.js
const db = require('../config/database');

exports.getAllGalleryItems = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, image_url, caption, category FROM gallery ORDER BY uploaded_at DESC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};