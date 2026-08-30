import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    appName: 'LegalAI Sri Lanka',
    tagline: 'Empowering Citizens with Smart Legal AI Consultation',
    navHome: 'Home',
    navChat: 'AI Legal Chat',
    navRights: 'Rights & Laws',
    navDocs: 'Doc Generator',
    navLawyers: 'Lawyer Directory',
    navEmergency: 'Police Rights (Emergency)',
    login: 'Login / Register',
    logout: 'Logout',
    guestUser: 'Guest Citizen',
    heroTitle: 'Democratizing Legal Advice for Every Sri Lankan Citizen',
    heroSubtitle: 'Instant, reliable legal consultation in Sinhala, Tamil, and English based on Sri Lankan Constitutional & Statutory Law.',
    startChat: 'Ask Legal AI Now',
    exploreRights: 'Know Your Rights',
    generateDoc: 'Generate Legal Document',
    findLawyer: 'Find Lawyers & Legal Aid',
    emergencyHotline: 'Emergency Police Helpline: 119 | Legal Aid: 1970 | HRCSL: 1996',
    disclaimerTitle: 'Informational Legal Disclaimer',
    disclaimerText: 'LegalAI Sri Lanka provides legal information and educational guidance based on Sri Lankan laws. It does not constitute formal legal representation or create an attorney-client relationship.',
    chatPlaceholder: 'Ask any legal question (e.g. What are my rights if arrested by police? / How to notice tenant?)...',
    uploadDoc: 'Upload Document / Image (OCR)',
    send: 'Send',
    citatedLaws: 'Cited Sri Lankan Laws:',
    copyText: 'Copy Advice',
    copiedText: 'Copied!',
    readAloud: 'Read Aloud',
    stopAudio: 'Stop Audio',
    selectLanguage: 'Language / භාෂාව / மொழி',
  },
  si: {
    appName: 'LegalAI ශ්‍රී ලංකා',
    tagline: 'ශ්‍රී ලාංකික පුරවැසියන් උදෙසා බුද්ධිමත් නීතිමය උපදෙස්',
    navHome: 'මුල් පිටුව',
    navChat: 'AI නීති සංවාදය',
    navRights: 'අයිතිවාසිකම් සහ නීති',
    navDocs: 'ලේඛන සැකසුම්',
    navLawyers: 'නීතිඥ පියස',
    navEmergency: 'පොලිස් අයිතිවාසිකම් (හදිසි)',
    login: 'ඇතුල් වන්න / ලියාපදිංචි වන්න',
    logout: 'නික්මෙන්න',
    guestUser: 'අමුත්තෙකු ලෙස',
    heroTitle: 'සෑම ශ්‍රී ලාංකිකයෙකුටම පහසු නීතිමය උපදෙස්',
    heroSubtitle: 'ශ්‍රී ලංකා ආණ්ඩුක්‍රම ව්‍යවස්ථාව සහ පනත් මත පදනම්ව සිංහල, දෙමළ සහ ඉංග්‍රීසි භාෂාවලින් ක්ෂණික නීති උපදෙස් ලබාගන්න.',
    startChat: 'AI නීති උපදෙස් ලබාගන්න',
    exploreRights: 'ඔබේ අයිතිවාසිකම් හඳුනාගන්න',
    generateDoc: 'නීතිමය ලේඛනයක් සකසන්න',
    findLawyer: 'නීතිඥයින් සහ නීති ආධාර සොයන්න',
    emergencyHotline: 'හදිසි පොලිස් සේවය: 119 | නීති ආධාර: 1970 | මානව හිමිකම්: 1996',
    disclaimerTitle: 'නීතිමය වගකීම් ප්‍රකාශය',
    disclaimerText: 'මෙම පද්ධතිය මගින් ශ්‍රී ලංකා නීතිය පිළිබඳ දැනුවත් කිරීමේ තොරතුරු සපයන අතර, මෙය නිල නීතිඥ-සේවාදායක සබඳතාවක් නොවේ.',
    chatPlaceholder: 'ඔබේ නීතිමය ප්‍රශ්නය විමසන්න (උදා: පොලිසියෙන් ප්‍රශ්න කළහොත් අයිතිවාසිකම් මොනවාද?)...',
    uploadDoc: 'ලේඛනයක් / ඡායාරූපයක් එක් කරන්න (OCR)',
    send: 'යවන්න',
    citatedLaws: 'අදාළ ශ්‍රී ලංකා නීති වගන්ති:',
    copyText: 'පිටපත් කරන්න',
    copiedText: 'පිටපත් විය!',
    readAloud: 'ශ්‍රවණය කරන්න',
    stopAudio: 'නවත්වාගන්න',
    selectLanguage: 'භාෂාව / Language / மொழி',
  },
  ta: {
    appName: 'LegalAI இலங்கை',
    tagline: 'இலங்கை குடிமக்களுக்கான சட்ட AI ஆலோசனை',
    navHome: 'முகப்பு',
    navChat: 'AI சட்ட உரையாடல்',
    navRights: 'உரிமைகள் & சட்டங்கள்',
    navDocs: 'ஆவண உருவாக்கம்',
    navLawyers: 'சட்டத்தரணிகள் கோப்பகம்',
    navEmergency: 'பொலிஸ் உரிமைகள் (அவசரம்)',
    login: 'உள்நுழைக / பதிவு செய்க',
    logout: 'வெளியேறு',
    guestUser: 'விருந்தினர்',
    heroTitle: 'ஒவ்வொரு இலங்கை குடிமகனுக்குமான சட்ட ஆலோசனை',
    heroSubtitle: 'இலங்கை அரசியலமைப்பு மற்றும் சட்டங்களின் அடிப்படையில் தமிழ், சிங்களம் மற்றும் ஆங்கிலத்தில் உடனடி சட்ட வழிகாட்டுதல்.',
    startChat: 'AI சட்ட ஆலோசனை கேட்க',
    exploreRights: 'உங்கள் உரிமைகளை அறிய',
    generateDoc: 'சட்ட ஆவணம் உருவாக்க',
    findLawyer: 'சட்டத்தரணிகளை தேட',
    emergencyHotline: 'அவசர பொலிஸ்: 119 | சட்ட உதவி: 1970 | மனித உரிமைகள்: 1996',
    disclaimerTitle: 'சட்ட பொறுப்புத் துறப்பு',
    disclaimerText: 'இந்த அமைப்பு இலங்கை சட்டங்கள் குறித்த தகவல்களை மட்டுமே வழங்குகிறது. இது உத்தியோகபூர்வ சட்டத்தரணி ஆலோசனையாகாது.',
    chatPlaceholder: 'உங்கள் சட்ட கேள்வியை கேட்கவும் (எ.கா. பொலிஸாரால் கைது செய்யப்பட்டால் உரிமைகள் என்ன?)...',
    uploadDoc: 'ஆவணத்தை பதிவேற்ற (OCR)',
    send: 'அனுப்பு',
    citatedLaws: 'மேற்கோள் காட்டப்பட்ட இலங்கை சட்டங்கள்:',
    copyText: 'பிரதி எடுக்க',
    copiedText: 'பிரதி எடுக்கப்பட்டது!',
    readAloud: 'வாசிக்கக் கேட்க',
    stopAudio: 'நிறுத்துக',
    selectLanguage: 'மொழி / Language / භාෂාව',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
