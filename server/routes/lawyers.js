import express from 'express';
import Lawyer from '../models/Lawyer.js';
import { getDBStatus } from '../config/db.js';
import { initialLawyersData } from '../data/seedData.js';

const router = express.Router();

// Get lawyers with filtering (district, practiceArea, language, isLegalAid)
router.get('/', async (req, res) => {
  try {
    const { district, practiceArea, language, isLegalAid, search } = req.query;

    let lawyers = [];

    if (getDBStatus()) {
      let filter = {};
      if (district && district !== 'All') filter.district = district;
      if (practiceArea && practiceArea !== 'All') filter.practiceAreas = practiceArea;
      if (language && language !== 'All') filter.languages = language;
      if (isLegalAid === 'true') filter.isLegalAid = true;

      lawyers = await Lawyer.find(filter);
    } else {
      lawyers = initialLawyersData;
      if (district && district !== 'All') {
        lawyers = lawyers.filter(l => l.district === district);
      }
      if (practiceArea && practiceArea !== 'All') {
        lawyers = lawyers.filter(l => l.practiceAreas.includes(practiceArea));
      }
      if (language && language !== 'All') {
        lawyers = lawyers.filter(l => l.languages.includes(language));
      }
      if (isLegalAid === 'true') {
        lawyers = lawyers.filter(l => l.isLegalAid);
      }
    }

    if (search) {
      const searchLower = search.toLowerCase();
      lawyers = lawyers.filter(l => 
        l.name.toLowerCase().includes(searchLower) ||
        l.district.toLowerCase().includes(searchLower) ||
        l.organization.toLowerCase().includes(searchLower)
      );
    }

    res.json(lawyers);
  } catch (error) {
    console.error('Lawyers route error:', error);
    res.status(500).json({ message: 'Failed to retrieve lawyers directory.' });
  }
});

// Submit consultation request to lawyer/legal aid center
router.post('/consultation', (req, res) => {
  const { lawyerId, lawyerName, clientName, clientPhone, clientEmail, issueSummary, preferredDate } = req.body;

  if (!clientName || !clientPhone || !issueSummary) {
    return res.status(400).json({ message: 'Name, phone number, and issue summary are required.' });
  }

  res.status(201).json({
    success: true,
    message: `Consultation request sent successfully to ${lawyerName || 'Attorney'}. You will receive a confirmation call/email shortly.`,
    referenceCode: `SL-LEG-${Math.floor(100000 + Math.random() * 900000)}`,
  });
});

export default router;
