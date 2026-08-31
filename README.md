# ⚖️ LegalAI Sri Lanka — AI Legal Agent & Citizen Assistant

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-1.5_Pro-orange.svg)](https://deepmind.google/technologies/gemini/)

**LegalAI Sri Lanka** is an intelligent, accessible legal assistant platform designed specifically for the legal framework of Sri Lanka. Built to bridge the legal awareness gap, it empowers citizens, students, tenants, employees, and legal professionals with instant legal guidance, document analysis, automated legal document generation, rights information, and interactive legal utility tools.

---

## 🚀 Features

### 🤖 1. AI Legal Chatbot & RAG Engine
- **Sri Lankan Law Specialist:** Knowledgeable in the Constitution of Sri Lanka, Penal Code, Labour Law, Rent Act, Consumer Affairs Authority Act, Land Law, and Traffic Regulations.
- **Multilingual Support:** Communicate seamlessly in **English**, **Sinhala**, and **Tamil** with simplified explanations suitable for non-lawyers.
- **RAG-Powered Accuracy:** Augmented generation using curated Sri Lankan legal acts and case precedents to minimize hallucination.
- **Document Analysis & OCR:** Upload legal documents or images (contracts, deeds, police reports) for instant summarization, clause analysis, and risk assessment.

### 🛡️ 2. Rights Hub & Emergency Legal Guide
- **Fundamental Rights:** Interactive guide to constitutional rights under Chapter III of the Constitution.
- **Emergency Rights Cards:** Immediate guidance for police arrests, detentions, workplace disputes, tenant eviction attempts, and domestic abuse.
- **Hotlines & Legal Aid:** One-tap emergency contacts including Legal Aid Commission, Police Headquarters, Women's Helpline, and Human Rights Commission.

### 📝 3. Legal Document Generator
- **Automated Drafting:** Generate legally aligned draft documents in minutes:
  - Rent & Lease Agreements
  - Affidavits (General, Name Change, Lost Document)
  - Power of Attorney
  - Formal Legal Demand Letters
  - Promissory Notes & Loan Agreements
  - Employment Contracts
- **Customizable Inputs & PDF Export:** Fill in interactive forms and export clean formatted documents.

### 🧮 4. Sri Lankan Legal Calculators
- **Stamp Duty Calculator:** Computes exact property transfer taxes and legal stamp duties based on current Inland Revenue guidelines.
- **EPF / ETF & Gratuity Calculator:** Calculates statutory terminal benefits, employer/employee contributions, and severance pay.
- **Traffic Fines & Demerit Calculator:** Breakdown of spot fines, court fines, and license points under the Motor Traffic Act.
- **Court Fee & Compensation Estimator:** Approximate filing fees and civil damages benchmarks.

### 👥 5. Lawyer Directory & Legal Aid Finder
- Search verified legal practitioners across Sri Lanka by **Location** (Colombo, Kandy, Galle, Jaffna, Kurunegala, etc.) and **Specialization** (Civil, Criminal, Corporate, Family, Property, Labour Law).
- View profile credentials, contact info, and schedule consultation requests.

### 🗺️ 6. Interactive Legal Map
- Location-based visualization of Sri Lankan Courts (Supreme Court, Court of Appeal, High Courts, District Courts, Magistrate Courts), Police Stations, and Legal Aid Centers.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Routing:** React Router DOM v6
- **Styling:** Custom CSS with Glassmorphism UI & responsive design
- **Icons & Markdown:** React Icons / Lucide Icons, React Markdown
- **Client OCR:** Tesseract.js for client-side text extraction

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB Atlas with Mongoose ODM
- **AI Service:** `@google/generative-ai` (Google Gemini 1.5 Pro / Flash)
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt password hashing
- **File Handling & PDF Processing:** Multer & PDF-Parse

---

## 📁 Project Structure

```text
legal-chat-bot/
├── client/                     # Vite + React Frontend Application
│   ├── public/                 # Static assets & public icons
│   ├── src/
│   │   ├── components/         # Navbar, Footer, and UI helpers
│   │   ├── context/            # AuthContext & global state providers
│   │   ├── pages/              # ChatPage, RightsHub, DocumentGenerator, Calculators, etc.
│   │   ├── App.jsx             # React router configuration
│   │   ├── main.jsx            # Application entry point
│   │   └── index.css           # Global design system & theme styles
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express Backend Server
│   ├── config/                 # DB connection configuration
│   ├── data/                   # Seed datasets (Sri Lankan legal statutes, lawyer directory)
│   ├── models/                 # Mongoose Schemas (User, Chat, Document, Lawyer, Rights)
│   ├── routes/                 # API Routes (auth, chat, documents, lawyers, rights)
│   ├── services/               # Gemini AI & RAG retrieval services
│   ├── .env                    # Server environment configuration
│   ├── index.js                # Express App entry point
│   └── package.json
│
├── package.json                # Root orchestrator scripts (concurrently dev runner)
└── README.md                   # Project documentation
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file inside the `server/` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/legalbot?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_jwt_secret_key_here

# AI Service (Google Gemini API)
GEMINI_API_KEY=your_google_gemini_api_key_here

# Client URL (CORS)
CLIENT_URL=http://localhost:5173
```

> 🔑 **Note:** Obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/).

---

## 🚦 Getting Started

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **MongoDB:** Local instance or MongoDB Atlas cluster

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/legal-chat-bot.git
cd legal-chat-bot
```

### 2. Install All Dependencies
Install dependencies for the root, server, and client apps simultaneously:
```bash
npm run install:all
```

### 3. Seed Database (Optional but Recommended)
Populate MongoDB with Sri Lankan legal acts, fundamental rights data, sample templates, and lawyer listings:
```bash
npm run seed
```

### 4. Run the Development Application

#### Method A: Run Both Concurrently (Single Terminal)
Start both the Express backend (`http://localhost:5000`) and Vite React client (`http://localhost:5173`) together:
```bash
npm run dev
```

#### Method B: Run Backend and Frontend Separately (Two Terminals)

**Terminal 1 — Backend Server (`http://localhost:5000`):**
```bash
# Option 1: From project root
npm run server

# Option 2: Directly from server folder
cd server
npm run dev
```

**Terminal 2 — Frontend Client (`http://localhost:5173`):**
```bash
# Option 1: From project root
npm run client

# Option 2: Directly from client folder
cd client
npm run dev
```

---

## 📡 API Reference Overview

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health check & Gemini status |
| `/api/auth/register` | `POST` | User registration |
| `/api/auth/login` | `POST` | User login & JWT issuance |
| `/api/chat/message` | `POST` | Send query to Gemini AI & RAG engine |
| `/api/chat/history` | `GET` | Retrieve user chat history |
| `/api/rights/search` | `GET` | Search fundamental rights & laws |
| `/api/lawyers` | `GET` | Filter lawyer directory by location & domain |
| `/api/documents/generate` | `POST` | Auto-generate legal agreement draft |
| `/api/documents/analyze` | `POST` | Upload PDF/Image for AI risk analysis |

---

## ⚠️ Disclaimer

**LegalAI Sri Lanka** provides legal information, educational content, and document generation tools based on Sri Lankan laws for informational purposes only. It **does not constitute official legal advice** or formal attorney-client representation. For court representation or legal proceedings, users are encouraged to consult a licensed Attorney-at-Law registered with the Bar Association of Sri Lanka (BASL).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page or submit a pull request.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
