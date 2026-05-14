# ⚖️ Justice Chatbot: AI-Powered Legal Assistant for Sri Lanka

Justice Chatbot is a comprehensive, multilingual AI platform designed to provide accessible legal information and guidance for the citizens of Sri Lanka. Leveraging Retrieval-Augmented Generation (RAG) and modern AI techniques, the platform offers accurate answers based on the Sri Lankan Constitution and other legal documents.

---

## 🌟 Key Features

- **🌐 Multilingual Support**: Seamless interaction in **English**, **Sinhala**, and **Tamil**.
- **🤖 AI-Driven Chat**: Context-aware legal advice using the latest RAG technology.
- **📄 Document Intelligence**: Automatic processing and indexing of legal PDFs via OCR.
- **🔍 Semantic Search**: Advanced search capabilities to find specific laws and regulations.
- **⌨️ Virtual Keyboard**: Integrated multilingual keyboard for easier input in native languages.
- **👨‍⚖️ Professional Directory**: Searchable database of legal professionals and procedural guides.
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for modern UI/UX
- **State Management**: React Hooks & Context API
- **Networking**: [Axios](https://axios-http.com/)
- **Key Libraries**: `react-markdown`, `react-simple-keyboard`, `react-router-dom`

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python)
- **AI Models**: Sentence Transformers for embeddings
- **Vector Database**: [FAISS](https://github.com/facebookresearch/faiss) for high-performance semantic search
- **Document Processing**: PyMuPDF for PDF extraction
- **Language Detection**: `langdetect`

---

## 📂 Project Structure

```text
Leagal_chatbot/
├── backend/                # FastAPI Application
│   ├── routes/             # API Endpoints (chat, search, laws)
│   ├── services/           # Business logic (AI, Search, Language)
│   ├── utils/              # Helper functions
│   ├── app.py              # Main entry point
│   └── requirements.txt    # Python dependencies
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page layouts
│   │   ├── constants/      # App constants & translations
│   │   └── App.jsx         # Main React component
│   └── package.json        # Node.js dependencies
├── data/                   # Data Storage
│   ├── raw_docs/           # Original PDF documents
│   ├── processed/          # Extracted text/chunks
│   └── embeddings/         # FAISS index and vector data
├── scripts/                # Data processing scripts
└── start.bat               # One-click startup script (Windows)
```

---

## 🚀 Getting Started

### Prerequisites
- [Python 3.10+](https://www.python.org/)
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/ChamodJayarathne/Leagal_chatbot.git
cd Leagal_chatbot
```

### 2. Backend Setup
```bash
# Install dependencies
cd backend
py -m pip install -r requirements.txt    # Use 'pip' if it's on your PATH

# Start the backend server
py -m uvicorn app:app --reload
```

> **💡 Windows Tip:** If `pip` or `python` is not recognized, use `py -m pip` and `py -m uvicorn` instead. The `py` launcher is installed automatically with Python on Windows.

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 🏗️ Architecture

The system follows a modern RAG (Retrieval-Augmented Generation) pipeline:
1. **Indexing**: Legal documents are parsed, chunked, and converted into vector embeddings.
2. **Retrieval**: When a user asks a question, the system searches the FAISS index for relevant context.
3. **Generation**: The retrieved context is passed to the AI model to generate a precise, grounded response.
4. **Translation**: Real-time translation services ensure the conversation happens in the user's preferred language.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---



© 2026 Justice Chatbot Team. Developed with ❤️ for Sri Lanka.