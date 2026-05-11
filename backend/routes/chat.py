"""
Chat API Route
Main chatbot endpoint for user conversations.
"""
from fastapi import APIRouter, Request
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

router = APIRouter(tags=["chat"])


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, description="User's legal question")
    language: Optional[str] = Field(None, description="Force language (sinhala, tamil, english). Auto-detected if not provided.")
    top_k: Optional[int] = Field(5, ge=1, le=20, description="Number of results to retrieve")


class ChatResponse(BaseModel):
    answer: str
    sources: list
    # disclaimer: str
    confidence: float
    language: str
    results_count: int
    timestamp: str


@router.post("/chat", response_model=ChatResponse)
async def chat(request: Request, body: ChatRequest):
    """
    Main chatbot endpoint.
    Send a legal question and get AI-powered legal information.
    """
    search_service = request.app.state.search_service
    language_service = request.app.state.language_service
    response_service = request.app.state.response_service
    
    # 1. Detect language
    if body.language:
        detected_language = body.language
    else:
        detected_language = language_service.detect_language(body.message)
    
    # 2. Preprocess query
    from deep_translator import GoogleTranslator
    original_message = body.message
    
    # If not English, translate to English for searching the FAISS index
    if detected_language != "english":
        try:
            english_query = GoogleTranslator(source='auto', target='en').translate(original_message)
        except Exception as e:
            print(f"Translation Error: {e}")
            english_query = original_message
    else:
        english_query = original_message

    processed_query = language_service.preprocess_query(english_query, "english")
    
    # 3. Semantic search
    # We now strictly search English documents
    search_results = search_service.search(
        query=processed_query,
        top_k=body.top_k or 5,
        language_filter="english"
    )
    
    # 4. Generate response
    response = response_service.generate_response(
        search_results=search_results,
        query=processed_query,
        language=detected_language
    )
    
    response["timestamp"] = datetime.now().isoformat()
    
    return ChatResponse(**response)


# Suggested questions endpoint
SUGGESTED_QUESTIONS = {
    "english": [
        "What are the fundamental rights guaranteed by the Constitution?",
        "How is the President of Sri Lanka elected?",
        "What is the process to amend the Constitution?",
        "What are the powers of Parliament?",
        "What is the role of the judiciary in Sri Lanka?",
        "What are the duties of citizens?",
        "How is the Prime Minister appointed?",
        "What is the official language of Sri Lanka?",
    ],
    "sinhala": [
        "ශ්‍රී ලංකාවේ මූලික අයිතිවාසිකම් මොනවාද?",
        "ජනාධිපතිවරයා තෝරා ගන්නේ කෙසේද?",
        "ආණ්ඩුක්‍රම ව්‍යවස්ථාව සංශෝධනය කරන්නේ කෙසේද?",
        "පාර්ලිමේන්තුවේ බලතල මොනවාද?",
        "ශ්‍රී ලංකාවේ නිල භාෂාව කුමක්ද?",
    ],
    "tamil": [
        "அரசியலமைப்பால் உத்தரவாதம் செய்யப்பட்ட அடிப்படை உரிமைகள் என்ன?",
        "இலங்கை ஜனாதிபதி எவ்வாறு தேர்ந்தெடுக்கப்படுகிறார்?",
        "அரசியலமைப்பை திருத்தும் செயல்முறை என்ன?",
    ]
}


@router.get("/suggested-questions")
async def get_suggested_questions(language: Optional[str] = None):
    """Get suggested questions for the chatbot."""
    if language and language in SUGGESTED_QUESTIONS:
        return {"questions": SUGGESTED_QUESTIONS[language]}
    return {"questions": SUGGESTED_QUESTIONS}
