// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

//Profile
const articleRoutes = require('./routes/articleRoutes');
const pageRoutes = require('./routes/pageRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const boardMemberRoutes = require('./routes/boardMemberRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Mengizinkan akses dari frontend
app.use(express.json()); // Mem-parse body request sebagai JSON

// Routes
app.get('/', (req, res) => {
  res.send('API Profil Yayasan Berjalan...');
});
//Profile
app.use('/api/articles', articleRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/board-members', boardMemberRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/messages', messageRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});