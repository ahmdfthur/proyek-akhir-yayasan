// backend/controllers/authController.js
const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Fungsi untuk mendaftarkan pengguna baru (berguna untuk setup awal)
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, school_id } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Data tidak lengkap.' });
        }

        // Hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Simpan ke database
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role, school_id) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, role, school_id || null]
        );

        res.status(201).json({ message: 'Pengguna berhasil terdaftar', userId: result.insertId });

    } catch (error) {
        // Tangani jika email sudah terdaftar
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Email sudah terdaftar.' });
        }
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Fungsi untuk login pengguna
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Cari pengguna berdasarkan email
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Email atau password salah.' });
        }
        const user = rows[0];

        // 2. Bandingkan password yang diinput dengan hash di database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email atau password salah.' });
        }

        // 3. Jika cocok, buat JSON Web Token (JWT)
        const payload = {
            id: user.id,
            name: user.name,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '8h' 
        });

        // 4. Kirim token ke client
        res.status(200).json({
            message: 'Login berhasil',
            token: token
        });

    } catch (error) {
        // INI BAGIAN YANG PENTING:
        // Cetak detail error ke terminal backend kita
        console.error('LOGIN ERROR:', error); 
        
        // Kirim respons error yang umum ke frontend
        res.status(500).json({ message: 'Terjadi kesalahan di server.' }); 
    }
};

// Fungsi untuk mendapatkan data pengguna yang sedang login (Karena middleware 'protect' sudah dijalankan sebelumnya, data pengguna sudah tersedia di req.user)
exports.getMe = async (req, res) => {
    res.status(200).json(req.user);
};