import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { chatService } from '../services/api'
import ChatMessage from '../components/ChatMessage'
import ChatInput from '../components/ChatInput'
import LanguageSelector from '../components/LanguageSelector'
import SuggestedQuestions from '../components/SuggestedQuestions'
import SourcePanel from '../components/SourcePanel'
import TypingIndicator from '../components/TypingIndicator'
import Disclaimer from '../components/Disclaimer'

const WELCOME_MESSAGE = {
  english: {
    text: "👋 Welcome to **JusticeBot**! I'm your AI-powered legal assistant for Sri Lanka.\n\nI can help you find information from the **Sri Lankan Constitution**. Ask me anything in English, සිංහල, or தமிழ்!\n\nTry clicking one of the suggested questions below to get started.",
    role: 'bot'
  },
  sinhala: {
    text: "👋 **JusticeBot** වෙත සාදරයෙන් පිළිගනිමු! මම ශ්‍රී ලංකාව සඳහා AI බලගැන්වූ නීති සහායකයෙකි.\n\nශ්‍රී ලංකා ආණ්ඩුක්‍රම ව්‍යවස්ථාවෙන් තොරතුරු සොයා ගැනීමට මට ඔබට උදවු කළ හැකිය.",
    role: 'bot'
  },
  tamil: {
    text: "👋 **JusticeBot**க்கு வரவேற்கிறோம்! இலங்கைக்கான AI சட்ட உதவியாளர்.\n\nஇலங்கை அரசியலமைப்பிலிருந்து தகவல்களைக் கண்டறிய நான் உங்களுக்கு உதவ முடியும்.",
    role: 'bot'
  }
}

import { useLanguage } from '../context/LanguageContext'

import { translations } from '../constants/translations'

export default function ChatPage() {
  const { language, setLanguage } = useLanguage()
  const t = translations[language]
  const [searchParams] = useSearchParams()
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSources, setSelectedSources] = useState(null)
  const [showSourcePanel, setShowSourcePanel] = useState(false)
  const messagesEndRef = useRef(null)
  const initialQueryProcessed = useRef(false)

  // Add welcome message on mount
  useEffect(() => {
    setMessages([{
      ...WELCOME_MESSAGE[language],
      id: 'welcome',
      timestamp: new Date().toISOString()
    }])
  }, [])

  // Handle query from URL params (e.g., from homepage sample questions)
  useEffect(() => {
    const query = searchParams.get('q')
    if (query && !initialQueryProcessed.current) {
      initialQueryProcessed.current = true
      setTimeout(() => handleSendMessage(query), 500)
    }
  }, [searchParams])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSendMessage = async (message) => {
    if (!message.trim() || isLoading) return

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      text: message,
      role: 'user',
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await chatService.sendMessage(message, null, 5)

      // Add bot response
      const botMessage = {
        id: `bot-${Date.now()}`,
        text: response.answer,
        role: 'bot',
        sources: response.sources,
        confidence: response.confidence,
        disclaimer: response.disclaimer,
        detectedLanguage: response.language,
        timestamp: response.timestamp
      }
      setMessages(prev => [...prev, botMessage])

      // Update language if detected differently
      if (response.language && response.language !== language) {
        setLanguage(response.language)
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = {
        id: `error-${Date.now()}`,
        text: error.response?.status === 0 || error.code === 'ERR_NETWORK'
          ? '❌ **Cannot connect to the server.** Please make sure the backend is running at `http://localhost:8000`.\n\nRun: `python -m uvicorn backend.app:app --reload` from the project root.'
          : `❌ **Error:** ${error.response?.data?.detail || error.message || 'Something went wrong. Please try again.'}`,
        role: 'bot',
        isError: true,
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewSources = (sources) => {
    setSelectedSources(sources)
    setShowSourcePanel(true)
  }

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang)
  }

  const handleSuggestedQuestion = (question) => {
    handleSendMessage(question)
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Chat Header */}
      <header className="flex-shrink-0 bg-navy-900/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center text-lg">
                ⚖️
              </div>
              <div>
                <h1 className="text-lg font-bold gradient-text leading-tight">JusticeBot</h1>
                <p className="text-[10px] text-white/30 leading-tight">{t.chat.subtitle}</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Link to="/about" className="text-white/40 hover:text-white/70 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Chat Messages Area */}
      <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onViewSources={handleViewSources}
            />
          ))}

          {isLoading && <TypingIndicator />}

          {/* Suggested questions (show after welcome) */}
          {messages.length <= 1 && !isLoading && (
            <SuggestedQuestions
              language={language}
              onSelectQuestion={handleSuggestedQuestion}
            />
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Disclaimer */}
      {/* <Disclaimer language={language} /> */}

      {/* Chat Input */}
      <div className="flex-shrink-0 border-t border-white/5 bg-navy-900/50 backdrop-blur-xl px-4 md:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            onSend={handleSendMessage}
            isLoading={isLoading}
            language={language}
          />
        </div>
      </div>

      {/* Source Panel (slide-out) */}
      <SourcePanel
        sources={selectedSources}
        language={language}
        isOpen={showSourcePanel}
        onClose={() => setShowSourcePanel(false)}
      />
    </div>
  )
}
