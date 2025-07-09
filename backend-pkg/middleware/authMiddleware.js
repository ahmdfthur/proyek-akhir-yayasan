// backend-pkg/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../config/database');

exports.protect = async (req, res, next) => {
    let token;

    // Cek jika header authorization ada dan berformat 'Bearer <token>'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Ambil token dari header
            token = req.headers.authorization.split(' ')[1];

            // 2. Verifikasi token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Ambil data pengguna dari database berdasarkan id di token (tanpa password)
            // dan lampirkan ke object request agar bisa diakses di controller selanjutnya
            const [rows] = await db.query('SELECT id, name, email, role FROM users WHERE id = ?', [decoded.id]);
            if (rows.length === 0) {
                return res.status(401).json({ message: 'Pengguna tidak ditemukan.' });
            }
            req.user = rows[0];

            next(); // Lanjutkan ke controller selanjutnya
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Tidak terotorisasi, token gagal.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Tidak terotorisasi, tidak ada token.' });
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin_yayasan') {
        next();
    } else {
        res.status(403).json({ message: 'Akses ditolak. Hanya untuk admin.' });
    }
};