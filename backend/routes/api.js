const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Question = require('../models/Question');
const TopicRequest = require('../models/TopicRequest');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET / - API status
router.get('/', (req, res) => {
  res.json({
    message: 'PrepHub API is running ✅',
    routes: [
      'POST /api/register',
      'POST /api/login',
      'GET  /api/questions',
      'POST /api/submit',
      'GET  /api/me',
      'GET  /api/leaderboard',
      'POST /api/addQuestion',
      'PUT  /api/update/:id',
      'DELETE /api/delete/:id',
      'GET  /api/topicRequests',
      'POST /api/upload',
    ]
  });
});

// POST /upload
router.post('/upload', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

// POST /register
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    const assignedRole = role === 'admin' ? 'admin' : 'student';
    user = new User({ username, password, role: assignedRole });
    await user.save();
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret123');
    res.status(201).json({ token, role: user.role, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret123');
    res.json({ token, role: user.role, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /questions
router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /addQuestion
router.post('/addQuestion', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const { title, description, difficulty, tags } = req.body;
    const newQuestion = new Question({ title, description, difficulty, tags });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /update/:id
router.put('/update/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /delete/:id
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /submit
router.post('/submit', auth, async (req, res) => {
  try {
    const { questionId, status } = req.body;
    const user = await User.findById(req.user.id);
    
    const existingProgress = user.progress.find(p => p.questionId.toString() === questionId);
    if (existingProgress) {
      existingProgress.status = status;
    } else {
      user.progress.push({ questionId, status });
    }
    
    await user.save();
    res.json({ message: 'Progress updated', progress: user.progress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find({ role: 'student' });
    const leaderboard = users.map(u => {
      const solved = u.progress.filter(p => p.status === 'solved').length;
      return { username: u.username, solvedCount: solved };
    }).sort((a, b) => b.solvedCount - a.solvedCount);
    
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('progress.questionId');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /trackSearch - auto-called when a student search yields 0 results
router.post('/trackSearch', auth, async (req, res) => {
  try {
    const { topic } = req.body;
    const userId = req.user.id;
    let request = await TopicRequest.findOne({ topic: new RegExp('^' + topic.trim() + '$', 'i') });
    
    if (request) {
      if (!request.students.includes(userId)) {
        request.students.push(userId);
        request.count = request.students.length;
        await request.save();
      }
    } else {
      request = new TopicRequest({ topic: topic.trim(), students: [userId], count: 1 });
      await request.save();
    }
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /topicRequests
router.get('/topicRequests', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    const requests = await TopicRequest.find({ count: { $gte: 3 } }).sort({ count: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
