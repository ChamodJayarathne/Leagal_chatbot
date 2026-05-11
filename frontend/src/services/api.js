import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const chatService = {
  sendMessage: async (message, language = null, topK = 5) => {
    const response = await api.post('/chat', {
      message,
      language,
      top_k: topK,
    });
    return response.data;
  },

  getSuggestedQuestions: async (language = null) => {
    const params = language ? { language } : {};
    const response = await api.get('/suggested-questions', { params });
    return response.data;
  },

  searchLaws: async (query, topK = 10, language = null) => {
    const response = await api.post('/search', {
      query,
      top_k: topK,
      language,
    });
    return response.data;
  },

  getLaws: async (language = null, limit = 50) => {
    const params = {};
    if (language) params.language = language;
    if (limit) params.limit = limit;
    const response = await api.get('/laws', { params });
    return response.data;
  },
};

export default api;
