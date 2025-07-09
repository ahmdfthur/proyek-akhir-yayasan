const db = require('../config/database');
const fs = require('fs');
const path = require('path');

// Mengunggah RPP baru
exports.uploadRpp = async (req, res) => {
    try {
        const teacher_id = req.user.id;
        // Ambil rpp_type, bukan lagi subject
        const { academic_year, semester, rpp_type } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'File RPP tidak boleh kosong.' });
        }
        // Validasi field yang baru
        if (!academic_year || !semester || !rpp_type) {
            return res.status(400).json({ message: 'Semua field harus diisi.' });
        }

        const file_name = req.file.originalname;
        const file_url = `/uploads/${req.file.filename}`;

        // Gunakan rpp_type di query
        const query = 'INSERT INTO rpp_submissions (teacher_id, academic_year, semester, rpp_type, file_name, file_url) VALUES (?, ?, ?, ?, ?, ?)';
        await db.query(query, [teacher_id, academic_year, semester, rpp_type, file_name, file_url]);

        res.status(201).json({ message: 'RPP berhasil diunggah.' });
    } catch (error) {
        console.error("RPP Upload Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Mendapatkan semua RPP milik guru yang login
exports.getMyRpp = async (req, res) => {
    try {
        const teacher_id = req.user.id;
        const query = 'SELECT * FROM rpp_submissions WHERE teacher_id = ? ORDER BY submitted_at DESC';
        const [rows] = await db.query(query, [teacher_id]);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Get My RPP Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Menghapus RPP
exports.deleteRpp = async (req, res) => {
    try {
        const teacher_id = req.user.id;
        const { id } = req.params; // ID dari RPP yang akan dihapus

        // Cek dulu apakah RPP ini milik user yang sedang login
        const [rows] = await db.query('SELECT * FROM rpp_submissions WHERE id = ? AND teacher_id = ?', [id, teacher_id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'RPP tidak ditemukan atau Anda tidak memiliki hak akses.' });
        }

        const rpp = rows[0];

        // Hapus file dari server
        const filePath = path.join(__dirname, '..', rpp.file_url);
        fs.unlink(filePath, (err) => {
            if (err) console.error("Gagal menghapus file fisik:", err);
        });

        // Hapus record dari database
        await db.query('DELETE FROM rpp_submissions WHERE id = ?', [id]);

        res.status(200).json({ message: 'RPP berhasil dihapus.' });
    } catch (error) {
        console.error("Delete RPP Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getAllSubmissionsForPrincipal = async (req, res) => {
    try {
        // Ambil school_id dari user Kepala Sekolah yang sedang login
        const [user] = await db.query('SELECT school_id FROM users WHERE id = ?', [req.user.id]);
        if (!user || user.length === 0 || !user[0].school_id) {
            return res.status(403).json({ message: 'Anda tidak terhubung dengan sekolah manapun.' });
        }
        const schoolId = user[0].school_id;

        // Ambil semua RPP dari guru-guru yang ada di sekolah tersebut
        const query = `
            SELECT rs.*, u.name AS teacher_name
            FROM rpp_submissions rs
            JOIN users u ON rs.teacher_id = u.id
            WHERE u.school_id = ?
            ORDER BY rs.submitted_at DESC
        `;
        const [submissions] = await db.query(query, [schoolId]);
        res.status(200).json(submissions);

    } catch (error) {
        console.error("Get Submissions for Principal Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// FUNGSI BARU 2: Mengubah status RPP
exports.updateSubmissionStatus = async (req, res) => {
    try {
        const { id } = req.params; // ID dari rpp_submissions
        const { status, notes } = req.body;

        // TODO: Tambahkan validasi keamanan untuk memastikan Kepsek hanya bisa mengubah status
        // RPP dari guru di sekolahnya sendiri. Untuk saat ini kita sederhanakan.

        const query = 'UPDATE rpp_submissions SET status = ?, notes = ? WHERE id = ?';
        await db.query(query, [status, notes || null, id]);

        res.status(200).json({ message: 'Status RPP berhasil diperbarui.' });

    } catch (error) {
        console.error("Update RPP Status Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};