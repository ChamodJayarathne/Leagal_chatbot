import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    enum: ['en', 'si', 'ta'],
    default: 'en',
  },
  citations: [{
    actName: String,
    section: String,
    summary: String,
  }],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    default: 'New Legal Consultation',
  },
  category: {
    type: String,
    default: 'General Legal Advice',
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.ChatSession || mongoose.model('ChatSession', chatSessionSchema);
