import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../constants/translations'
import LanguageSelector from '../components/LanguageSelector'

export default function HomePage() {
  const { language } = useLanguage()
  const t = translations[language]
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const featureItems = [
    { icon: '🤖', title: t.features.search.title, description: t.features.search.desc },
    { icon: '🌐', title: t.features.multi.title, description: t.features.multi.desc },
    { icon: '📜', title: t.features.const.title, description: t.features.const.desc },
    { icon: '🔍', title: t.features.source.title, description: t.features.source.desc },
    { icon: '⚡', title: t.features.instant.title, description: t.features.instant.desc },
    { icon: '🛡️', title: t.features.reliable.title, description: t.features.reliable.desc },
  ]

  const statsItems = [
    { label: t.stats.articles, value: '170+' },
    { label: t.stats.languages, value: '3' },
    { label: t.stats.time, value: '<2s' },
    { label: t.stats.accuracy, value: '94%' },
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
            <Link to="/about" className="text-white/60 hover:text-white transition-colors text-sm font-medium">
              {t.nav.about}
            </Link>
            <LanguageSelector />
            <Link to="/chat" className="btn-primary text-sm !px-5 !py-2.5">
              {t.nav.startChat}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl"></div>
        
        <div className={`max-w-5xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            {t.hero.badge}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="text-white">{t.hero.title1}</span>
            <br />
            <span className="gradient-text">{t.hero.title2}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.hero.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chat" className="btn-primary text-lg !px-8 !py-4 flex items-center justify-center gap-2">
              <span>💬</span> {t.hero.btnChat}
            </Link>
            <Link to="/about" className="btn-secondary text-lg !px-8 !py-4 flex items-center justify-center gap-2">
              <span>📖</span> {t.hero.btnLearn}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsItems.map((stat, index) => (
            <div key={index} className="glass-card p-6 text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-white/40 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t.features.title}
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              {t.features.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureItems.map((feature, index) => (
              <div 
                key={index}
                className="glass-card-hover p-6 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {t.demo.title}
              </h2>
              <p className="text-white/40">{t.demo.subtitle}</p>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                "What are the fundamental rights?",
                "How is the President elected?",
                "What is the amendment process?",
                "ශ්‍රී ලංකාවේ මූලික අයිතිවාසිකම්",
              ].map((question, index) => (
                <Link
                  key={index}
                  to={`/chat?q=${encodeURIComponent(question)}`}
                  className="px-4 py-2.5 glass-card text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
                >
                  {question}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center text-sm">
              ⚖️
            </div>
            <span className="text-lg font-bold gradient-text">JusticeBot</span>
          </div>
          <p className="text-white/30 text-sm max-w-md mx-auto mb-4">
            {t.footer.desc}
          </p>
          <p className="text-white/20 text-xs">
            {t.footer.copyright}
          </p>
        </div>
      </footer>
    </div>
  )
}
