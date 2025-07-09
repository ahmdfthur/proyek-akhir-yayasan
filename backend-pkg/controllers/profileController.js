// backend-pkg/controllers/profileController.js
const db = require('../config/database');

exports.getMyProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.query(
            `SELECT p.*, u.name as user_name, u.email, u.school_id 
             FROM users u
             LEFT JOIN teacher_profiles p ON u.id = p.user_id
             WHERE u.id = ?`, [userId]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

exports.updateMyProfile = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const userId = req.user.id;
        // LOG 1: Pastikan kita memulai dengan ID yang benar
        console.log(`--- Memulai Update untuk User ID: ${userId} ---`);

        const { user_name, email, nip, gender, birth_place, birth_date, phone_number, address, school_id } = req.body;

        // 1. Update tabel users
        console.log(`Menjalankan UPDATE untuk tabel users dengan ID: ${userId}`); // LOG 2
        await connection.query(
            'UPDATE users SET name = ?, school_id = ? WHERE id = ?',
            [user_name, school_id, userId]
        );
        
        let photoUrl = req.body.existing_photo_url || null;
        if (req.file) {
            photoUrl = `/uploads/${req.file.filename}`;
            console.log(`Foto baru diupload, path: ${photoUrl}`); // LOG 3
        }

        // 2. Update atau Insert tabel teacher_profiles
        const profileQuery = `
            INSERT INTO teacher_profiles (user_id, photo_url, nip, gender, birth_place, birth_date, phone_number, address)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            photo_url=VALUES(photo_url), nip=VALUES(nip), gender=VALUES(gender), 
            birth_place=VALUES(birth_place), birth_date=VALUES(birth_date), 
            phone_number=VALUES(phone_number), address=VALUES(address)
        `;
        
        console.log(`Menjalankan INSERT/UPDATE untuk tabel teacher_profiles dengan user_id: ${userId}`); // LOG 4
        await connection.query(profileQuery, [userId, photoUrl, nip, gender, birth_place, birth_date, phone_number, address]);

        await connection.commit();
        console.log(`--- Transaksi Berhasil untuk User ID: ${userId} ---`); // LOG 5
        res.status(200).json({ message: 'Profil berhasil diperbarui.' });

    } catch (error) {
        await connection.rollback();
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    } finally {
        connection.release();
    }
};