import { GoogleGenerativeAI } from '@google/generative-ai';
import { searchLegalContext } from './ragService.js';

let aiInstance = null;

const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenerativeAI(apiKey);
  }
  return aiInstance;
};

export const generateLegalAdvice = async ({ prompt, language = 'en', history = [] }) => {
  // 1. Search relevant Sri Lankan legal statutes via RAG service
  const citations = searchLegalContext(prompt);
  
  const citationContextText = citations.length > 0 
    ? `RELEVANT SRI LANKAN STATUTES & PROVISIONS:\n` + citations.map(c => `- ${c.act} (${c.section}): ${c.content}`).join('\n')
    : 'SRI LANKAN LEGAL CONTEXT: General Sri Lankan legal principles, Sri Lankan Constitution 1978, Penal Code, Civil Procedure Code, Labour Law.';

  const langInstruction = {
    en: 'Respond in English. Format response cleanly with headings, bullet points, citations of Sri Lankan Acts/Articles, practical steps, and a bold legal disclaimer.',
    si: 'Respond in clear, natural Sinhala (සිංහල). Include relevant Sri Lankan legal Act/Article citations and practical citizen guidance. Add legal disclaimer in Sinhala.',
    ta: 'Respond in clear, natural Tamil (தமிழ்). Include relevant Sri Lankan legal Act/Article citations and practical citizen guidance. Add legal disclaimer in Tamil.'
  }[language] || 'Respond in English.';

  const systemPrompt = `You are "LegalAI Sri Lanka", an expert AI legal consultation assistant dedicated to empowering Sri Lankan citizens.
You specialize in Sri Lankan Law, including the 1978 Constitution of Sri Lanka, Penal Code, Industrial Disputes Act, Shop and Office Employees Act, Rent Act, Civil Procedure Code, and Consumer Protection laws.

Instructions:
1. Provide accurate, clear, and empathetic advice based strictly on Sri Lankan Law.
2. ${langInstruction}
3. Break down complex legal jargon into simple, citizen-friendly explanations.
4. Highlight key rights, relevant court procedures, time limits, and official bodies to contact (e.g., Police Station, Legal Aid Commission, Human Rights Commission of Sri Lanka, Department of Labour).
5. Always state clearly that this AI guidance is for informational purposes and does not constitute a formal lawyer-client relationship.

${citationContextText}`;

  const ai = getAIClient();

  if (!ai) {
    // Generate intelligent simulated response when GEMINI_API_KEY is not configured
    return generateFallbackResponse(prompt, language, citations);
  }

  try {
    // Format conversation history for Gemini API
    const contents = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Add final prompt with system context
    contents.push({
      role: 'user',
      parts: [{ text: `${systemPrompt}\n\nUser Question: ${prompt}` }]
    });

    const modelNames = ['gemini-3.5-flash-lite', 'gemini-3.5-flash'];
    let text = null;

    for (const modelName of modelNames) {
      try {
        const model = ai.getGenerativeModel({ model: modelName });
        const response = await model.generateContent({ contents });
        const resultResponse = await response.response;
        text = resultResponse.text();
        if (text) break;
      } catch (mErr) {
        console.warn(`[Gemini Model ${modelName} Warning]:`, mErr.message);
      }
    }
    
    return {
      content: text || generateFallbackResponse(prompt, language, citations).content,
      citations: citations.map(c => ({ actName: c.act, section: c.section, summary: c.title })),
    };
  } catch (err) {
    console.error('[Gemini API Error]', err.message);
    return generateFallbackResponse(prompt, language, citations);
  }
};

