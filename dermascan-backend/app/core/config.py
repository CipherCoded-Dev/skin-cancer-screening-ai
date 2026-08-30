"""
Central configuration: class labels, thresholds, paths, and runtime settings.
"""

import os
from pathlib import Path


class Settings:
    # --- Paths ---
    ROOT_DIR: Path = Path(__file__).resolve().parent.parent.parent
    DEFAULT_WEIGHTS_PATH: str = str(
        ROOT_DIR / "weights" / "best_dermascan_efficientnet.onnx"
    )

    MODEL_WEIGHTS_PATH: str = os.getenv("MODEL_WEIGHTS_PATH", DEFAULT_WEIGHTS_PATH)

    # Fallback to CPU on cloud container environments
    DEVICE: str = os.getenv("DEVICE", "cpu")

    # --- Model Classes (HAM10000 7-Class Alignment) ---
    CLASSES: list[str] = [
        "akiec",  # Actinic keratoses / intraepithelial carcinoma
        "bcc",    # Basal cell carcinoma
        "bkl",    # Benign keratosis-like lesions
        "df",     # Dermatofibroma
        "mel",    # Melanoma
        "nv",     # Melanocytic nevi (benign mole)
        "vasc",   # Vascular lesions
    ]

    # Risk Tiers
    HIGH_RISK_CLASSES: set[str] = {"mel", "bcc"}
    MODERATE_RISK_CLASSES: set[str] = {"akiec"}
    LOW_RISK_CLASSES: set[str] = {"nv", "bkl", "df", "vasc"}

    # --- Quality Gate Thresholds (OpenCV) ---
    BLUR_VARIANCE_THRESHOLD: float = 100.0  # Laplacian variance
    MIN_BRIGHTNESS: float = 40.0
    MAX_BRIGHTNESS: float = 220.0

    # --- CORS Configuration (Permit Frontend Access) ---
    CORS_ORIGINS: list[str] = ["*"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: list[str] = ["*"]
    CORS_ALLOW_HEADERS: list[str] = ["*"]


settings = Settings()