// backend-pkg/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

// Konfigurasi Multer untuk penyimpanan file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Folder penyimpanan
    },
    filename: function (req, file, cb) {
        // Membuat nama file unik: profile-<timestamp>.<extension>
        cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
const path = require('path'); // Pastikan path di-import

router.use(protect);

router.route('/me')
    .get(profileController.getMyProfile)
    // Gunakan middleware upload.single('profilePhoto') untuk menangani satu file
    // 'profilePhoto' harus sama dengan nama field di FormData frontend
    .put(upload.single('profilePhoto'), profileController.updateMyProfile);

module.exports = router;