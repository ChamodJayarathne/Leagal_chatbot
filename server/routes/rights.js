import express from 'express';
import Rights from '../models/Rights.js';
import { getDBStatus } from '../config/db.js';
import { initialRightsData } from '../data/seedData.js';
import { searchLegalContext } from '../services/ragService.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// ─── Scenario keyword-to-category scoring map ────────────────────────────────
const SCENARIO_KEYWORD_MAP = [
  {
    category: 'Fundamental Rights',
    keywords: [
      'police', 'arrest', 'detained', 'custody', 'taken', 'jail', 'prison',
      'torture', 'beaten', 'abused in custody', 'interrogated', 'locked up',
      'magistrate', '24 hours', 'no reason', 'warrant', 'rights', 'constitutional',
      'discriminated', 'equality', 'race', 'religion', 'gender', 'protest',
    ],
    relevanceLabels: {
      high: ['arrest', 'detained', 'police', 'torture', 'custody', 'jail'],
      medium: ['rights', 'constitutional', 'magistrate', 'discriminated'],
    }
  },
  {
    category: 'Employment Law',
    keywords: [
      'salary', 'wage', 'pay', 'fired', 'dismissed', 'terminated', 'employer',
      'employee', 'boss', 'work', 'job', 'office', 'overtime', 'leave',
      'annual leave', 'gratuity', 'notice period', 'contract', 'labor',
      'labour', 'workplace', 'unfair dismissal', 'layoff', 'redundant',
      'harassment at work', 'not paid', 'unpaid',
    ],
    relevanceLabels: {
      high: ['fired', 'salary', 'dismissed', 'unpaid', 'gratuity', 'terminated'],
      medium: ['employer', 'boss', 'work', 'job', 'leave', 'overtime'],
    }
  },
  {
    category: 'Tenancy & Property',
    keywords: [
      'landlord', 'tenant', 'rent', 'evict', 'eviction', 'house', 'property',
      'lease', 'agreement', 'notice', 'deposit', 'advance', 'kicked out',
      'forced out', 'vacate', 'locked out', 'flat', 'apartment', 'room',
      'owner', 'renting', 'rental', 'premises',
    ],
    relevanceLabels: {
      high: ['evict', 'eviction', 'landlord', 'kicked out', 'locked out', 'forced out'],
      medium: ['rent', 'tenant', 'deposit', 'lease', 'notice'],
    }
  },
  {
    category: 'Family Law',
    keywords: [
      'husband', 'wife', 'spouse', 'domestic', 'violence', 'abuse', 'abusive',
      'hit', 'beat', 'assault', 'threat', 'threaten', 'divorce', 'separation',
      'child', 'custody', 'maintenance', 'alimony', 'family', 'marriage',
      'partner', 'cohabit', 'protect', 'protection order', 'restraining',
    ],
    relevanceLabels: {
      high: ['abuse', 'abusive', 'violence', 'hit', 'beat', 'assault', 'threat'],
      medium: ['husband', 'wife', 'spouse', 'divorce', 'protection order'],
    }
  },
  {
    category: 'Consumer Rights',
    keywords: [
      'consumer', 'shop', 'warranty', 'defective', 'faulty', 'refund', 'replacement',
      'overcharge', 'mrp', 'expired', 'trader', 'product', 'goods', 'store', 'return',
      'seller', 'fake', 'substandard', 'broken', 'repair', 'caa',
    ],
    relevanceLabels: {
      high: ['warranty', 'defective', 'refund', 'replacement', 'overcharge', 'expired'],
      medium: ['consumer', 'shop', 'trader', 'product', 'goods'],
    }
  },
  {
    category: 'Cyber & Digital Law',
    keywords: [
      'cyber', 'hack', 'hacked', 'blackmail', 'online harassment', 'social media',
      'facebook', 'whatsapp', 'instagram', 'leak', 'intimate photos', 'fake account',
      'doxxing', 'phishing', 'extortion', 'bullying', 'cert', 'privacy',
    ],
    relevanceLabels: {
      high: ['hacked', 'blackmail', 'leak', 'intimate photos', 'cyber', 'doxxing'],
      medium: ['facebook', 'whatsapp', 'social media', 'fake account', 'online harassment'],
    }
  },
  {
    category: 'Traffic & Accidents',
    keywords: [
      'accident', 'car crash', 'motorcycle', 'hit and run', 'driver', 'insurance claim',
      'compensation', 'drunk driving', 'negligence', 'vehicle collision', 'traffic police',
      'knocked down', 'injury', 'hospital', 'third party',
    ],
    relevanceLabels: {
      high: ['hit and run', 'accident', 'car crash', 'insurance claim', 'compensation'],
      medium: ['driver', 'motorcycle', 'vehicle collision', 'traffic police'],
    }
  },
  {
    category: 'Criminal & Fraud',
    keywords: [
      'fraud', 'scam', 'cheating', 'cheated', 'bounced cheque', 'dishonor',
      'dishonoured', 'stolen money', 'theft', 'extortion', 'pyramid scheme',
      'conned', 'deceived', 'stolen', 'robbed', 'financial scam',
    ],
    relevanceLabels: {
      high: ['fraud', 'scam', 'bounced cheque', 'stolen money', 'cheating'],
      medium: ['dishonor', 'theft', 'extortion', 'pyramid scheme'],
    }
  },
  {
    category: 'Right to Information',
    keywords: [
      'rti', 'right to information', 'government office', 'public authority',
      'ministry', 'tender', 'official documents', 'transparency', 'public officer',
      'records', 'appeals',
    ],
    relevanceLabels: {
      high: ['rti', 'right to information', 'public authority', 'tender'],
      medium: ['government office', 'official documents', 'transparency'],
    }
  },
];

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'you', 'not', 'all', 'can', 'any', 'was', 'her', 'him',
  'our', 'out', 'has', 'had', 'have', 'with', 'that', 'this', 'from', 'they', 'will',
  'been', 'were', 'what', 'when', 'where', 'which', 'who', 'why', 'how', 'about',
  'into', 'some', 'than', 'them', 'then', 'there', 'these', 'more', 'also', 'just',
  'like', 'over', 'such', 'take', 'want', 'give', 'only', 'very', 'even',
  'after', 'before', 'being', 'between', 'both', 'could', 'down', 'during', 'each',
  'further', 'here', 'most', 'other', 'same', 'should', 'through', 'under', 'need'
]);

