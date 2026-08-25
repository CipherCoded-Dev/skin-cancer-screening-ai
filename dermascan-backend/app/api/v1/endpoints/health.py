"""
GET /health — basic liveness/readiness probe.

Useful for confirming the model weights loaded correctly before
you point the mobile app (or a judge's demo) at this server.
"""

from fastapi import APIRouter

from app.services import inference

router = APIRouter()


@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "model_loaded": inference.is_model_loaded(),
    }
