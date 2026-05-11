import ReactMarkdown from 'react-markdown'

export default function ChatMessage({ message, onViewSources }) {
  const isUser = message.role === 'user'
  const isError = message.isError

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up`}>
      <div className={`flex gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
          isUser 
            ? 'bg-gradient-to-br from-primary-500 to-primary-600' 
            : isError 
            ? 'bg-red-500/20 border border-red-500/30'
            : 'bg-gradient-to-br from-gold-500/20 to-gold-600/20 border border-gold-500/30'
        }`}>
          {isUser ? '👤' : isError ? '❌' : '⚖️'}
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2">
          <div className={
            isUser 
              ? 'chat-bubble-user' 
              : isError
              ? 'glass-card px-5 py-3 max-w-full rounded-2xl rounded-bl-md border-red-500/20 animate-slide-up'
              : 'chat-bubble-bot'
          }>
            <div className="markdown-content text-sm leading-relaxed">
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          </div>

          {/* Source chips */}
          {message.sources && message.sources.length > 0 && (
            <div className="flex flex-wrap gap-2 ml-1">
              <button
                onClick={() => onViewSources(message.sources)}
                className="source-chip"
              >
                📜 View {message.sources.length} source{message.sources.length > 1 ? 's' : ''}
              </button>
              
              {message.confidence && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">
                  🎯 {Math.round(message.confidence * 100)}% match
                </span>
              )}
            </div>
          )}

          {/* Timestamp */}
          <span className={`text-[10px] text-white/20 ${isUser ? 'text-right' : 'text-left'} ml-1`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  )
}
