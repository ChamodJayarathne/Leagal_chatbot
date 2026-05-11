"""
Language Detection Service
Detects whether user input is in Sinhala, Tamil, or English.
"""
import re


class LanguageService:
    # Unicode ranges for script detection
    SINHALA_RANGE = (0x0D80, 0x0DFF)
    TAMIL_RANGE = (0x0B80, 0x0BFF)
    
    def __init__(self):
        pass
    
    def detect_language(self, text: str) -> str:
        """
        Detect language of the input text.
        Returns: 'sinhala', 'tamil', or 'english'
        """
        if not text or not text.strip():
            return "english"
        
        sinhala_count = 0
        tamil_count = 0
        latin_count = 0
        total_chars = 0
        
        for char in text:
            code_point = ord(char)
            if not char.isspace() and not char.isdigit() and code_point > 32:
                total_chars += 1
                if self.SINHALA_RANGE[0] <= code_point <= self.SINHALA_RANGE[1]:
                    sinhala_count += 1
                elif self.TAMIL_RANGE[0] <= code_point <= self.TAMIL_RANGE[1]:
                    tamil_count += 1
                elif code_point < 128:
                    latin_count += 1
        
        
        if total_chars == 0:
            return "english"
        
        sinhala_ratio = sinhala_count / total_chars
        tamil_ratio = tamil_count / total_chars
        latin_ratio = latin_count / total_chars
        
        if sinhala_ratio > 0.3:
            return "sinhala"
        elif tamil_ratio > 0.3:
            return "tamil"
        else:
            return "english"
    
    def preprocess_query(self, query: str, language: str) -> str:
        """
        Preprocess query based on detected language.
        """
        # Basic cleanup
        query = query.strip()
        query = re.sub(r'\s+', ' ', query)
        
        # Remove excessive punctuation
        query = re.sub(r'[!?]{2,}', '?', query)
        
        return query
    
    def get_language_label(self, language: str) -> str:
        """Get display label for language."""
        labels = {
            "english": "English",
            "sinhala": "සිංහල",
            "tamil": "தமிழ்"
        }
        return labels.get(language, "English")
