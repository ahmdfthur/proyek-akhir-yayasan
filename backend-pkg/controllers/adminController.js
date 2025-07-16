// backend-pkg/controllers/adminController.js

const db = require('../config/database');
const bcrypt = require('bcrypt');

// FUNGSI 1: Mengambil ringkasan untuk dasbor admin (DENGAN PERBAIKAN)
exports.getDashboardSummary = async (req, res) => {
    try {
        const [
            [[userStats]],
            [[schoolStats]],
            [[evaluationStats]],
            roleStatsRows
        ] = await Promise.all([
            db.query("SELECT COUNT(*) as total FROM users"),
            db.query("SELECT COUNT(*) as total FROM schools"),
            db.query("SELECT COUNT(*) as total FROM evaluation_results"),
            db.query("SELECT role, COUNT(*) as count FROM users GROUP BY role")
        ]);

        const roles = roleStatsRows.reduce((acc, item) => {
            acc[item.role] = item.count;
            return acc;
        }, {});

        // --- PERBAIKAN UTAMA ADA DI SINI ---
        // Kita ubah nama kunci agar cocok dengan yang diharapkan frontend
        const summary = {
            total_users: userStats.total || 0,
            total_schools: schoolStats.total || 0,
            total_evaluations: evaluationStats.total || 0,
            users_by_role: {
                admin: roles['admin_yayasan'] || 0,      // Menggunakan 'admin'
                headmaster: roles['kepala_sekolah'] || 0, // Menggunakan 'headmaster'
                teacher: roles['guru'] || 0              // Menggunakan 'teacher'
            }
        };

        res.status(200).json(summary);
    } catch (error) {
        console.error("Get Dashboard Summary Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// FUNGSI 2: Mengambil semua pengguna
exports.getAllUsers = async (req, res) => {
    try {
        const query = `
            SELECT u.id, u.name, u.email, u.role, s.name AS school_name
            FROM users u
            LEFT JOIN schools s ON u.school_id = s.id
            ORDER BY u.id
        `;
        const [users] = await db.query(query);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// FUNGSI 3: Membuat pengguna baru
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, school_id } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Semua field wajib diisi kecuali Tempat Tugas.' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const query = 'INSERT INTO users (name, email, password, role, school_id) VALUES (?, ?, ?, ?, ?)';
        await db.query(query, [name, email, hashedPassword, role, role === 'admin_yayasan' ? null : school_id]);
        res.status(201).json({ message: 'Pengguna baru berhasil dibuat.' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email sudah terdaftar.' });
        }
        res.status(500).json({ message: "Server Error" });
    }
};

// FUNGSI 4: Menghapus pengguna
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.status(200).json({ message: 'Pengguna berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// FUNGSI 5: Mengambil satu pengguna berdasarkan ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const [users] = await db.query('SELECT id, name, email, role, school_id FROM users WHERE id = ?', [id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }
        res.status(200).json(users[0]);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// FUNGSI 6: Memperbarui data pengguna
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, school_id, password } = req.body;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            await db.query(
                'UPDATE users SET name = ?, email = ?, role = ?, school_id = ?, password = ? WHERE id = ?',
                [name, email, role, role === 'admin_yayasan' ? null : school_id, hashedPassword, id]
            );
        } else {
            await db.query(
                'UPDATE users SET name = ?, email = ?, role = ?, school_id = ? WHERE id = ?',
                [name, email, role, role === 'admin_yayasan' ? null : school_id, id]
            );
        }
        res.status(200).json({ message: 'Data pengguna berhasil diperbarui.' });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// FUNGSI 7: Mengambil laporan kinerja
exports.getPerformanceReport = async (req, res) => {
    try {
        const { school_id } = req.query;
        let query = `
            SELECT er.id, er.academic_year, er.semester, er.performance_value,
                   u.name AS teacher_name, s.name AS school_name
            FROM evaluation_results er
            JOIN users u ON er.teacher_id = u.id
            JOIN schools s ON u.school_id = s.id
        `;
        const queryParams = [];
        if (school_id && school_id !== 'all') {
            query += ' WHERE u.school_id = ?';
            queryParams.push(school_id);
        }
        query += ' ORDER BY s.name, er.performance_value DESC';
        const [reports] = await db.query(query, queryParams);
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