// ─── Score rights entries against a given scenario ───────────────────────────
const scoreRightsForScenario = (scenario, rightsData) => {
  const scenarioLower = scenario.toLowerCase();
  const scenarioWords = scenarioLower
    .split(/[\s,.;:!?()'"/\\]+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));

  const hasWord = (text, word) => {
    if (!text) return false;
    try {
      return new RegExp(`\\b${word}\\b`, 'i').test(text);
    } catch {
      return text.toLowerCase().includes(word);
    }
  };

  return rightsData.map(rawRight => {
    const right = (typeof rawRight.toObject === 'function')
      ? rawRight.toObject()
      : (rawRight._doc ? { ...rawRight._doc } : { ...rawRight });

    let score = 0;
    const matchedCategories = [];
    const matchedKeywords = [];

    // Score via keyword map
    SCENARIO_KEYWORD_MAP.forEach(map => {
      let catScore = 0;
      map.keywords.forEach(kw => {
        if (hasWord(scenarioLower, kw)) {
          catScore += 3;
          matchedKeywords.push(kw);
        }
      });
      if (right.category === map.category && catScore > 0) {
        score += catScore;
        matchedCategories.push({ category: map.category, score: catScore });
      }
    });

    // Score via right's own content and sections
    const titleLower = (right.title || '').toLowerCase();
    const summaryLower = (right.summary || '').toLowerCase();
    scenarioWords.forEach(word => {
      if (hasWord(titleLower, word)) score += 2;
      if (hasWord(summaryLower, word)) score += 1;
    });

    if (Array.isArray(right.sections)) {
      right.sections.forEach(sec => {
        const secHeading = (sec.heading || '').toLowerCase();
        const secDesc = (sec.description || '').toLowerCase();
        const secAct = (sec.actOrArticle || '').toLowerCase();
        scenarioWords.forEach(word => {
          if (hasWord(secHeading, word)) score += 2;
          if (hasWord(secDesc, word)) score += 1;
          if (hasWord(secAct, word)) score += 2;
        });
      });
    }

    // Determine relevance level
    let relevance = null;
    if (score >= 8) relevance = 'High';
    else if (score >= 3) relevance = 'Medium';

    return { ...right, _score: score, _relevance: relevance, _matchedKeywords: [...new Set(matchedKeywords)] };
  })
    .filter(r => r._score > 0)
    .sort((a, b) => b._score - a._score);
};

// ─── Build local analysis summary from scenario ───────────────────────────────
const buildLocalAnalysis = (scenario, matchedRights, ragCitations) => {
  const scenarioLower = scenario.toLowerCase();
  
  let situation = 'General Legal Matter';
  let advice = 'Based on your description, please review the relevant Sri Lankan laws and citizen protections below.';
  let urgency = 'normal';
  let detailedLaws = [];

  // Determine active category: prioritize top scored right if score >= 3, otherwise use regex fallback
  let targetCategory = null;
  if (matchedRights && matchedRights.length > 0 && matchedRights[0]._score >= 3) {
    targetCategory = matchedRights[0].category;
  } else {
    if (/\b(police|arrest(ed)?|detain(ed)?|custody|jail|locked up|interrogat(ed|ion)?|\bwarrant\b)\b/i.test(scenario)) {
      targetCategory = 'Fundamental Rights';
    } else if (/\b(domestic\s+violence|domestic\s+abuse|abusive|assault(ed)?|beat(ing|en)?|slap(ped)?|husband|wife|spouse)\b/i.test(scenario)) {
      targetCategory = 'Family Law';
    } else if (/\b(fired|dismiss(ed|al)?|terminat(ed|ion)?|salary|wages?|unpaid|not paid|employer|boss|labour\s+tribunal|gratuity)\b/i.test(scenario)) {
      targetCategory = 'Employment Law';
    } else if (/\b(landlord|evict(ion|ed)?|\brent(al|ing)?\b|tenant|kicked out|vacate|locked out|lease)\b/i.test(scenario)) {
      targetCategory = 'Tenancy & Property';
    } else if (/\b(consumer|warranty|defective|faulty|repair|refund|replacement|replace|shop|store|trader|overcharg(e|ed|ing)?|\bmrp\b|expired|bad food|seller)\b/i.test(scenario)) {
      targetCategory = 'Consumer Rights';
    } else if (/\b(cyber|hack(ed)?|social media|facebook|instagram|whatsapp|blackmail|intimate|photos?|doxx|fake account|leak(ed)?|online harassment|bullying)\b/i.test(scenario)) {
      targetCategory = 'Cyber & Digital Law';
    } else if (/\b(accident|car crash|motorcycle|hit and run|vehicle|collision|driver|traffic police|insurance claim|knocked down|pedestrian)\b/i.test(scenario)) {
      targetCategory = 'Traffic & Accidents';
    } else if (/\b(scam(med)?|fraud|cheated|cheating|bounced cheque|dishonor(ed)?|dishonoured|stolen money|pyramid scheme|deceived|conned|extort(ion)?)\b/i.test(scenario)) {
      targetCategory = 'Criminal & Fraud';
    } else if (/\b(rti|right to information|public authority|government department|ministry|official record|tender|information officer|public records)\b/i.test(scenario)) {
      targetCategory = 'Right to Information';
    }
  }

  if (targetCategory === 'Fundamental Rights') {
    situation = 'Police Arrest & Detention Safeguards';
    advice = 'You have strong constitutional protections under Article 13. You must be informed of the reason for arrest immediately and produced before a Magistrate within 24 hours.';
    urgency = 'high';
    detailedLaws = [
      {
        act: 'Constitution of the Democratic Socialist Republic of Sri Lanka (1978)',
        section: 'Article 13(1) & Article 13(2)',
        citizenRight: 'Right to Reason for Arrest & 24-Hour Court Production',
        howItApplies: 'Sri Lankan constitutional law strictly prohibits arbitrary arrest. The arresting officer is legally required to communicate the exact reason/statute under which you are held. You cannot be detained in police custody past 24 hours without being brought before a judicial Magistrate.',
        legalRemedy: 'Demand immediate access to an Attorney-at-Law under Article 13(3). If held without reasons or beyond 24 hours, your counsel can move the Magistrate for discharge/bail, or file a Fundamental Rights (FR) petition directly in the Supreme Court within 30 days under Article 126 for unlawful deprivation of liberty.',
        keyPoints: [
          'Mandatory production before the nearest Magistrate within 24 hours',
          'Arrest without being informed of the reason is unconstitutional and actionable',
          'Immediate right to legal representation during detention and statement recording',
          'Presumption of innocence until proven guilty by a competent court of law'
        ]
      },
      {
        act: 'Constitution of Sri Lanka (1978)',
        section: 'Article 11',
        citizenRight: 'Absolute Freedom from Torture & Cruel Treatment',
        howItApplies: 'Under Sri Lankan law, the prohibition against torture, assault, or degrading treatment in custody is absolute and non-derogable, even under a state of emergency.',
        legalRemedy: 'Demand immediate examination by a Judicial Medical Officer (JMO) at the state hospital. The JMO report is binding forensic evidence in Supreme Court FR litigation and criminal indictment of offending officers.',
        keyPoints: [
          'Zero legal exceptions: applies to all interrogations and custody',
          'Right to request immediate examination by an independent Judicial Medical Officer (JMO)',
          'Victims can recover financial damages against the State and police officers'
        ]
      },
      {
        act: 'Code of Criminal Procedure Act No. 15 of 1979',
        section: 'Section 115 & Bail Provisions',
        citizenRight: 'Statutory Right to Apply for Bail & Fair Police Protocol',
        howItApplies: 'Governs police procedure upon arrest, search protocols, and remand limits. Detainees have the right to have a relative or friend informed of their arrest location.',
        legalRemedy: 'Instruct an attorney to submit an immediate Bail Application at the first court production.',
        keyPoints: [
          'Police must record entry in the Information Book (IB) with time and reason',
          'Female suspects must be searched strictly by female officers',
          'Magistrate retains power to grant bail for all non-capital offences'
        ]
      }
    ];
  } else if (targetCategory === 'Family Law') {
    situation = 'Domestic Violence & Personal Protection';
    advice = 'You can apply for an Interim Protection Order from the nearest Magistrate Court immediately under the Domestic Violence Act No. 34 of 2005. Contact the police or a Women & Children\'s Bureau.';
    urgency = 'high';
    detailedLaws = [
      {
        act: 'Prevention of Domestic Violence Act No. 34 of 2005',
        section: 'Section 5 & 10 — Protection Orders',
        citizenRight: 'Urgent Magistrate Protection Order (IPO) Barring Abuser',
        howItApplies: 'Protects spouses, cohabitants, children, and family members against physical, emotional, or economic abuse. The Magistrate can issue an ex-parte order on the same day excluding the respondent from the residence.',
        legalRemedy: 'File an urgent application before the nearest Magistrate Court (can be filed by victim, police, or qualified social worker). The court issues an Interim Protection Order (IPO) prohibiting the abuser from entering the residence or contacting the victim.',
        keyPoints: [
          'Magistrate can grant an Interim Protection Order (IPO) on an urgent same-day basis',
          'Court can bar respondent from shared home, place of employment, or contacting victim',
          'Breach of a Protection Order is a cognizable criminal offence with immediate arrest'
        ]
      },
      {
        act: 'Penal Code of Sri Lanka (Cap. 19)',
        section: 'Section 314 & Section 345 — Causing Hurt & Criminal Force',
        citizenRight: 'Criminal Redress for Assault and Physical Harm',
        howItApplies: 'Any physical violence, battering, or sexual harassment is a cognizable criminal offence under the Penal Code, regardless of marital or domestic relationship.',
        legalRemedy: 'Lodge a formal complaint at the nearest Police Station or Children & Women\'s Bureau. Demand hospital admission and examination by the Judicial Medical Officer (JMO) for legal documentation.',
        keyPoints: [
          'Police have a statutory duty to record complaint and refer victim for medical care',
          'Criminal prosecution runs parallel to civil protection orders',
          'Offenders face imprisonment and court-mandated criminal penalties'
        ]
      }
    ];
  } else if (targetCategory === 'Employment Law') {
    situation = 'Employment Rights & Wrongful Dismissal Redress';
    advice = 'Your rights are protected under the Shop & Office Employees Act and Industrial Disputes Act. You can file a complaint with the Department of Labour or seek redress at the Labour Tribunal.';
    urgency = 'medium';
    detailedLaws = [
      {
        act: 'Industrial Disputes Act No. 43 of 1950',
        section: 'Section 31B — Redress for Wrongful / Unjust Termination',
        citizenRight: 'Right Against Unfair Dismissal & Right to Reinstatement or Compensation',
        howItApplies: 'Sri Lankan labor law mandates that an employer cannot arbitrarily terminate a workman without justifiable misconduct, formal domestic inquiry, or official written approval from the Commissioner of Labour.',
        legalRemedy: 'File an application before the nearest Labour Tribunal within 3 calendar months of termination. The President of the Labour Tribunal has equitable authority under Section 31C to award either reinstatement with full back-wages or substantial monetary compensation.',
        keyPoints: [
          'Strict 3-month statutory limitation period from date of dismissal to file application',
          'Burden of proof rests on the employer to substantiate just cause',
          'Tribunal has authority to award reinstatement with full back-pay or severance pay',
          'Representation by trade union representative or Attorney-at-Law allowed'
        ]
      },
      {
        act: 'Shop and Office Employees Act No. 19 of 1954',
        section: 'Notice Period, Salary Timelines & Leave Entitlements',
        citizenRight: 'Statutory Notice Pay, Overtime Settlement & Timely Wage Payment',
        howItApplies: 'Governs terms of employment for office and shop staff. Requires employers to give 1 month written notice of termination (or salary in lieu) and prohibits withholding earned salaries past 10 days of wage period.',
        legalRemedy: 'Lodge a complaint with the Enforcement Division of the Department of Labour (Labour Secretariat, Colombo 05 or regional branch). Labour Officers have statutory authority to inspect employer accounts and recover unpaid dues.',
        keyPoints: [
          'Termination requires written notice or equivalent salary paid in lieu of notice',
          'Unpaid salary, 1.5x overtime wages, and accrued leave must be fully settled',
          'Department of Labour can prosecute defaulting employers in Magistrate Court'
        ]
      },
      {
        act: 'Payment of Gratuity Act No. 12 of 1983',
        section: 'Section 5 & 6 — Mandatory Gratuity Entitlement',
        citizenRight: 'Statutory Gratuity Settlement for 5+ Years Service',
        howItApplies: 'Any employee with 5 or more completed continuous years of service in an enterprise with 15 or more employees is entitled to statutory gratuity upon cessation of employment, resignation, or termination.',
        legalRemedy: 'Gratuity must be paid within 30 days of termination. If delayed, statutory compound surcharges of 10% to 30% apply by law, recoverable through the Commissioner of Labour.',
        keyPoints: [
          'Entitled to half a month\'s last-drawn basic salary for each completed year of service',
          'Mandatory 30-day settlement window following the final working day',
          'Employer cannot forfeit gratuity except for proven financial loss caused to employer'
        ]
      }
    ];
  } else if (targetCategory === 'Tenancy & Property') {
    situation = 'Tenancy Rights & Eviction Safeguards';
    advice = 'Under the Rent Act, a landlord cannot evict you without a formal court order from the District Court. Forceful lockouts are illegal. You may file a Fundamental Rights petition or obtain a court injunction.';
    urgency = 'medium';
    detailedLaws = [
      {
        act: 'Rent Act No. 7 of 1972 & Recovery of Possession of Premises Act',
        section: 'Ejectment Procedures & Protection Against Self-Help Evictions',
        citizenRight: 'Absolute Protection from Forceful Lockout & Summary Eviction',
        howItApplies: 'In Sri Lanka, a landlord cannot unilaterally force a tenant out, throw out furniture, cut water/power supplies, or change door locks. Eviction is ONLY lawful through a decree of ejectment granted by a District Court.',
        legalRemedy: 'If the landlord attempts forceful eviction or disconnects utilities, lodge an immediate police complaint for criminal intimidation, wrongful restraint (Penal Code §332), and breach of peace. File an application in District Court for an enjoining order restraining unlawful interference.',
        keyPoints: [
          'Landlord must serve formal statutory notice to quit (usually 3 to 12 months)',
          'Cutting off water, power, or changing locks is strictly illegal and actionable',
          'Only a fiscal officer executing a District Court decree can legally enforce eviction'
        ]
      },
      {
        act: 'Rent Board of Sri Lanka / Civil Law',
        section: 'Standard Rent Limits & Security Deposit Regulations',
        citizenRight: 'Protection Against Arbitrary Rent Increases & Unlawful Deposit Retention',
        howItApplies: 'Protects tenants from unreasonable rent hikes. Landlords cannot arbitrarily withhold security deposits without verified itemized proof of structural damage.',
        legalRemedy: 'File an application before the local Rent Board for assessment of authorized rent or initiate recovery of security deposits in the Primary / District Court.',
        keyPoints: [
          'Rent increases must comply with statutory rental assessments',
          'Advance rent deposits must be refunded or offset upon termination of tenancy',
          'Local Rent Board has statutory jurisdiction to resolve disputes on fair rent'
        ]
      }
    ];
  } else if (targetCategory === 'Consumer Rights') {
    situation = 'Consumer Rights & Defective Goods Protection';
    advice = 'Under the Consumer Affairs Authority Act No. 9 of 2003, traders are prohibited from selling substandard or expired goods. You have the right to a refund, repair, or replacement, and can lodge an official complaint via hotline 1977.';
    urgency = 'medium';
    detailedLaws = [
      {
        act: 'Consumer Affairs Authority Act No. 9 of 2003',
        section: 'Section 13 & 32 — Warranties, Defective Goods & Redress',
        citizenRight: 'Right to Refund, Repair or Product Replacement',
        howItApplies: 'Sri Lankan consumer law mandates that products sold must conform to quality standards and warranty representations. If an item fails or is defective, the trader cannot refuse replacement or legitimate warranty service.',
        legalRemedy: 'Submit a formal written complaint with purchase receipts to the Consumer Affairs Authority (CAA) within 30 days. The CAA has statutory powers to summon traders, inspect goods, and order mandatory refunds or replacements.',
        keyPoints: [
          'Mandatory trader compliance with expressed or implied product warranties',
          'Strict prohibition against selling expired, altered, or substandard items',
          'CAA can institute criminal prosecution against non-compliant traders in Magistrate Court'
        ]
      },
      {
        act: 'Consumer Affairs Authority Act No. 9 of 2003',
        section: 'Section 31 — Maximum Retail Price & Anti-Deceptive Trade',
        citizenRight: 'Protection Against Overcharging Above MRP and Misleading Pricing',
        howItApplies: 'Traders are legally barred from selling goods above the labeled Maximum Retail Price (MRP) or engaging in deceptive pricing or false promotional discounts.',
        legalRemedy: 'Report the vendor directly to the CAA Special Enforcement Flying Squad or call the 1977 national consumer helpline with invoice evidence.',
        keyPoints: [
          'Selling above the marked MRP is a cognizable regulatory offence',
          'Traders must display clear pricing and provide valid cash receipts',
          'CAA conducts unannounced market raids and imposes statutory fines'
        ]
      }
    ];
  } else if (targetCategory === 'Cyber & Digital Law') {
    situation = 'Cyber Crime & Online Harassment Safeguards';
    advice = 'Unauthorized account access, extortion, and non-consensual sharing of private photos or chats are serious criminal offences under the Computer Crimes Act No. 24 of 2007 and Penal Code §345. Report immediately to Sri Lanka CERT (101) and CID Cyber Crime Division.';
    urgency = 'high';
    detailedLaws = [
      {
        act: 'Computer Crimes Act No. 24 of 2007',
        section: 'Section 3, 4 & 6 — Unauthorized Access & Cyber Harm',
        citizenRight: 'Criminal Redress for Account Hacking & Unauthorized Data Interception',
        howItApplies: 'Accessing, modifying, or securing data from an email, smartphone, or social media account without the owner\'s consent is a criminal offence punishable by substantial fines and imprisonment up to 5 years.',
        legalRemedy: 'Lodge an official report with Sri Lanka CERT (Hotline 101) for incident response and the Criminal Investigation Department (CID) Cyber Crime Division. Police can issue forensic preservation orders to service providers.',
        keyPoints: [
          'Criminal liability applies to all unauthorized logins and account takeovers',
          'Police have legal authority to trace IP addresses and examine digital devices',
          'Digital evidence is admissible in court under the Electronic Transactions Act'
        ]
      },
      {
        act: 'Penal Code of Sri Lanka (Cap. 19)',
        section: 'Section 345 & 372 — Sexual Harassment, Blackmail & Extortion',
        citizenRight: 'Protection from Online Intimidation, Image-Based Abuse & Blackmail',
        howItApplies: 'Blackmailing a person using private photographs, videos, or messages, or threatening to publish intimate content constitutes criminal extortion and aggravated sexual harassment.',
        legalRemedy: 'File an immediate complaint at the nearest Police Station or the CID Children & Women Bureau. A Magistrate can issue an arrest warrant and order urgent takedown/seizure of the perpetrator\'s electronic devices.',
        keyPoints: [
          'Offences carry mandatory imprisonment and punitive civil damages',
          'Emergency takedown requests can be routed to social media platforms via CERT/CID',
          'Preserve all chat logs, screenshots, and transaction records as evidence'
        ]
      }
    ];
  } else if (targetCategory === 'Traffic & Accidents') {
    situation = 'Road Traffic Accident Liability & Insurance Claims';
    advice = 'Under the Motor Traffic Act, every vehicle must carry third-party risk insurance. Drivers must stop, assist, and notify police within 24 hours. You have the right to claim compensation for injuries, hospital bills, and property damage.';
    urgency = 'high';
    detailedLaws = [
      {
        act: 'Motor Traffic Act (Cap. 203)',
        section: 'Section 99 & 160 — Mandatory Third-Party Risk Insurance & Accident Protocol',
        citizenRight: 'Right to Hospital Expenses & Third-Party Insurance Compensation',
        howItApplies: 'Sri Lankan law requires all registered vehicles to carry valid third-party insurance. When an accident occurs causing bodily injury or property damage, the insurer is legally bound to satisfy court decrees obtained against the negligent driver.',
        legalRemedy: 'Ensure police record a formal Motor Traffic B-Report. Demand examination by the Judicial Medical Officer (JMO) for Medico-Legal Reports (MLR). Notify the driver\'s insurance company in writing within the statutory notice window.',
        keyPoints: [
          'Mandatory reporting of traffic collisions to nearest police station within 24 hours',
          'Third-party insurer cannot repudiate liability for victim bodily injuries',
          'Medico-Legal Report (MLR) from state hospital is essential legal proof'
        ]
      },
      {
        act: 'Civil Law of Sri Lanka (Delict / Law of Negligence)',
        section: 'Action for Damages & Hit-and-Run Relief',
        citizenRight: 'Civil Action for Economic Loss, Vehicle Repair & General Damages',
        howItApplies: 'Victims of negligent or reckless driving have a common law right to recover full compensation for vehicle damage, loss of earnings, pain and suffering, and permanent disability through the District Court.',
        legalRemedy: 'File a civil plaint for delictual damages in the District Court within the 2-year statutory limitation period. If the driver is untraceable in a hit-and-run, apply to the Ministry of Transport Compensation Fund.',
        keyPoints: [
          '2-year statutory prescription period from the date of the accident to file suit',
          'Damages encompass both special damages (hospital/repair bills) and general damages',
          'Special government relief fund available for untraceable hit-and-run incidents'
        ]
      }
    ];
  } else if (targetCategory === 'Criminal & Fraud') {
    situation = 'Financial Fraud, Cheating & Debt Recovery';
    advice = 'Dishonest deception and misappropriation of money are criminal offences under Penal Code Sections 398 and 403. Dishonored cheques give right to expedited summary civil recovery under Debt Recovery Act No. 2 of 1990 and criminal police investigation.';
    urgency = 'medium';
    detailedLaws = [
      {
        act: 'Penal Code of Sri Lanka (Cap. 19)',
        section: 'Section 398 & 403 — Cheating & Dishonest Inducement',
        citizenRight: 'Criminal Redress for Deception, Financial Scams & Stolen Funds',
        howItApplies: 'Whoever deceives any person, fraudulently or dishonestly inducing them to deliver money or property, commits the offence of cheating punishable by up to 7 years rigorous imprisonment.',
        legalRemedy: 'Lodge a formal written complaint with the Police Special Crimes Division or the CID Commercial Crimes Bureau. Police can obtain judicial orders to trace banking transactions and freeze recipient accounts.',
        keyPoints: [
          'Preserve all bank deposit slips, wire receipts, and messaging correspondence',
          'Police can freeze fraudulent bank accounts through Magistrate Court orders',
          'Criminal proceedings do not bar parallel civil recovery of monies'
        ]
      },
      {
        act: 'Debt Recovery (Special Provisions) Act No. 2 of 1990',
        section: 'Summary Procedure for Liquidated Debts & Dishonored Cheques',
        citizenRight: 'Expedited Court Decree for Bounced Cheques and Unpaid Debts',
        howItApplies: 'Provides a fast-track summary court procedure in the District Court for recovering funds due on dishonored cheques, promissory notes, or written debt agreements without full trial delays.',
        legalRemedy: 'Serve a formal Letter of Demand through an Attorney-at-Law by registered post giving 14 days notice. If unpaid, file an action under Debt Recovery Act to obtain a Decree Nisi against the debtor.',
        keyPoints: [
          'Expedited summary procedure significantly faster than ordinary civil litigation',
          'Court can order sequestration of debtor assets before final judgment',
          'Banking return memo stamped "Payment Stopped" or "Refer to Drawer" is primary evidence'
        ]
      }
    ];
  } else if (targetCategory === 'Right to Information') {
    situation = 'Right to Information & Public Accountability';
    advice = 'Under the Right to Information Act No. 12 of 2016, public authorities are statutorily required to provide requested official records within 14 to 21 working days. If refused, you can appeal directly to the RTI Commission.';
    urgency = 'normal';
    detailedLaws = [
      {
        act: 'Right to Information Act No. 12 of 2016',
        section: 'Section 3 & 24 — Citizen Access to Public Information',
        citizenRight: 'Enforceable Right to Access Government Records & Procurement Data',
        howItApplies: 'Every citizen has the legal right to request information, budgets, project reports, and decision files from any Ministry, Department, Provincial Council, or Local Authority.',
        legalRemedy: 'Submit an RTI 01 application form to the designated Information Officer of the public authority. The officer is legally mandated to decide within 14 working days.',
        keyPoints: [
          'Mandatory 14-day statutory timeline for response from the Information Officer',
          'Fees are limited strictly to nominal gazetted copying costs',
          'Information can only be withheld under narrow national security exceptions'
        ]
      },
      {
        act: 'Right to Information Act No. 12 of 2016',
        section: 'Section 31 & 32 — Right of Appeal to RTI Commission',
        citizenRight: 'Binding Administrative Appeal Against Withheld Information',
        howItApplies: 'If an RTI request is denied, ignored, or excessive fees are demanded, citizens have the statutory right to appeal first to the Designated Officer and then to the independent RTI Commission.',
        legalRemedy: 'File an appeal (RTI 10 form) to the Designated Officer within 14 days, and subsequently an appeal (RTI 11 form) to the RTI Commission of Sri Lanka. The Commission\'s orders are binding and enforceable like court orders.',
        keyPoints: [
          'Independent RTI Commission has powers to examine confidential state files',
          'Non-compliance with RTI Commission orders is a criminal offence',
          'Citizens can represent themselves without needing an attorney'
        ]
      }
    ];
  }

  // Fallback for general scenarios: map from ragCitations or dynamic contextual analysis
  if (detailedLaws.length === 0 && ragCitations.length > 0) {
    situation = ragCitations[0].title || 'Statutory Legal Protection & Rights';
    advice = `Based on your description, this matter is governed by Sri Lankan statutory law under the ${ragCitations[0].act}. You have legal protections and actionable recourse under Sri Lankan law.`;
    urgency = /threat|court|police|danger|injur|emergency/i.test(scenario) ? 'high' : 'normal';
    detailedLaws = ragCitations.slice(0, 3).map(c => ({
      act: c.act,
      section: c.section,
      citizenRight: c.title,
      howItApplies: `Under Sri Lankan statutory jurisprudence: ${c.content}`,
      legalRemedy: `Consult the Legal Aid Commission (Hotline 1970) or a qualified Attorney-at-Law to file for relief or initiate statutory proceedings under ${c.act}.`,
      keyPoints: [
        'Statutory legal protection under Sri Lankan law',
        'Official administrative and court remedies available',
        'Free legal advice accessible via Legal Aid Commission'
      ]
    }));
  } else if (detailedLaws.length === 0) {
    situation = 'Civil & Citizen Legal Protections';
    advice = 'Sri Lankan law provides institutional mechanisms, court remedies, and citizen protections for this matter. You can seek free guidance from the Legal Aid Commission or consult an Attorney-at-Law.';
  }

  const hotlines = urgency === 'high'
    ? [
        { name: 'Police Emergency', number: '119' },
        { name: 'Legal Aid Commission', number: '1970' },
        { name: 'Human Rights Commission (HRCSL)', number: '1996' },
      ]
    : [
        { name: 'Legal Aid Commission', number: '1970' },
        { name: 'Consumer Affairs Authority', number: '1977' },
        { name: 'Dept. of Labour Helpline', number: '1912' },
        { name: 'Sri Lanka CERT Cyber Desk', number: '101' },
      ];

  return {
    situation,
    advice,
    urgency,
    hotlines,
    detailedLaws,
    matchedLaws: ragCitations.map(c => ({ actName: c.act, section: c.section, summary: c.title })),
  };
};

// ─── GET /api/rights — Fetch all rights with optional filter ─────────────────
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;

    let items = [];
    if (getDBStatus()) {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      items = await Rights.find(query).lean();
    }
    if (!items || items.length === 0) {
      items = initialRightsData;
      if (category && category !== 'All') {
        items = items.filter(r => r.category === category);
      }
    } else {
      // Ensure all 9 categories from initialRightsData are represented if DB has fewer
      const existingCategories = new Set(items.map(r => r.category));
      const missingRights = initialRightsData.filter(r => {
        if (category && category !== 'All' && r.category !== category) return false;
        return !existingCategories.has(r.category);
      });
      items = [...items, ...missingRights];
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

// ─── POST /api/rights/scenario — Analyze a real-world scenario ───────────────
router.post('/scenario', async (req, res) => {
  try {
    const { scenario, language = 'en' } = req.body;

    if (!scenario || scenario.trim().length < 5) {
      return res.status(400).json({ message: 'Please provide a scenario description (minimum 5 characters).' });
    }

    // Fetch all rights data
    let allRights = [];
    if (getDBStatus()) {
      allRights = await Rights.find({}).lean();
    }
    if (!allRights || allRights.length === 0) {
      allRights = initialRightsData;
    } else {
      const existingCategories = new Set(allRights.map(r => r.category));
      const missingRights = initialRightsData.filter(r => !existingCategories.has(r.category));
      allRights = [...allRights, ...missingRights];
    }

    // Score rights against the scenario using keyword engine
    const scoredRights = scoreRightsForScenario(scenario, allRights);

    // Get RAG citations for the scenario
    const ragCitations = searchLegalContext(scenario, 5);

    // Build local analysis summary
    const analysis = buildLocalAnalysis(scenario, scoredRights, ragCitations);

    // Try Gemini AI for an enhanced natural-language analysis
    let aiAnalysis = null;
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      try {
        const ai = new GoogleGenerativeAI(apiKey);
        const langMap = {
          en: 'English',
          si: 'Sinhala (සිංහල)',
          ta: 'Tamil (தமிழ்)',
        };
        const langLabel = langMap[language] || 'English';

        const ragContext = ragCitations.length > 0
          ? `RELEVANT SRI LANKAN STATUTES:\n` + ragCitations.map(c => `- ${c.act} (${c.section}): ${c.content}`).join('\n')
          : '';

        const prompt = `You are LegalAI Sri Lanka. A citizen described this situation: "${scenario}"

${ragContext}

Task: Analyze this real-world scenario and identify the relevant Sri Lankan laws, citizen rights, and actionable legal remedies in ${langLabel}.
Return a JSON object with these exact fields:
{
  "situation": "<short title for this legal situation, max 6 words>",
  "advice": "<1-2 sentence plain-language actionable advice based strictly on Sri Lankan law>",
  "immediateSteps": ["<step 1>", "<step 2>", "<step 3>"],
  "hotlines": [{"name": "<name>", "number": "<number>"}],
  "detailedLaws": [
    {
      "act": "<Full name of the Sri Lankan Act or Constitution Article>",
      "section": "<Section or Article number & legal heading>",
      "citizenRight": "<Exact citizen right guaranteed by this law in plain language>",
      "howItApplies": "<Clear, detailed explanation of how this statutory protection applies to this specific situation>",
      "legalRemedy": "<Actionable legal remedy, competent forum (e.g. Labour Tribunal, Magistrate Court, Supreme Court), and filing deadlines>",
      "keyPoints": ["<key takeaway 1>", "<key takeaway 2>", "<key takeaway 3>"]
    }
  ]
}
Respond ONLY with the JSON object, no markdown, no explanation.`;

        const modelNames = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-pro'];
        for (const modelName of modelNames) {
          try {
            const model = ai.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const text = result.response.text().trim();
            // Parse JSON — strip possible markdown fences
            const jsonStr = text.replace(/```json|```/g, '').trim();
            aiAnalysis = JSON.parse(jsonStr);
            break;
          } catch (mErr) {
            console.warn(`[Gemini scenario ${modelName}]:`, mErr.message);
          }
        }
      } catch (aiErr) {
        console.warn('[Gemini scenario AI error]:', aiErr.message);
      }
    }

    const finalAnalysis = aiAnalysis || analysis;
    // Ensure detailedLaws is always populated
    if (!finalAnalysis.detailedLaws || !Array.isArray(finalAnalysis.detailedLaws) || finalAnalysis.detailedLaws.length === 0) {
      finalAnalysis.detailedLaws = analysis.detailedLaws || [];
    }

    res.json({
      scenario,
      analysis: finalAnalysis,
      matchedRights: scoredRights,
      ragCitations: ragCitations.map(c => ({ actName: c.act, section: c.section, summary: c.title })),
    });

  } catch (error) {
    console.error('Scenario analysis error:', error);
    res.status(500).json({ message: 'Error analyzing legal scenario.' });
  }
});

// ─── GET /api/rights/emergency — Police pocket guide ─────────────────────────
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
