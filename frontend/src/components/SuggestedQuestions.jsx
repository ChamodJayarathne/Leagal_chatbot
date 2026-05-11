const questionsByLanguage = {
  english: [
    "What are the fundamental rights?",
    "How is the President elected?",
    "What are the powers of Parliament?",
    "How to amend the Constitution?",
    "What is the role of the judiciary?",
    "What are citizen duties?",
  ],
  sinhala: [
    "මූලික අයිතිවාසිකම් මොනවාද?",
    "ජනාධිපතිවරයා තෝරා ගන්නේ කෙසේද?",
    "පාර්ලිමේන්තුවේ බලතල මොනවාද?",
    "ව්‍යවස්ථාව සංශෝධනය කරන්නේ කෙසේද?",
    "නිල භාෂාව කුමක්ද?",
  ],
  tamil: [
    "அடிப்படை உரிமைகள் என்ன?",
    "ஜனாதிபதி எவ்வாறு தேர்ந்தெடுக்கப்படுகிறார்?",
    "அரசியலமைப்பை திருத்தும் செயல்முறை?",
  ],
}

export default function SuggestedQuestions({ language, onSelectQuestion }) {
  const questions = questionsByLanguage[language] || questionsByLanguage.english

  return (
    <div className="animate-fade-in">
      <p className="text-white/30 text-xs font-medium uppercase tracking-wider mb-3 ml-1">
        {language === 'sinhala' ? 'යෝජිත ප්‍රශ්න' : 
         language === 'tamil' ? 'பரிந்துரைக்கப்பட்ட கேள்விகள்' : 
         'Suggested Questions'}
      </p>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onSelectQuestion(question)}
            className={`text-left px-4 py-2.5 glass-card-hover text-sm text-white/60 hover:text-white transition-all duration-200 ${
              language === 'sinhala' ? 'font-sinhala' : 
              language === 'tamil' ? 'font-tamil' : ''
            }`}
            id={`suggested-q-${index}`}
          >
            💡 {question}
          </button>
        ))}
      </div>
    </div>
  )
}
