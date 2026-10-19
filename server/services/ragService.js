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
  },
  {
    id: 'consumer-protection',
    act: 'Consumer Affairs Authority Act No. 9 of 2003',
    section: 'Section 13 & 32 — Defective Goods, Warranties & Fair Trading',
    title: 'Consumer Rights Against Defective Goods and Unfair Trade',
    content: 'Traders cannot sell defective, substandard, or expired products. If a product fails or breaches warranty terms, consumers have the legal right to a refund, repair, or replacement. Overcharging above Maximum Retail Price (MRP) or misleading representation is an offence punishable under the CAA.',
    keywords: ['consumer', 'shop', 'warranty', 'defective', 'refund', 'replacement', 'overcharge', 'mrp', 'expired', 'trader', 'faulty product', 'goods']
  },
  {
    id: 'cyber-crimes',
    act: 'Computer Crimes Act No. 24 of 2007',
    section: 'Section 3, 4 & 6 — Hacking, Unauthorized Access & Cyber Harassment',
    title: 'Protection Against Cyber Crimes, Hacking & Online Harassment',
    content: 'Unauthorized access to computers, email, or social media accounts is a criminal offence under Section 3. Causing harm, blackmail, or non-consensual sharing of intimate images/messages is prosecutable under Computer Crimes Act and Penal Code §345 through the Police Cyber Crime Division (CID) and Sri Lanka CERT.',
    keywords: ['cyber', 'hack', 'hacked', 'blackmail', 'online harassment', 'social media', 'facebook', 'whatsapp', 'leak', 'intimate photos', 'fake account', 'doxxing']
  },
  {
    id: 'penal-mischief',
    act: 'Penal Code of Sri Lanka (Cap. 19)',
    section: 'Section 408 & 410 — Mischief & Criminal Damage to Property',
    title: 'Criminal Mischief, Property Vandalism & Malicious Damage',
    content: 'Whoever causes destruction of any property or damages it with intent or knowledge of causing wrongful loss to any person commits the criminal offence of Mischief. Smashing vehicle windows, property destruction with weapons (metal bars, clubs, tools), vandalism, or damaging personal premises is punishable with rigorous imprisonment up to 2 years, court fines, and mandatory compensation orders through the Magistrate Court.',
    keywords: ['mischief', 'smash', 'smashes', 'smashed', 'vandalism', 'vandalize', 'property damage', 'damage property', 'metal bar', 'car window', 'broken windows', 'destroy', 'destruction', 'criminal damage', 'weapon']
  },
  {
    id: 'penal-assault-hurt',
    act: 'Penal Code of Sri Lanka (Cap. 19)',
    section: 'Section 311, 316 & 342 — Grievous Hurt, Criminal Force & Assault',
    title: 'Physical Assault, Grievous Hurt & Bodily Injury Offences',
    content: 'Voluntarily causing hurt is an offence under Section 314. Where an assault causes a fracture or dislocation of a bone (including a broken nose or facial bone fracture), it is designated as Grievous Hurt under Section 311 (Clause 6), punishable under Section 316 with up to 7 years rigorous imprisonment and fine. The police must issue a medico-legal form (M.O. 129) referring the victim to a government Judicial Medical Officer (JMO) for an official Medico-Legal Report (MLR). Victims can claim full medical costs, reconstructive surgery, and pain and suffering in the District Court under the law of delict.',
    keywords: ['assault', 'punch', 'punches', 'punched', 'broken nose', 'fracture', 'grievous hurt', 'hurt', 'fight', 'argument', 'violence', 'face', 'facial injury', 'beaten', 'medical treatment', 'jmo']
  },
  {
    id: 'penal-misrepresentation-sale',
    act: 'Penal Code (Section 398 & 403) & Consumer Affairs Authority Act',
    section: 'Section 398 & 403 — Cheating by Misrepresentation & Deceptive Sale of Goods',
    title: 'Fraudulent Misrepresentation, Deceptive Vehicle Sales & Concealed Accident History',
    content: 'A seller who dishonestly induces a buyer to purchase a vehicle by making false representations (such as falsely stating a car was never in an accident when it was previously seriously damaged) commits criminal Cheating under Section 398 of the Penal Code, punishable by up to 7 years imprisonment. Under Section 30 & 31 of the Consumer Affairs Authority Act No. 9 of 2003 and Roman-Dutch law of sale, the buyer has the statutory right to rescind the contract (cancel purchase), return the car, demand a full refund (actio redhibitoria), or sue for damages in the District Court.',
    keywords: ['seller', 'buyer', 'buys', 'sold', 'false statement', 'misrepresentation', 'accident history', 'concealed defect', 'cheating', 'car purchase', 'deceptive sale', 'previously damaged', 'seriously damaged']
  },
  {
    id: 'motor-traffic',
    act: 'Motor Traffic Act (Cap. 203)',
    section: 'Section 99 & 160 — Motor Accidents & Mandatory Third-Party Insurance',
    title: 'Road Traffic Accidents, Hit-and-Run & Motor Insurance Claims',
    content: 'Every motor vehicle must have valid third-party risk insurance. In the event of a traffic collision, drivers must stop, assist victims, and report the accident to the nearest police station within 24 hours. Victims have the legal right to claim compensation for bodily injury, vehicle damage, and loss of income.',
    keywords: ['accident', 'car crash', 'motorcycle', 'hit and run', 'driver', 'insurance claim', 'compensation', 'drunk driving', 'negligence', 'vehicle collision']
  },
  {
    id: 'right-to-information',
    act: 'Right to Information (RTI) Act No. 12 of 2016',
    section: 'Section 3 — Citizen Access to Public Information',
    title: 'Right to Information from Public Authorities',
    content: 'Every citizen has the legal right to request and receive official records, procurement documents, and decisions from government departments and statutory bodies within 14-21 working days. If refused, an appeal can be filed before the Designated Officer and the RTI Commission of Sri Lanka.',
    keywords: ['rti', 'right to information', 'government office', 'public authority', 'ministry', 'tender', 'official documents', 'transparency', 'public officer']
  },
  {
    id: 'companies-act',
    act: 'Companies Act No. 7 of 2007',
    section: 'Section 4, 15 & 51 — Incorporation, Shares & Governance',
    title: 'Company Formation, Share Issuance & Corporate Law',
    content: 'Governs registration of private and public limited companies in Sri Lanka (Form 1, 18, 19). Regulates share capital, rights of shareholders, director fiduciary obligations, annual returns to the Registrar General of Companies (ROC), and foreign investment clearances.',
    keywords: ['company', 'incorporation', 'shares', 'shareholders', 'director', 'private limited', 'business registration', 'investor', 'corporate', 'roc']
  },
  {
    id: 'land-disputes',
    act: 'Partition Act No. 21 of 1977 & Common Law of Property',
    section: 'Encroachment, Boundary Disputes & Declaration of Title',
    title: 'Land Ownership, Encroachments & Boundary Demarcations',
    content: 'Under Sri Lankan civil property law, land owners can file an action in the District Court for Declaration of Title, Ejectment of encroachers, and Injunction against unlawful building or boundary trespass. Partition actions resolve co-ownership disputes.',
    keywords: ['land', 'boundary', 'encroach', 'encroachment', 'boundary wall', 'neighbor', 'property title', 'deed', 'surveyor', 'partition', 'trespass']
  }
];

