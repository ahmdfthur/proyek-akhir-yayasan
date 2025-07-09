const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { protect, isAdmin } = require('../middleware/authMiddleware'); 
const multer = require('multer');
const path = require('path');

// Konfigurasi Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, 'article-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// Rute Publik (GET)
router.get('/', articleController.getAllArticles);
router.get('/:slug', articleController.getArticleBySlug);

// Rute CMS (dilindungi oleh middleware)
// Asumsikan isAdmin memeriksa role 'admin_yayasan'
router.post('/', protect, upload.single('thumbnail'), articleController.createArticle);
router.put('/:id', protect, upload.single('thumbnail'), articleController.updateArticle);
router.delete('/:id', protect, articleController.deleteArticle);

module.exports = router;