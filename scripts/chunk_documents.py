"""
Document Chunking Script
Splits extracted legal text into searchable chunks with metadata.
"""
import json
import os
import re
import hashlib

PROCESSED_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "processed")


def generate_chunk_id(text, source, index):
    """Generate a unique ID for a chunk."""
    content = f"{source}_{index}_{text[:50]}"
    return hashlib.md5(content.encode()).hexdigest()[:12]


def detect_article_info(text, language):
    """Try to extract article/chapter info from text."""
    info = {
        "article_number": None,
        "chapter": None,
        "title": None
    }
    
    if language == "english":
        # Match "Article 12" or "ARTICLE 12"
        article_match = re.search(r'[Aa]rticle\s+(\d+[A-Za-z]*)', text)
        if article_match:
            info["article_number"] = article_match.group(1)
        
        # Match "CHAPTER III" or "Chapter 3"
        chapter_match = re.search(r'[Cc]hapter\s+([IVXLCDM]+|\d+)', text)
        if chapter_match:
            info["chapter"] = chapter_match.group(1)
    
    elif language == "sinhala":
        # Match Sinhala article patterns
        article_match = re.search(r'(\d+)\s*වන\s*ව්‍යවස්ථාව', text)
        if article_match:
            info["article_number"] = article_match.group(1)
    
    return info


def chunk_text(text, chunk_size=500, overlap=100):
    """Split text into overlapping chunks by sentences."""
    # Split by sentences (period followed by space or newline)
    sentences = re.split(r'(?<=[.!?])\s+|\n\n+', text)
    
    chunks = []
    current_chunk = []
    current_length = 0
    
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
        
        sentence_length = len(sentence.split())
        
        if current_length + sentence_length > chunk_size and current_chunk:
            # Save current chunk
            chunk_text_str = " ".join(current_chunk)
            if len(chunk_text_str.split()) >= 20:  # Minimum 20 words
                chunks.append(chunk_text_str)
            
            # Keep overlap
            overlap_words = []
            overlap_count = 0
            for s in reversed(current_chunk):
                words = s.split()
                if overlap_count + len(words) <= overlap:
                    overlap_words.insert(0, s)
                    overlap_count += len(words)
                else:
                    break
            
            current_chunk = overlap_words
            current_length = overlap_count
        
        current_chunk.append(sentence)
        current_length += sentence_length
    
    # Don't forget the last chunk
    if current_chunk:
        chunk_text_str = " ".join(current_chunk)
        if len(chunk_text_str.split()) >= 20:
            chunks.append(chunk_text_str)
    
    return chunks


def process_pages(pages_data):
    """Process extracted pages into chunks with metadata."""
    all_chunks = []
    chunk_index = 0
    
    for page in pages_data:
        text = page["text"]
        language = page["language"]
        source = page["source_file"]
        page_num = page["page_number"]
        
        # Get article/chapter info
        article_info = detect_article_info(text, language)
        
        # Chunk the text
        chunks = chunk_text(text)
        
        for chunk in chunks:
            # Get chunk-level article info (may be more specific)
            chunk_article = detect_article_info(chunk, language)
            
            chunk_data = {
                "id": generate_chunk_id(chunk, source, chunk_index),
                "text": chunk,
                "language": language,
                "source_file": source,
                "page_number": page_num,
                "article_number": chunk_article["article_number"] or article_info["article_number"],
                "chapter": chunk_article["chapter"] or article_info["chapter"],
                "word_count": len(chunk.split()),
                "category": "constitution"
            }
            
            all_chunks.append(chunk_data)
            chunk_index += 1
    
    return all_chunks


def main():
    # Load extracted pages
    pages_path = os.path.join(PROCESSED_DIR, "extracted_pages.json")
    
    if not os.path.exists(pages_path):
        print("ERROR: extracted_pages.json not found. Run extract_pdf.py first.")
        return
    
    with open(pages_path, "r", encoding="utf-8") as f:
        pages_data = json.load(f)
    
    print(f"Loaded {len(pages_data)} pages")
    
    # Process into chunks
    chunks = process_pages(pages_data)
    
    print(f"Created {len(chunks)} chunks")
    
    # Stats
    en_chunks = [c for c in chunks if c["language"] == "english"]
    si_chunks = [c for c in chunks if c["language"] == "sinhala"]
    ta_chunks = [c for c in chunks if c["language"] == "tamil"]
    print(f"  English chunks: {len(en_chunks)}")
    print(f"  Sinhala chunks: {len(si_chunks)}")
    print(f"  Tamil chunks: {len(ta_chunks)}")
    
    avg_words = sum(c["word_count"] for c in chunks) / len(chunks) if chunks else 0
    print(f"  Average words per chunk: {avg_words:.0f}")
    
    # Save chunks
    output_path = os.path.join(PROCESSED_DIR, "chunks.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)
    
    print(f"\nSaved to: {output_path}")


if __name__ == "__main__":
    main()
