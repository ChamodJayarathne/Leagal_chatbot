import express from 'express';
import Rights from '../models/Rights.js';
import { getDBStatus } from '../config/db.js';
import { initialRightsData } from '../data/seedData.js';

const router = express.Router();

// Get all rights & legal guides
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;

    let items = [];
    if (getDBStatus()) {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      items = await Rights.find(query);
    } else {
      items = initialRightsData;
      if (category && category !== 'All') {
        items = items.filter(r => r.category === category);
      }
    }

    if (search) {
      const searchLower = search.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        (item.summary && item.summary.toLowerCase().includes(searchLower)) ||
        (item.titleSi && item.titleSi.includes(search)) ||
        (item.titleTa && item.titleTa.includes(search))
      );
    }

    res.json(items);
  } catch (error) {
    console.error('Fetch rights error:', error);
    res.status(500).json({ message: 'Error retrieving citizen rights knowledge base.' });
  }
});

// Get emergency police rights pocket guide
router.get('/emergency', (req, res) => {
  res.json({
    title: 'Emergency Police Station & Arrest Pocket Guide',
    titleSi: 'පොලිස් අත්අඩංගුවට ගැනීමේ හදිසි අයිතිවාසිකම් මගපෙන්වීම',
    titleTa: 'அவசர பொலிஸ் மற்றும் கைது பாதுகாப்பு வழிகாட்டி',
    constitutionRef: 'Article 13 - 1978 Constitution of Sri Lanka',
    keyRules: [
      {
        rule: 'Right to Reason for Arrest',
        ruleSi: 'අත්අඩංගුවට ගැනීමට හේතුව දැනගැනීමේ අයිතිය',
        ruleTa: 'கைதுக்கான காரணத்தை அறியும் உரிமை',
        detail: 'Police officers must immediately inform you of the exact legal reason for detaining or arresting you.'
      },
      {
        rule: 'Right to Inform Family & Attorney',
        ruleSi: 'පවුලේ අයට සහ නීතිඥවරයාට දැනුම්දීමේ අයිතිය',
        ruleTa: 'குடும்பத்தினர் மற்றும் சட்டத்தரணிக்கு தெரிவிக்கும் உரிமை',
        detail: 'You have the right to contact a family member and consult your Attorney-at-Law without unreasonable delay.'
      },
      {
        rule: '24-Hour Production Before Magistrate',
        ruleSi: 'පැය 24ක් ඇතුළත මහේස්ත්‍රාත්වරයෙකු හමුවට ඉදිරිපත් කිරීම',
        ruleTa: '24 மணி நேரத்திற்குள் நீதவான் முன் ஆஜர்படுத்துதல்',
        detail: 'Under Section 37 of the Code of Criminal Procedure, any arrested person must be brought before the Magistrate within 24 hours.'
      },
      {
        rule: 'Absolute Prohibition of Torture',
        ruleSi: 'වදහිංසාවට ලක්නොවීමේ පූර්ණ අයිතිය',
        ruleTa: 'சித்திரவதைக்கு எதிரான முழுமையான பாதுகாப்பு',
        detail: 'Article 11 guarantees zero tolerance for physical violence, threats, or coercion under police custody.'
      }
    ],
    hotlines: [
      { name: 'Police Emergency Hotline', number: '119' },
      { name: 'Legal Aid Commission of Sri Lanka', number: '1970' },
      { name: 'Human Rights Commission (HRCSL)', number: '1996' },
      { name: 'Bar Association Legal Aid Desk (BASL)', number: '011-2447158' }
    ]
  });
});

export default router;
