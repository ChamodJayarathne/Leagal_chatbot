import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  templateType: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  formData: {
    type: Object,
    default: {},
  },
  generatedContent: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: 'en',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Document || mongoose.model('Document', documentSchema);