const RAG_STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'you', 'not', 'all', 'can', 'any', 'was', 'her', 'him',
  'our', 'out', 'has', 'had', 'have', 'with', 'that', 'this', 'from', 'they', 'will',
  'been', 'were', 'what', 'when', 'where', 'which', 'who', 'why', 'how', 'about',
  'into', 'some', 'than', 'them', 'then', 'there', 'these', 'more', 'also', 'just',
  'like', 'over', 'such', 'take', 'want', 'give', 'only', 'very', 'even',
  'after', 'before', 'being', 'between', 'both', 'could', 'down', 'during', 'each',
  'further', 'here', 'most', 'other', 'same', 'should', 'through', 'under', 'need'
]);

export const searchLegalContext = (query, maxResults = 3) => {
  if (!query || typeof query !== 'string') return [];
  
  const queryLower = query.toLowerCase();
  const words = queryLower
    .split(/[\s,.;:!?()'"/\\]+/)
    .filter(w => w && w.length > 2 && !RAG_STOP_WORDS.has(w));

  const hasWordMatch = (text, word) => {
    if (!text || !word) return false;
    try {
      return new RegExp(`\\b${word}\\b`, 'i').test(text);
    } catch {
      return text.includes(word);
    }
  };

  const scored = SRI_LANKAN_LEGAL_KNOWLEDGE.map(item => {
    let score = 0;
    
    // Check keyword matches
    if (Array.isArray(item.keywords)) {
      item.keywords.forEach(kw => {
        if (kw && queryLower.includes(kw.toLowerCase())) score += 4;
      });
    }

    // Check act / section matches
    const actLower = (item.act || '').toLowerCase();
    const sectionLower = (item.section || '').toLowerCase();
    const titleLower = (item.title || item.section || '').toLowerCase();
    const contentLower = (item.content || '').toLowerCase();

    if (actLower && queryLower.includes(actLower)) score += 5;
    if (sectionLower && queryLower.includes(sectionLower)) score += 5;
    
    // Check individual significant words using word boundaries
    words.forEach(word => {
      if (hasWordMatch(contentLower, word)) score += 1;
      if (hasWordMatch(titleLower, word)) score += 2;
    });

    return { ...item, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
};
