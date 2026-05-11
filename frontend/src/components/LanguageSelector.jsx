import { useLanguage } from '../context/LanguageContext'

const languages = [
  { code: 'english', label: 'EN', fullLabel: 'English' },
  { code: 'sinhala', label: 'සිං', fullLabel: 'සිංහල' },
  { code: 'tamil', label: 'தமி', fullLabel: 'தமிழ்' },
]

export default function LanguageSelector() {
  const { language: currentLanguage, setLanguage: onLanguageChange } = useLanguage();

  return (
    <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onLanguageChange(lang.code)}
          className={`language-btn ${
            currentLanguage === lang.code
              ? 'language-btn-active'
              : 'language-btn-inactive'
          }`}
          title={lang.fullLabel}
          id={`lang-btn-${lang.code}`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
