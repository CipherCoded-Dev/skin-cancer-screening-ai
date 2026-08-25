"""
Aggregates all v1 endpoint routers into a single router
that main.py mounts under /api/v1.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import health, screen

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(screen.router, tags=["screen"])
