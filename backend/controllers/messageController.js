const db = require('../config/database');

exports.createMessage = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validasi dasar
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Nama, Email, dan Pesan tidak boleh kosong.' });
        }

        await db.query(
            'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject, message]
        );

        res.status(201).json({ message: 'Pesan Anda telah berhasil terkirim.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};