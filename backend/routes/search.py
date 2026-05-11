"""
Search API Route
Direct legal document search endpoint.
"""
from fastapi import APIRouter, Request
from pydantic import BaseModel, Field
from typing import Optional

router = APIRouter(tags=["search"])


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000)
    top_k: Optional[int] = Field(10, ge=1, le=50)
    language: Optional[str] = Field(None, description="Filter by language")


@router.post("/search")
async def search(request: Request, body: SearchRequest):
    """
    Search legal documents using semantic similarity.
    """
    search_service = request.app.state.search_service
    
    results = search_service.search(
        query=body.query,
        top_k=body.top_k or 10,
        language_filter=body.language
    )
    
    return {
        "query": body.query,
        "results": results,
        "total": len(results)
    }
