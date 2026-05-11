"""
PDF Text Extraction Script
Extracts text from Sri Lankan Constitution PDFs using PyMuPDF
"""
import fitz  # PyMuPDF
import json
import os
import re
import sys

# Paths
RAW_DOCS_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "raw_docs")
PROCESSED_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "processed")


def extract_text_from_pdf(pdf_path):
    """Extract all text from a PDF file."""
    doc = fitz.open(pdf_path)
    pages = []
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        if text.strip():
            pages.append({
                "page_number": page_num + 1,
                "text": text.strip()
            })
    doc.close()
    return pages


def clean_text(text):
    """Clean extracted text."""
    # Remove excessive whitespace
    text = re.sub(r'\n{3,}', '\n\n', text)
    # Remove page numbers that appear alone
    text = re.sub(r'^\d+\s*$', '', text, flags=re.MULTILINE)
    # Remove excessive spaces
    text = re.sub(r' {2,}', ' ', text)
    return text.strip()


def process_pdf(pdf_filename, language):
    """Process a single PDF and return extracted data."""
    pdf_path = os.path.join(RAW_DOCS_DIR, pdf_filename)
    
    if not os.path.exists(pdf_path):
        print(f"WARNING: File not found: {pdf_path}")
        return None
    
    print(f"Extracting text from: {pdf_filename}")
    pages = extract_text_from_pdf(pdf_path)
    
    # Clean text
    for page in pages:
        page["text"] = clean_text(page["text"])
        page["language"] = language
        page["source_file"] = pdf_filename
    
    print(f"  Extracted {len(pages)} pages")
    return pages


def main():
    os.makedirs(PROCESSED_DIR, exist_ok=True)
    
    # Define PDFs to process
    pdfs = [
        {"filename": "constitution.pdf", "language": "english"}
    ]
    
    all_pages = []
    
    for pdf_info in pdfs:
        pages = process_pdf(pdf_info["filename"], pdf_info["language"])
        if pages:
            all_pages.extend(pages)
    
    # Save extracted text
    output_path = os.path.join(PROCESSED_DIR, "extracted_pages.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(all_pages, f, ensure_ascii=False, indent=2)
    
    print(f"\nTotal pages extracted: {len(all_pages)}")
    print(f"Saved to: {output_path}")
    
    return all_pages


if __name__ == "__main__":
    main()
