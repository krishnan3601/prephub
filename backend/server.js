const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
const adminDistPath = path.join(__dirname, '../admin-app/dist/admin-app/browser');
app.use('/admin', express.static(adminDistPath));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(adminDistPath, 'index.html'));
});

// ─── Serve Student App (React/Vite) at / ─────────────────────────────────────
const studentDistPath = path.join(__dirname, '../student-app/dist');
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
  console.log(`Student App: http://localhost:${PORT}`);
  console.log(`Admin App:   http://localhost:${PORT}/admin`);
});
