export default function SourcePanel({ sources, language, isOpen, onClose }) {
  if (!isOpen) return null

  const labels = {
    english: {
      title: '📜 Legal Sources',
      article: 'Article',
      chapter: 'Chapter',
      section: 'Constitution Section',
      match: 'match',
      found: 'relevant sections found'
    },
    sinhala: {
      title: '📜 නීතිමය මූලාශ්‍ර',
      article: 'ව්‍යවස්ථාව',
      chapter: 'පරිච්ඡේදය',
      section: 'ආණ්ඩුක්‍රම ව්‍යවස්ථාවේ කොටස',
      match: 'ගැලපුම',
      found: 'අදාළ කොටස් හමු විය'
    },
    tamil: {
      title: '📜 சட்ட ஆதாரங்கள்',
      article: 'கட்டுரை',
      chapter: 'அத்தியாயம்',
      section: 'அரசியலமைப்பு பிரிவு',
      match: 'பொருத்தம்',
      found: 'தொடர்புடைய பிரிவுகள் கிடைத்தன'
    }
  }

  const l = labels[language] || labels.english

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`fixed right-0 top-0 h-full w-full md:w-[480px] bg-navy-900 border-l border-white/10 z-50 overflow-y-auto animate-slide-in-right shadow-2xl`}>
        {/* Header */}
        <div className="sticky top-0 bg-navy-900/95 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {l.title}
            </h2>
            <p className="text-white/30 text-xs mt-0.5">
              {sources?.length || 0} {l.found}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all"
            id="close-source-panel"
          >
            ✕
          </button>
        </div>

        {/* Sources list */}
        <div className="p-4 space-y-4">
          {sources?.map((source, index) => (
            <div key={source.id || index} className="glass-card p-5 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-primary-500/20 text-primary-400 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div>
                    {source.article_number && (
                      <span className="text-sm font-semibold text-primary-400">
                        {l.article} {source.article_number}
                      </span>
                    )}
                    {source.chapter && (
                      <span className="text-sm font-semibold text-primary-400 ml-2">
                        {l.chapter} {source.chapter}
                      </span>
                    )}
                      {!source.article_number && !source.chapter && (
                      <span className="text-sm font-semibold text-primary-400">
                        {l.section}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  source.relevance_score > 0.7 
                    ? 'bg-green-500/10 text-green-400' 
                    : source.relevance_score > 0.4
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'bg-white/5 text-white/40'
                }`}>
                  {Math.round(source.relevance_score * 100)}% {l.match}
                </span>
              </div>

              {/* Content */}
              <div className="text-white/60 text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                {source.full_text || source.text}
              </div>

              {/* Meta */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-[10px] text-white/30">
                  📄 {source.source_file}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-[10px] text-white/30">
                  📃 Page {source.page_number}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="p-4 border-t border-white/5">
          <p className="text-white/20 text-xs text-center">
            Sources extracted from the Constitution of Sri Lanka
          </p>
        </div>
      </div>
    </>
  )
}
