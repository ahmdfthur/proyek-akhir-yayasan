// backend/controllers/schoolController.js
const db = require('../config/database');

exports.getAllSchools = async (req, res) => {
    try {
        let query = 'SELECT id, name, slug, description, image_url, website_link FROM schools ORDER BY id ASC';

        // Menambahkan fungsionalitas limit jika ada di query url (contoh: /api/schools?limit=4)
        if (req.query.limit) {
            query += ` LIMIT ${parseInt(req.query.limit, 10)}`;
        }

        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};