"""
DermaScan AI — FastAPI entrypoint.

Run locally with:
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings

app = FastAPI(
    title="DermaScan AI",
    description="Smartphone-based skin lesion screening API (assistive triage tool, not a diagnostic device).",
    version="0.1.0",
)

# Permit cross-origin requests from Expo, React Web/Vercel, and local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=getattr(settings, "CORS_ORIGINS", ["*"]),
    allow_credentials=getattr(settings, "CORS_ALLOW_CREDENTIALS", False),
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "service": "DermaScan AI",
        "status": "running",
        "docs": "/docs",
    }