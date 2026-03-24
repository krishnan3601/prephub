const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  progress: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    status: { type: String, enum: ['solved', 'attempted'], default: 'attempted' }
  }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
});

module.exports = mongoose.model('User', userSchema);
