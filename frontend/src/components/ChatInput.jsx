import { useState, useRef, useEffect } from 'react'
import VirtualKeyboard from './VirtualKeyboard'
const placeholders = {
  english: 'Ask a legal question...',
  sinhala: 'නීතිමය ප්‍රශ්නයක් අසන්න...',
  tamil: 'சட்ட கேள்வி கேளுங்கள்...',
}

export default function ChatInput({ onSend, isLoading, language }) {
  const [message, setMessage] = useState('')
  const [showKeyboard, setShowKeyboard] = useState(false)
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
    }
  }, [message])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSend(message.trim())
      setMessage('')
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="w-full relative">
      <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholders[language] || placeholders.english}
            disabled={isLoading}
            rows={1}
            className={`input-field resize-none !py-3.5 !pr-12 ${
              language === 'sinhala' ? 'font-sinhala' : 
              language === 'tamil' ? 'font-tamil' : ''
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            id="chat-input"
          />
          
          {/* Character count */}
          {message.length > 100 && (
            <span className="absolute bottom-1 right-14 text-[10px] text-white/20">
              {message.length}/2000
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowKeyboard(!showKeyboard)}
          className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
            showKeyboard ? 'bg-primary-500/20 text-primary-400' : 'bg-white/5 text-white/40 hover:text-white/80 hover:bg-white/10'
          }`}
          title="Toggle Virtual Keyboard"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 20h9M3 20h2m-2-4h20M5 16h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2zm3-6h2m2 0h2m2 0h2M8 12h2m2 0h2m2 0h2" />
          </svg>
        </button>

        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
            message.trim() && !isLoading
              ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 hover:scale-105 active:scale-95'
              : 'bg-white/5 text-white/20 cursor-not-allowed'
          }`}
          id="chat-send-btn"
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
    </form>
    
    {/* Virtual Keyboard */}
    {showKeyboard && (
      <div className="mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <VirtualKeyboard 
          value={message} 
          onChange={(val) => setMessage(val)} 
          language={language} 
        />
      </div>
    )}
  </div>
  )
}
