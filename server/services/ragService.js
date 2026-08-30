// RAG (Retrieval-Augmented Generation) Context Service for Sri Lankan Law

export const SRI_LANKAN_LEGAL_KNOWLEDGE = [
  {
    id: 'const-art-10',
    act: 'Constitution of the Democratic Socialist Republic of Sri Lanka (1978)',
    section: 'Article 10',
    title: 'Freedom of Thought, Conscience and Religion',
    content: 'Every person is entitled to freedom of thought, conscience and religion, including the freedom to have or to adopt a religion or belief of his choice.',
    keywords: ['religion', 'thought', 'conscience', 'belief', 'fundamental rights', 'freedom']
  },
  {
    id: 'const-art-11',
    act: 'Constitution of Sri Lanka (1978)',
    section: 'Article 11',
    title: 'Freedom from Torture and Cruel Treatment',
    content: 'No person shall be subjected to torture or to cruel, inhuman or degrading treatment or punishment. Absolute right under the Sri Lankan Constitution.',
    keywords: ['torture', 'cruel', 'police abuse', 'degrading', 'beating', 'custody', 'assault', 'fundamental rights']
  },
  {
    id: 'const-art-12',
    act: 'Constitution of Sri Lanka (1978)',
    section: 'Article 12',
    title: 'Right to Equality & Equal Protection',
    content: 'All persons are equal before the law and are entitled to the equal protection of the law. No citizen shall be discriminated against on grounds of race, religion, language, caste, sex, political opinion, place of birth or any one of such grounds.',
    keywords: ['equality', 'equal protection', 'discrimination', 'gender', 'caste', 'race', 'religion', 'fundamental rights']
  },
  {
    id: 'const-art-13',
    act: 'Constitution of Sri Lanka (1978)',
    section: 'Article 13',
    title: 'Freedom from Arbitrary Arrest and Detention',
    content: '1. No person shall be arrested except according to procedure established by law. Any person arrested shall be informed of the reason for his arrest.\n2. Every person held in custody shall be brought before the judge of the nearest court within reasonable time according to procedure (normally 24 hours under Criminal Procedure Code).\n3. Any person charged with an offence shall be entitled to be heard, in person or by an attorney-at-law, at a fair trial by a competent court.\n4. Every person shall be presumed innocent until proven guilty.',
    keywords: ['arrest', 'detention', 'police', 'custody', 'procedure', 'magistrate', '24 hours', 'bail', 'lawyer', 'attorney', 'fundamental rights']
  },
  {
    id: 'const-art-14',
    act: 'Constitution of Sri Lanka (1978)',
    section: 'Article 14',
    title: 'Freedom of Speech, Assembly, Association and Movement',
    content: 'Every citizen is entitled to freedom of speech and expression including publication, freedom of peaceful assembly, freedom of association, freedom to form and join a trade union, freedom to enjoy culture and language, freedom to engage in any lawful trade or occupation, and freedom of movement.',
    keywords: ['speech', 'expression', 'assembly', 'protest', 'trade union', 'occupation', 'movement', 'fundamental rights']
  },
  {
    id: 'labor-shop-office',
    act: 'Shop and Office Employees Act No. 19 of 1954',
    section: 'Working Hours, Leave & Overtime',
    content: 'Standard working time is limited to 8 hours per day and 45 hours per week. Employees are entitled to 14 days annual leave, 7 days casual leave, and statutory public holidays. Overtime pay is mandated at 1.5x normal rate.',
    keywords: ['working hours', 'overtime', 'leave', 'casual leave', 'annual leave', 'salaries', 'shop and office', 'employment', 'resignation']
  },
  {
    id: 'labor-gratuity',
    act: 'Payment of Gratuity Act No. 12 of 1983',
    section: 'Gratuity Entitlement',
    content: 'An employee with 5 or more years of continuous service in an establishment with 15 or more workmen is entitled to gratuity payment upon termination, resignation, or retirement equal to half a month salary per completed year of service.',
    keywords: ['gratuity', 'resignation bonus', '5 years', 'termination pay', 'retirement', 'severance']
  },
  {
    id: 'rent-act',
    act: 'Rent Act No. 7 of 1972 & Recovery of Possession Act',
    section: 'Tenant Protection & Eviction Procedures',
    content: 'Landlords cannot arbitrarily evict tenants or raise rent beyond authorized limits without proper statutory notice (usually 3 to 12 months depending on tenancy type) and a court decree issued by a District Court.',
    keywords: ['rent', 'tenant', 'landlord', 'eviction', 'lease', 'advance payment', 'deposit', 'property', 'notice']
  },
  {
    id: 'penal-cheating',
    act: 'Penal Code of Sri Lanka (Cap. 19)',
    section: 'Section 398 & 403 - Cheating & Dishonesty',
    content: 'Whoever deceives any person, fraudulently or dishonestly inducing them to deliver property or money, commits cheating. Punishable with imprisonment up to 7 years and fines.',
    keywords: ['cheating', 'fraud', 'financial scam', 'deception', 'stolen money', 'police complaint']
  },
  {
    id: 'domestic-violence',
    act: 'Prevention of Domestic Violence Act No. 34 of 2005',
    section: 'Protection Orders',
    content: 'Victims of physical, emotional, sexual, or financial abuse by a spouse, ex-spouse, cohabiting partner, or relative can apply to the Magistrate Court for an immediate Protection Order excluding the respondent from the residence or prohibiting contact.',
    keywords: ['domestic violence', 'abuse', 'protection order', 'magistrate court', 'spouse abuse', 'family law', 'women rights']
  },
  {
    id: 'debt-recovery',
    act: 'Debt Recovery (Special Provisions) Act No. 2 of 1990',
    section: 'Summary Procedure for Debt Recovery',
    content: 'Creditors and financial institutions can initiate summary court proceedings for liquidated financial debts (promissory notes, bounced cheques, loans) obtaining a decree nisi requiring defendant to show cause within a strict timeframe.',
    keywords: ['debt', 'cheque bounce', 'promissory note', 'money recovery', 'loan defaulter', 'court case']
  }
];

export const searchLegalContext = (query, maxResults = 3) => {
  if (!query || typeof query !== 'string') return [];
  
  const queryLower = query.toLowerCase();
  const words = queryLower.split(/\s+/).filter(w => w && w.length > 2);

  const scored = SRI_LANKAN_LEGAL_KNOWLEDGE.map(item => {
    let score = 0;
    
    // Check keyword matches
    if (Array.isArray(item.keywords)) {
      item.keywords.forEach(kw => {
        if (kw && queryLower.includes(kw.toLowerCase())) score += 3;
      });
    }

    // Check act / section matches
    const actLower = (item.act || '').toLowerCase();
    const sectionLower = (item.section || '').toLowerCase();
    const titleLower = (item.title || item.section || '').toLowerCase();
    const contentLower = (item.content || '').toLowerCase();

    if (actLower && queryLower.includes(actLower)) score += 5;
    if (sectionLower && queryLower.includes(sectionLower)) score += 5;
    
    // Check individual words in content and title
    words.forEach(word => {
      if (word && contentLower.includes(word)) score += 1;
      if (word && titleLower.includes(word)) score += 2;
    });

    return { ...item, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
};
