import mongoose from 'mongoose';

const lawyerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: 'Attorney-at-Law',
  },
  district: {
    type: String,
    required: true,
    index: true,
  },
  province: {
    type: String,
    required: true,
  },
  practiceAreas: [{
    type: String,
  }],
  languages: [{
    type: String,
  }],
  isLegalAid: {
    type: Boolean,
    default: false,
  },
  organization: {
    type: String,
    default: 'Independent Practice',
  },
  phone: String,
  email: String,
  address: String,
  rating: {
    type: Number,
    default: 4.8,
  },
  experienceYears: {
    type: Number,
    default: 10,
  },
  bio: String,
});

export default mongoose.models.Lawyer || mongoose.model('Lawyer', lawyerSchema);
