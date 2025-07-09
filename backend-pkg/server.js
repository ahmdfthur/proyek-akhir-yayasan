// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const profileRoutes = require('./routes/profileRoutes');
const authRoutes = require('./routes/authRoutes');
const path = require('path')
const schoolRoutes = require('./routes/schoolRoutes');
const rppRoutes = require('./routes/rppRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes'); 
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Mengizinkan akses dari frontend
app.use(express.json()); // Mem-parse body request sebagai JSON

// Routes
app.get('/', (req, res) => {
  res.send('API Profil Yayasan Berjalan...');
});

//Uploud
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//PKG
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/rpp', rppRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes)

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});