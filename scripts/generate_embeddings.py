"""
Embedding Generation Script
Uses multilingual Sentence-BERT to generate embeddings and build FAISS index.
"""
import json
import os
import sys
import numpy as np

PROCESSED_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "processed")
EMBEDDINGS_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "embeddings")

# Model that supports Sinhala, Tamil, and English
MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"


def main():
    os.makedirs(EMBEDDINGS_DIR, exist_ok=True)
    
    # Load chunks
    chunks_path = os.path.join(PROCESSED_DIR, "chunks.json")
    if not os.path.exists(chunks_path):
        print("ERROR: chunks.json not found. Run chunk_documents.py first.")
        return
    
    with open(chunks_path, "r", encoding="utf-8") as f:
        chunks = json.load(f)
    
    print(f"Loaded {len(chunks)} chunks")
    
    # Load model
    print(f"Loading model: {MODEL_NAME}")
    print("(This may take a few minutes on first run as the model downloads...)")
    
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer(MODEL_NAME)
    
    # Generate embeddings
    texts = [chunk["text"] for chunk in chunks]
    print(f"Generating embeddings for {len(texts)} chunks...")
    
    embeddings = model.encode(
        texts,
        show_progress_bar=True,
        batch_size=32,
        normalize_embeddings=True
    )
    
    print(f"Embedding shape: {embeddings.shape}")
    
    # Build FAISS index
    print("Building FAISS index...")
    import faiss
    
    dimension = embeddings.shape[1]
    
    # Use IndexFlatIP for cosine similarity (since embeddings are normalized)
    index = faiss.IndexFlatIP(dimension)
    
    # Add embeddings to index
    embeddings_np = np.array(embeddings, dtype=np.float32)
    index.add(embeddings_np)
    
    print(f"FAISS index built with {index.ntotal} vectors of dimension {dimension}")
    
    # Save FAISS index
    index_path = os.path.join(EMBEDDINGS_DIR, "legal_index.faiss")
    faiss.write_index(index, index_path)
    print(f"FAISS index saved to: {index_path}")
    
    # Save chunk IDs mapping (maps FAISS index position to chunk ID)
    chunk_ids = [chunk["id"] for chunk in chunks]
    mapping_path = os.path.join(EMBEDDINGS_DIR, "chunk_mapping.json")
    with open(mapping_path, "w", encoding="utf-8") as f:
        json.dump(chunk_ids, f, indent=2)
    print(f"Chunk mapping saved to: {mapping_path}")
    
    # Save embeddings as numpy array (backup)
    embeddings_path = os.path.join(EMBEDDINGS_DIR, "embeddings.npy")
    np.save(embeddings_path, embeddings_np)
    print(f"Embeddings saved to: {embeddings_path}")
    
    # Quick test
    print("\n--- Quick Search Test ---")
    test_query = "fundamental rights of citizens"
    query_embedding = model.encode([test_query], normalize_embeddings=True)
    query_embedding = np.array(query_embedding, dtype=np.float32)
    
    scores, indices = index.search(query_embedding, 3)
    
    print(f"Query: '{test_query}'")
    print(f"Top 3 results:")
    for i, (score, idx) in enumerate(zip(scores[0], indices[0])):
        chunk = chunks[idx]
        preview = chunk["text"][:150].replace("\n", " ")
        print(f"  {i+1}. Score: {score:.4f} | {chunk['language']} | Page {chunk['page_number']}")
        print(f"     {preview}...")
    
    print("\nDone! Embeddings and FAISS index are ready.")


if __name__ == "__main__":
    main()
