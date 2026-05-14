"""
Justice Chatbot Backend - Main FastAPI Application
"""
# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import sys

# Add parent to path for imports
sys.path.insert(0, os.path.dirname(__file__))

from services.search_service import SearchService
from services.language_service import LanguageService
from services.response_service import ResponseService
from routes.chat import router as chat_router
from routes.search import router as search_router
from routes.laws import router as laws_router

# Global services (initialized on startup)
search_service = None
language_service = None
response_service = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load AI models and FAISS index on startup."""
    global search_service, language_service, response_service
    
    print("[*] Loading AI models and FAISS index...")
    
    base_dir = os.path.dirname(os.path.dirname(__file__))
    embeddings_dir = os.path.join(base_dir, "data", "embeddings")
    processed_dir = os.path.join(base_dir, "data", "processed")
    
    search_service = SearchService(embeddings_dir, processed_dir)
    search_service.load()
    
    language_service = LanguageService()
    response_service = ResponseService()
    
    # Store in app state for route access
    app.state.search_service = search_service
    app.state.language_service = language_service
    app.state.response_service = response_service
    
    print("[OK] All services loaded and ready!")
    
    yield
    
    print("[..] Shutting down...")


# Create FastAPI app
app = FastAPI(
    title="Justice Chatbot API",
    description="AI-Based Legal Information Chatbot for Sri Lanka",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(chat_router, prefix="/api")
app.include_router(search_router, prefix="/api")
app.include_router(laws_router, prefix="/api")


@app.get("/")
async def root():
    return {
        "name": "Justice Chatbot API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "chat": "/api/chat",
            "search": "/api/search",
            "laws": "/api/laws"
        }
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Triggering reload

