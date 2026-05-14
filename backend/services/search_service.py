"""
Search Service
Handles FAISS vector search and Sentence-BERT encoding.
"""
import json
import os
# pyrefly: ignore [missing-import]
import numpy as np


class SearchService:
    def __init__(self, embeddings_dir: str, processed_dir: str):
        self.embeddings_dir = embeddings_dir
        self.processed_dir = processed_dir
        self.index = None
        self.chunks = None
        self.chunk_mapping = None
        self.model = None
        self.model_name = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    
    def load(self):
        """Load FAISS index, chunks, and SBERT model."""
        # pyrefly: ignore [missing-import]
        import faiss
        # pyrefly: ignore [missing-import]
        from sentence_transformers import SentenceTransformer
        
        # Load FAISS index
        index_path = os.path.join(self.embeddings_dir, "legal_index.faiss")
        if not os.path.exists(index_path):
            raise FileNotFoundError(
                f"FAISS index not found at {index_path}. "
                "Run scripts/generate_embeddings.py first."
            )
        
        self.index = faiss.read_index(index_path)
        print(f"  [OK] FAISS index loaded: {self.index.ntotal} vectors")
        
        # Load chunk mapping
        mapping_path = os.path.join(self.embeddings_dir, "chunk_mapping.json")
        with open(mapping_path, "r", encoding="utf-8") as f:
            self.chunk_mapping = json.load(f)
        print(f"  [OK] Chunk mapping loaded: {len(self.chunk_mapping)} entries")
        
        # Load chunks
        chunks_path = os.path.join(self.processed_dir, "chunks.json")
        with open(chunks_path, "r", encoding="utf-8") as f:
            chunks_list = json.load(f)
        # Create lookup by ID
        self.chunks = {chunk["id"]: chunk for chunk in chunks_list}
        print(f"  [OK] Chunks loaded: {len(self.chunks)} documents")
        
        # Load SBERT model
        print(f"  Loading SBERT model: {self.model_name}")
        self.model = SentenceTransformer(self.model_name)
        print(f"  [OK] SBERT model loaded")
    
    def search(self, query: str, top_k: int = 5, language_filter: str = None):
        """
        Search for relevant legal documents.
        
        Args:
            query: User's search query
            top_k: Number of results to return
            language_filter: Optional language filter ('english', 'sinhala')
        
        Returns:
            List of search results with scores
        """
        # Encode query
        query_embedding = self.model.encode(
            [query],
            normalize_embeddings=True
        )
        query_embedding = np.array(query_embedding, dtype=np.float32)
        
        # Search FAISS (get more results if filtering)
        search_k = top_k * 3 if language_filter else top_k
        scores, indices = self.index.search(query_embedding, search_k)
        
        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx < 0:  # FAISS returns -1 for empty slots
                continue
            
            chunk_id = self.chunk_mapping[idx]
            chunk = self.chunks.get(chunk_id)
            
            if chunk is None:
                continue
            
            # Apply language filter
            if language_filter and chunk["language"] != language_filter:
                continue
            
            results.append({
                "id": chunk["id"],
                "text": chunk["text"],
                "score": float(score),
                "language": chunk["language"],
                "source_file": chunk["source_file"],
                "page_number": chunk["page_number"],
                "article_number": chunk.get("article_number"),
                "chapter": chunk.get("chapter"),
                "category": chunk.get("category", "constitution")
            })
            
            if len(results) >= top_k:
                break
        
        return results
    
    def get_all_chunks(self, language: str = None, limit: int = 50):
        """Get all chunks, optionally filtered by language."""
        chunks_list = list(self.chunks.values())
        
        if language:
            chunks_list = [c for c in chunks_list if c["language"] == language]
        
        return chunks_list[:limit]
    
    def get_chunk_by_id(self, chunk_id: str):
        """Get a specific chunk by ID."""
        return self.chunks.get(chunk_id)
