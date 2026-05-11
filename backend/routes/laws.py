"""
Laws API Route
Browse available legal documents.
"""
from fastapi import APIRouter, Request, HTTPException
from typing import Optional

router = APIRouter(tags=["laws"])


@router.get("/laws")
async def get_laws(
    request: Request,
    language: Optional[str] = None,
    limit: int = 50
):
    """
    Get available legal document chunks.
    """
    search_service = request.app.state.search_service
    
    chunks = search_service.get_all_chunks(
        language=language,
        limit=limit
    )
    
    return {
        "documents": chunks,
        "total": len(chunks)
    }


@router.get("/laws/{chunk_id}")
async def get_law_by_id(request: Request, chunk_id: str):
    """
    Get a specific legal document chunk by ID.
    """
    search_service = request.app.state.search_service
    
    chunk = search_service.get_chunk_by_id(chunk_id)
    
    if not chunk:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return chunk
