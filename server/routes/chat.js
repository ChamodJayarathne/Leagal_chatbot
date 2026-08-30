import express from 'express';
import multer from 'multer';
import { generateLegalAdvice } from '../services/geminiService.js';
import ChatSession from '../models/Chat.js';
import { getDBStatus } from '../config/db.js';

const router = express.Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// In-memory chat store fallback when MongoDB is offline
const memorySessions = [];

// Send Message & Get AI Legal Consultation
router.post('/message', async (req, res) => {
  try {
    const { userId = 'guest_default', sessionId, message, language = 'en', category } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message content is required.' });
    }

    let session = null;
    let history = [];

    // Find or create session
    if (getDBStatus()) {
      if (sessionId) {
        session = await ChatSession.findById(sessionId);
      }
      if (!session) {
        session = new ChatSession({
          userId,
          title: message.length > 40 ? message.substring(0, 40) + '...' : message,
          category: category || 'General Legal Advice',
          messages: [],
        });
      }
      history = session.messages;
    } else {
      // Memory mode
      session = memorySessions.find(s => s._id === sessionId && s.userId === userId);
      if (!session) {
        session = {
          _id: sessionId || `session_${Date.now()}`,
          userId,
          title: message.length > 40 ? message.substring(0, 40) + '...' : message,
          category: category || 'General Legal Advice',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        memorySessions.push(session);
      }
      history = session.messages;
    }

    // Add user message to history
    const userMsgObj = { sender: 'user', content: message, language, timestamp: new Date() };
    session.messages.push(userMsgObj);

    // Generate Legal Advice with Gemini & RAG
    const aiResult = await generateLegalAdvice({
      prompt: message,
      language,
      history: history.slice(-6), // context window
    });

    const assistantMsgObj = {
      sender: 'assistant',
      content: aiResult.content,
      language,
      citations: aiResult.citations || [],
      timestamp: new Date(),
    };

    session.messages.push(assistantMsgObj);
    session.updatedAt = new Date();

    if (getDBStatus()) {
      await session.save();
    }

    return res.json({
      sessionId: session._id,
      title: session.title,
      messages: session.messages,
      latestMessage: assistantMsgObj,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Error processing legal chat message.', error: error.message });
  }
});

// Get user chat sessions
router.get('/sessions', async (req, res) => {
  try {
    const { userId = 'guest_default' } = req.query;

    if (getDBStatus()) {
      const sessions = await ChatSession.find({ userId }).sort({ updatedAt: -1 }).select('_id title category updatedAt messages');
      return res.json(sessions);
    } else {
      const sessions = memorySessions.filter(s => s.userId === userId).sort((a, b) => b.updatedAt - a.updatedAt);
      return res.json(sessions);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch chat sessions.' });
  }
});

// Get single session details
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (getDBStatus()) {
      const session = await ChatSession.findById(sessionId);
      if (!session) return res.status(404).json({ message: 'Session not found.' });
      return res.json(session);
    } else {
      const session = memorySessions.find(s => s._id === sessionId);
      if (!session) return res.status(404).json({ message: 'Session not found.' });
      return res.json(session);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving chat session.' });
  }
});

// Document OCR / Upload processing
router.post('/ocr', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No document file uploaded.' });
    }

    const fileName = req.file.originalname;
    const mimeType = req.file.mimetype;
    
    // Extracted simulated text snippet for demo document upload
    let extractedText = `DOCUMENT ANALYSIS SUMMARY (${fileName}):\n`;
    extractedText += `Document Type: Legal Instrument / Contract / Notice\n`;
    extractedText += `Extracted Content Preview:\n"Agreement entered into this day between Party A and Party B concerning residential lease premises situated in Colombo district. Terms include monthly rental payment, 3 months advance security deposit, and 2 months written notice period for termination."`;

    res.json({
      success: true,
      fileName,
      mimeType,
      extractedText,
      summaryPrompt: `Please analyze this uploaded document "${fileName}" under Sri Lankan Law. What are the key rights, liabilities, and potential legal risks?`,
    });
  } catch (error) {
    console.error('OCR Error:', error);
    res.status(500).json({ message: 'Failed to process document OCR.' });
  }
});

export default router;
