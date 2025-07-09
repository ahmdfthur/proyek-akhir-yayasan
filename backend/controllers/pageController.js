// backend/controllers/pageController.js
const db = require('../config/database');

exports.getPageBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const [rows] = await db.query('SELECT title, content FROM pages WHERE slug = ?', [slug]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Halaman tidak ditemukan' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};