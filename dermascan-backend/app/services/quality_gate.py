"""
OpenCV-based image quality gate.

Rejects blurry or poorly-lit photos before they reach the model,
so a bad phone photo never produces a silently unreliable prediction.
This is one of the differentiators called out in the Phase 1 pitch —
keep it as its own testable module rather than folding it into inference.
"""

import cv2
import numpy as np

from app.core.config import settings
from app.models.schemas import QualityGateResult


def _bytes_to_cv2_image(image_bytes: bytes) -> np.ndarray:
    arr = np.frombuffer(image_bytes, dtype=np.uint8)
    return cv2.imdecode(arr, cv2.IMREAD_COLOR)


def _blur_score(gray_image: np.ndarray) -> float:
    """Higher variance of the Laplacian = sharper image."""
    return cv2.Laplacian(gray_image, cv2.CV_64F).var()


def _brightness_score(gray_image: np.ndarray) -> float:
    return float(np.mean(gray_image))


def check(image_bytes: bytes) -> QualityGateResult:
    image = _bytes_to_cv2_image(image_bytes)
    if image is None:
        return QualityGateResult(passed=False, reason="Could not decode image file.")

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    blur = _blur_score(gray)
    if blur < settings.BLUR_VARIANCE_THRESHOLD:
        return QualityGateResult(passed=False, reason="Image appears too blurry. Please retake in focus.")

    brightness = _brightness_score(gray)
    if brightness < settings.MIN_BRIGHTNESS:
        return QualityGateResult(passed=False, reason="Image is too dark. Please retake with better lighting.")
    if brightness > settings.MAX_BRIGHTNESS:
        return QualityGateResult(passed=False, reason="Image is overexposed. Please retake with less glare/light.")

    return QualityGateResult(passed=True)
