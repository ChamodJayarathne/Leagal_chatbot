import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../constants/translations'
import LanguageSelector from '../components/LanguageSelector'

export default function AboutPage() {
  const { language } = useLanguage()
  const t = translations[language].about
  const navT = translations[language].nav

  const techStack = [
    { name: 'React.js', category: 'Frontend', icon: '⚛️' },
    { name: 'Tailwind CSS', category: 'Styling', icon: '🎨' },
    { name: 'FastAPI', category: 'Backend', icon: '⚡' },
    { name: 'Sentence-BERT', category: 'NLP', icon: '🧠' },
    { name: 'FAISS', category: 'Search', icon: '🔍' },
    { name: 'PyMuPDF', category: 'PDF Processing', icon: '📄' },
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-navy-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center text-xl">
              ⚖️
            </div>
            <span className="text-xl font-bold gradient-text">JusticeBot</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-white/60 hover:text-white transition-colors text-sm font-medium">
              {navT.home}
            </Link>
            <LanguageSelector />
            <Link to="/chat" className="btn-primary text-sm !px-5 !py-2.5">
              {navT.startChat}
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t.subtitle.split(' ').slice(0, 1).join(' ')} <span className="gradient-text">JusticeBot</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {t.howTitle}
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {t.steps.map((step, index) => {
              const icons = ['💬', '🔍', '📊', '📜'];
              return (
                <div key={index} className="relative">
                  <div className="glass-card p-6 text-center h-full">
                    <div className="text-4xl mb-4">{icons[index]}</div>
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-white/40 text-sm">{step.desc}</p>
                  </div>
                  {index < t.steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 text-white/20 text-2xl">→</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {t.archTitle}
          </h2>
          <div className="glass-card p-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="text-3xl mb-3">🖥️</div>
                <h3 className="text-primary-400 font-semibold mb-2">Frontend</h3>
                <p className="text-white/40 text-sm">{t.arch.front}</p>
              </div>
              <div className="p-4 border-x border-white/5">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-primary-400 font-semibold mb-2">Backend API</h3>
                <p className="text-white/40 text-sm">{t.arch.back}</p>
              </div>
              <div className="p-4">
                <div className="text-3xl mb-3">🧠</div>
                <h3 className="text-primary-400 font-semibold mb-2">AI Engine</h3>
                <p className="text-white/40 text-sm">{t.arch.engine}</p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="text-gold-400 font-semibold mb-2">{t.kb.title}</h3>
              <p className="text-white/40 text-sm">{t.kb.desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {t.techTitle}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {techStack.map((tech, index) => (
              <div key={index} className="glass-card-hover p-5 text-center">
                <div className="text-3xl mb-3">{tech.icon}</div>
                <h3 className="text-white font-semibold">{tech.name}</h3>
                <p className="text-primary-400 text-xs font-medium mt-1">{tech.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            {t.sourceTitle}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {t.sources.map((source, index) => (
              <div key={index} className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">🇱🇰</div>
                  <h3 className="text-lg font-semibold text-white">{source.title}</h3>
                </div>
                <p className="text-white/40 text-sm">
                  {source.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-8 border-gold-500/20">
            <div className="flex items-start gap-4">
              <div className="text-3xl">⚠️</div>
              <div>
                <h3 className="text-lg font-semibold text-gold-400 mb-2">{t.disclaimerTitle}</h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {t.disclaimerDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t.ready}</h2>
          <p className="text-white/40 mb-8">{t.readyDesc}</p>
          <Link to="/chat" className="btn-primary text-lg !px-8 !py-4 inline-flex items-center gap-2">
            <span>💬</span> {navT.startChat}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white/20 text-sm">
            © 2026 JusticeBot — AI-Based Justice Chatbot for Sri Lanka
          </p>
        </div>
      </footer>
    </div>
  )
}
