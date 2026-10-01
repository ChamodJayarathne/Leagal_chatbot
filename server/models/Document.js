import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
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
    // Tracks whether the document was manually edited after generation
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
  },
  {
    // Automatically manages createdAt and updatedAt on every save/update
    timestamps: true,
  }
);

export default mongoose.models.Document || mongoose.model('Document', documentSchema);

