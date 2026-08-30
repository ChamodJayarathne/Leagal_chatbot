import mongoose from 'mongoose';

const rightsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  titleSi: String,
  titleTa: String,
  category: {
    type: String,
    required: true,
  },
  summary: String,
  summarySi: String,
  summaryTa: String,
  sections: [{
    actOrArticle: String,
    heading: String,
    description: String,
    descriptionSi: String,
    descriptionTa: String,
    keyTakeaways: [String],
  }],
  emergencyContacts: [{
    label: String,
    number: String,
  }],
});

export default mongoose.models.Rights || mongoose.model('Rights', rightsSchema);
