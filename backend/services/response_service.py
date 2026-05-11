"""
Response Generation Service
Formats search results into user-friendly chatbot responses.
"""


class ResponseService:
    DISCLAIMER = {
        "english": "⚠️ This chatbot provides general legal information only and does not constitute legal advice. Please consult a qualified lawyer for specific legal matters.",
        "sinhala": "⚠️ මෙම චැට්බොට් එක පොදු නීතිමය තොරතුරු පමණක් සපයයි. නිශ්චිත නීතිමය කරුණු සඳහා සුදුසුකම් ලත් නීතිඥයෙකුගෙන් උපදෙස් ලබා ගන්න.",
        "tamil": "⚠️ இந்த சாட்போட் பொதுவான சட்ட தகவல்களை மட்டுமே வழங்குகிறது. குறிப்பிட்ட சட்ட விவகாரங்களுக்கு தகுதியான வழக்கறிஞரை அணுகவும்."
    }
    
    NO_RESULTS = {
        "english": "I couldn't find specific legal information matching your query. Please try rephrasing your question or ask about a specific topic from the Sri Lankan Constitution.",
        "sinhala": "ඔබගේ ප්‍රශ්නයට අදාළ නිශ්චිත නීතිමය තොරතුරු සොයා ගත නොහැකි විය. කරුණාකර ඔබේ ප්‍රශ්නය නැවත වාක්‍ය ලෙස සකස් කරන්න.",
        "tamil": "உங்கள் வினவலுக்கு பொருத்தமான குறிப்பிட்ட சட்ட தகவல்களைக் கண்டறிய முடியவில்லை. உங்கள் கேள்வியை மீண்டும் வடிவமைக்கவும்."
    }
    
    def __init__(self):
        pass
    
    def generate_response(self, search_results: list, query: str, language: str) -> dict:
        """
        Generate a user-friendly response from search results.
        
        Args:
            search_results: List of search results from SearchService
            query: Original user query
            language: Detected language
        
        Returns:
            Formatted response dict
        """
        from deep_translator import GoogleTranslator

        if not search_results:
            return {
                "answer": self.NO_RESULTS.get(language, self.NO_RESULTS["english"]),
                "sources": [],
                "disclaimer": self.DISCLAIMER.get(language, self.DISCLAIMER["english"]),
                "confidence": 0.0
            }
        
        # Translate the text of the search results if necessary
        if language != "english":
            target_lang = "si" if language == "sinhala" else "ta" if language == "tamil" else "en"
            
            if target_lang != "en":
                translator = GoogleTranslator(source='en', target=target_lang)
                for result in search_results:
                    try:
                        # Only translate up to 3000 chars to avoid API limits
                        text_to_translate = result["text"][:3000]
                        translated_text = translator.translate(text_to_translate)
                        # We keep the english full text in the source panel for safety, but show translated in chat
                        result["translated_text"] = translated_text
                    except Exception as e:
                        print(f"Translation Error for result {result['id']}: {e}")
                        result["translated_text"] = result["text"]
                        
        
        # Build answer from top results
        top_result = search_results[0]
        confidence = top_result["score"]
        
        # Format the main answer
        if language == "english":
            answer = self._format_english_response(search_results, query)
        elif language == "sinhala":
            answer = self._format_sinhala_response(search_results, query)
        elif language == "tamil":
            answer = self._format_tamil_response(search_results, query)
        else:
            answer = self._format_english_response(search_results, query)
        
        # Format sources
        sources = []
        for result in search_results[:5]:
            # Use translated text for both snippet and details if available
            display_text = result.get("translated_text", result["text"])
            
            source = {
                "id": result["id"],
                "text": display_text[:300] + ("..." if len(display_text) > 300 else ""),
                "full_text": display_text,
                "original_text": result["text"], # Keep English for transparency
                "relevance_score": round(result["score"], 4),
                "source_file": result["source_file"],
                "page_number": result["page_number"],
                "article_number": result.get("article_number"),
                "chapter": result.get("chapter")
            }
            sources.append(source)
        
        return {
            "answer": answer,
            "sources": sources,
            "disclaimer": self.DISCLAIMER.get(language, self.DISCLAIMER["english"]),
            "confidence": round(confidence, 4),
            "language": language,
            "results_count": len(search_results)
        }
    
    def _format_english_response(self, results: list, query: str) -> str:
        """Format response in English."""
        top = results[0]
        
        # Build response
        parts = []
        
        # Header
        article_info = ""
        if top.get("article_number"):
            article_info = f" (Article {top['article_number']})"
        elif top.get("chapter"):
            article_info = f" (Chapter {top['chapter']})"
        
        parts.append(f"📜 **Based on the Sri Lankan Constitution{article_info}:**\n")
        
        # Main content from top result
        text = top["text"]
        parts.append(text)
        
        return "\n".join(parts)
    
    def _format_sinhala_response(self, results: list, query: str) -> str:
        """Format response in Sinhala."""
        top = results[0]
        
        parts = []
        
        article_info = ""
        if top.get("article_number"):
            article_info = f" (ව්‍යවස්ථාව {top['article_number']})"
        
        parts.append(f"📜 **ශ්‍රී ලංකා ආණ්ඩුක්‍රම ව්‍යවස්ථාවට අනුව{article_info}:**\n")
        
        text = top.get("translated_text", top["text"])
        parts.append(text)
        
        return "\n".join(parts)
    
    def _format_tamil_response(self, results: list, query: str) -> str:
        """Format response in Tamil."""
        top = results[0]
        
        parts = []
        parts.append(f"📜 **இலங்கை அரசியலமைப்பின் படி:**\n")
        
        text = top.get("translated_text", top["text"])
        parts.append(text)
        
        return "\n".join(parts)
