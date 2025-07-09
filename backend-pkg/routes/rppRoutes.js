const express = require('express');
const router = express.Router();
const rppController = require('../controllers/rppController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Konfigurasi Multer (bisa sama atau beda dari profil)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'rpp-' + uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    fileFilter: function (req, file, cb) {
        // Validasi tipe file
        const filetypes = /pdf|doc|docx/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: Hanya file dengan format PDF, DOC, atau DOCX yang diizinkan!'));
    }
});

// Semua rute di sini diproteksi
router.use(protect);

router.route('/')
    .post(upload.single('rppFile'), rppController.uploadRpp);

// Rute untuk guru mendapatkan RPP miliknya
router.get('/my-rpp', rppController.getMyRpp);

// RUTE BARU UNTUK KEPALA SEKOLAH
router.get('/submissions', rppController.getAllSubmissionsForPrincipal);
router.put('/submissions/:id/status', rppController.updateSubmissionStatus);

router.delete('/:id', rppController.deleteRpp);

module.exports = router;