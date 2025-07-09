// backend/controllers/articleController.js
const db = require('../config/database');
const fs = require('fs');
const path = require('path');

// Mengambil semua artikel
exports.getAllArticles = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, title, slug, thumbnail_url, LEFT(content, 150) as excerpt, published_at FROM articles ORDER BY published_at DESC');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Mengambil satu artikel berdasarkan slug
exports.getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await db.query('SELECT * FROM articles WHERE slug = ?', [slug]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.createArticle = async (req, res) => {
    try {
        const { title, content, author, published_at } = req.body;
        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const thumbnail_url = req.file ? `/uploads/${req.file.filename}` : null;
        
        const query = 'INSERT INTO articles (title, slug, content, author, published_at, thumbnail_url) VALUES (?, ?, ?, ?, ?, ?)';
        await db.query(query, [title, slug, content, author, published_at, thumbnail_url]);
        
        res.status(201).json({ message: 'Artikel berhasil dibuat.' });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

exports.updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, author, published_at } = req.body;
        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        let thumbnail_url = req.body.existing_thumbnail || null;
        if (req.file) {
            thumbnail_url = `/uploads/${req.file.filename}`;
        }
        
        const query = 'UPDATE articles SET title=?, slug=?, content=?, author=?, published_at=?, thumbnail_url=? WHERE id=?';
        await db.query(query, [title, slug, content, author, published_at, thumbnail_url, id]);

        res.status(200).json({ message: 'Artikel berhasil diperbarui.' });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

exports.deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;
        // Hapus file thumbnail jika ada
        const [article] = await db.query('SELECT thumbnail_url FROM articles WHERE id = ?', [id]);
        if (article.length > 0 && article[0].thumbnail_url) {
            const filePath = path.join(__dirname, '..', article[0].thumbnail_url);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        await db.query('DELETE FROM articles WHERE id = ?', [id]);
        res.status(200).json({ message: 'Artikel berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};