const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  topic: { type: String, required: true, unique: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  count: { type: Number, default: 1 }
});

module.exports = mongoose.model('TopicRequest', topicSchema);
