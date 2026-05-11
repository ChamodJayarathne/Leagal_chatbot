const disclaimers = {
  english: 'This chatbot provides general legal information only — not legal advice.',
  sinhala: 'මෙම චැට්බොට් එක පොදු නීතිමය තොරතුරු පමණක් සපයයි — නීතිමය උපදෙස් නොවේ.',
  tamil: 'இந்த சாட்போட் பொதுவான சட்ட தகவல்களை மட்டுமே வழங்குகிறது — சட்ட ஆலோசனை அல்ல.',
}

export default function Disclaimer({ language }) {
  return (
    <div className="flex-shrink-0 px-4 md:px-6 py-2 bg-gold-500/5 border-t border-gold-500/10">
      <p className={`text-center text-[11px] text-gold-400/60 ${
        language === 'sinhala' ? 'font-sinhala' : 
        language === 'tamil' ? 'font-tamil' : ''
      }`}>
        ⚠️ {disclaimers[language] || disclaimers.english}
      </p>
    </div>
  )
}