const generateFallbackResponse = (prompt, language, citations) => {
  const queryLower = prompt.toLowerCase();
  
  if (language === 'si') {
    return {
      content: `### ශ්‍රී ලංකා නීතිමය උපදෙස් (LegalAI Sri Lanka)

ඔබගේ ප්‍රශ්නය: "${prompt}"

#### 1. අදාළ ශ්‍රී ලංකා නීතිමය පසුබිම:
${citations.length > 0 ? citations.map(c => `* **${c.act} (${c.section})**: ${c.content}`).join('\n') : '* ශ්‍රී ලංකා ආණ්ඩුක්‍රම ව්‍යවස්ථාව සහ අදාළ දණ්ඩ නීති සංග්‍රහයේ විධිවිධාන අනුව ක්‍රියාත්මක වේ.'}

#### 2. පුරවැසියෙකු ලෙස ඔබ ගත යුතු ඊළඟ පියවර:
1. **ලියකියවිලි සුරක්ෂිත කරන්න**: සියලුම ගිවිසුම්, ලැබීම්පත්, සහ අදාළ ලිපි ලේඛන සූදානම් කරගන්න.
2. **අදාළ ආයතනය හමුවන්න**: ළඟම පිහිටි පොලිස් ස්ථානය, නීති ආධාර කොමිෂන් සභාව (Hotline: 1970), හෝ ශ්‍රී ලංකා මානව හිමිකම් කොමිෂන් සභාව අමතන්න.
3. **වෘත්තීය නීතිඥයෙකු හමුවන්න**: මෙම තොරතුරු දැනුවත් කිරීම සඳහා පමණි. 

*වගකීම් ප්‍රකාශය: මෙම තොරතුරු කෘතිම බුද්ධිය (AI) මගින් සපයන ලද්දක් වන අතර මෙය නිල නීතිඥ-සේවාදායක සබඳතාවක් නොවේ.*`,
      citations: citations.map(c => ({ actName: c.act, section: c.section, summary: c.title })),
    };
  }

  if (language === 'ta') {
    return {
      content: `### இலங்கை சட்ட ஆலோசனை (LegalAI Sri Lanka)

உங்கள் கேள்வி: "${prompt}"

#### 1. தொடர்புடைய இலங்கை சட்ட விதிகள்:
${citations.length > 0 ? citations.map(c => `* **${c.act} (${c.section})**: ${c.content}`).join('\n') : '* இலங்கை அரசியலமைப்பு மற்றும் தண்டனைச் சட்ட விதிகளின் கீழ் கையாளப்படுகிறது.'}

#### 2. நீங்கள் எடுக்க வேண்டிய முக்கிய நடவடிக்கைகள்:
1. **ஆவணங்களை சேகரிக்கவும்**: அனைத்து ஒப்பந்தங்கள், ரசீதுகள் மற்றும் கடிதங்களை பாதுகாப்பாக வைக்கவும்.
2. **சம்பந்தப்பட்ட அதிகாரிகளை அணுகவும்**: அருகிலுள்ள பொலிஸ் நிலையம், சட்ட உதவி ஆணைக்குழு (தொலைபேசி: 1970) அல்லது மனித உரிமைகள் ஆணைக்குழுவை தொடர்பு கொள்ளவும்.
3. **சட்டத்தரணியை கலந்தாலோசிக்கவும்**: இது ஒரு தகவல்பூர்வ வழிகாட்டுதல் மட்டுமே.

*பொறுப்புத் துறப்பு: இது AI மூலம் உருவாக்கப்பட்ட சட்டத் தகவல் மட்டுமே, உத்தியோகபூர்வ சட்டத்தரணி ஆலோசனையாகாது.*`,
      citations: citations.map(c => ({ actName: c.act, section: c.section, summary: c.title })),
    };
  }

  // English fallback
  let customSection = '';
  if (queryLower.includes('arrest') || queryLower.includes('police')) {
    customSection = `#### Key Rights Under Article 13 of the Sri Lankan Constitution:
* **Reason for Arrest**: Police must inform you immediately of the precise reason for detention.
* **Right to Legal Counsel**: You have the right to contact and consult an Attorney-at-Law immediately.
* **24-Hour Rule**: You must be produced before the nearest Magistrate within 24 hours of arrest.
* **No Torture (Art. 11)**: Absolute prohibition against physical or mental abuse while in police custody.`;
  } else if (queryLower.includes('work') || queryLower.includes('job') || queryLower.includes('salary') || queryLower.includes('leave')) {
    customSection = `#### Key Protections Under Shop & Office Employees Act / Labor Law:
* **Working Hours**: Standard 8 hours/day (45 hours/week max). Overtime paid at 1.5x hourly rate.
* **Leave Entitlements**: 14 Days Annual Leave + 7 Days Casual Leave per year after completing 1 year of service.
* **Gratuity**: Employees with 5+ years of continuous service are entitled to gratuity payment upon resignation or termination.`;
  } else {
    customSection = `#### Legal Analysis & Framework:
* Based on standard legal procedure in Sri Lanka, statutory laws dictate formal notice procedures, documentation verification, and jurisdiction before filing action in Magistrate or District Court.
* Alternative Dispute Resolution (ADR) or Mediation Boards (Samatha Mandalaya) may be mandatory for claims under prescribed monetary limits.`;
  }

  return {
    content: `### LegalAI Sri Lanka — Advisory Guidance

Thank you for consulting LegalAI Sri Lanka regarding: **"${prompt}"**

${customSection}

#### Relevant Sri Lankan Statutes & Provisions:
${citations.length > 0 ? citations.map(c => `* **${c.act} (${c.section})**: ${c.content}`).join('\n') : '* **Constitution of Sri Lanka (1978)** & Common Law Principles.'}

#### Recommended Action Plan:
1. **Preserve All Evidence**: Keep physical/digital records, receipts, text messages, and written notices.
2. **Access Free Legal Assistance**: If you require state legal aid, contact the **Legal Aid Commission of Sri Lanka** (Hotline: **1970** / 011-2433618) or the **Bar Association of Sri Lanka (BASL)**.
3. **Consult a Registered Attorney-at-Law**: Present your documents for a formal case evaluation.

---
*⚖️ **Legal Disclaimer**: This response is AI-generated for informational guidance only under Sri Lankan law and does not constitute a formal attorney-client contract.*`,
    citations: citations.map(c => ({ actName: c.act, section: c.section, summary: c.title })),
  };
};
