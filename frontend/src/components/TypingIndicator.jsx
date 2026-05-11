export default function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-600/20 border border-gold-500/30 flex items-center justify-center text-sm">
          ⚖️
        </div>
        <div className="glass-card px-5 py-4 rounded-2xl rounded-bl-md">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-primary-400 rounded-full typing-dot"></div>
            <div className="w-2 h-2 bg-primary-400 rounded-full typing-dot"></div>
            <div className="w-2 h-2 bg-primary-400 rounded-full typing-dot"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
