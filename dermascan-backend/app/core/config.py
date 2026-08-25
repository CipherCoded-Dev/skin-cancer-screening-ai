"""
Central configuration: class labels, thresholds, and paths.
Keep environment-specific values (ports, hosts, secrets) here too,
loaded from env vars once you deploy.
"""

import os


class Settings:
    # --- Paths ---
    MODEL_WEIGHTS_PATH: str = os.getenv(
        "MODEL_WEIGHTS_PATH",
        os.path.join(os.path.dirname(__file__), "..", "..", "weights", "best_dermascan_efficientnet.pth"),
    )

    # --- Model classes ---
    # HAM10000's 7 standard dermoscopic categories, in the order your
    # training pipeline used (double-check this matches your notebook's
    # label encoding before relying on it).
    CLASSES = [
        "akiec",  # Actinic keratoses / intraepithelial carcinoma
        "bcc",    # Basal cell carcinoma
        "bkl",    # Benign keratosis-like lesions
        "df",     # Dermatofibroma
        "mel",    # Melanoma
        "nv",     # Melanocytic nevi (benign mole)
        "vasc",   # Vascular lesions
    ]

    # Risk tiers - matches RISK_TIER dict in training_pipeline.ipynb exactly.
    HIGH_RISK_CLASSES = {"mel", "bcc"}
    MODERATE_RISK_CLASSES = {"akiec"}
    LOW_RISK_CLASSES = {"nv", "bkl", "df", "vasc"}

    # --- Quality gate thresholds ---
    BLUR_VARIANCE_THRESHOLD: float = 100.0  # Laplacian variance; tune empirically
    MIN_BRIGHTNESS: float = 40.0
    MAX_BRIGHTNESS: float = 220.0


settings = Settings()