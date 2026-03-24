const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Resolve Angular dist path (handles different Angular CLI output structures)
const possibleAdminPaths = [
  path.join(__dirname, '../admin-app/dist/admin-app/browser'), // Angular 17+ new builder
  path.join(__dirname, '../admin-app/dist/admin-app'),         // older Angular or custom outputPath
  path.join(__dirname, '../admin-app/dist/browser'),           // rare fallback
];
const adminDistPath = possibleAdminPaths.find(p => fs.existsSync(path.join(p, 'index.html'))) || possibleAdminPaths[0];
console.log('Admin dist resolved to:', adminDistPath);
console.log('Admin index.html exists:', fs.existsSync(path.join(adminDistPath, 'index.html')));

// Student app dist
const studentDistPath = path.join(__dirname, '../student-app/dist');
console.log('Student dist exists:', fs.existsSync(path.join(studentDistPath, 'index.html')));

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/prephub');
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

connectDB();

// ─── API Routes (must come before static file serving) ───────────────────────
app.use('/api', require('./routes/api'));

// ─── Serve Admin App (Angular) at /admin ─────────────────────────────────────
app.use('/admin', express.static(adminDistPath));
app.get('/admin', (req, res) => {
  res.sendFile(path.join(adminDistPath, 'index.html'));
});
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(adminDistPath, 'index.html'));
});

// ─── Serve Student App (React/Vite) at / ─────────────────────────────────────
app.use(express.static(studentDistPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(studentDistPath, 'index.html'));
});

// ─── Error handling middleware ────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
