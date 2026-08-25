"""
Pydantic request/response models for the API.
"""

from typing import Dict, Optional

from pydantic import BaseModel


class ScreenResponse(BaseModel):
    predicted_class: str
    risk_tier: str  # "Low" | "Moderate" | "High"
    confidence: float
    class_probabilities: Dict[str, float]
    heatmap_base64: Optional[str] = None
    disclaimer: str


class QualityGateResult(BaseModel):
    passed: bool
    reason: Optional[str] = None


class PredictionResult(BaseModel):
    predicted_class: str
    risk_tier: str
    confidence: float
    class_probabilities: Dict[str, float]
