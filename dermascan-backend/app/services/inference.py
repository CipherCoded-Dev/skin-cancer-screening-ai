"""
Loads the trained ONNX model once at startup and runs prediction + risk tiering.
"""

import io
import numpy as np
import onnxruntime as ort
from PIL import Image

from app.core.config import settings
from app.models.schemas import PredictionResult

_session = None  # Loaded lazily via get_session()


def get_session():
    global _session
    if _session is None:
        # Load ONNX model with single-thread optimization for memory efficiency
        opts = ort.SessionOptions()
        opts.intra_op_num_threads = 1
        opts.inter_op_num_threads = 1
        _session = ort.InferenceSession(settings.MODEL_WEIGHTS_PATH, opts)
    return _session


def is_model_loaded() -> bool:
    return _session is not None


def _risk_tier_for_class(predicted_class: str) -> str:
    if predicted_class in settings.HIGH_RISK_CLASSES:
        return "High"
    if predicted_class in settings.MODERATE_RISK_CLASSES:
        return "Moderate"
    return "Low"


def _preprocess(image_bytes: bytes) -> np.ndarray:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224), Image.Resampling.BILINEAR)

    img_np = np.array(image, dtype=np.float32) / 255.0
    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
    img_np = (img_np - mean) / std
    img_np = np.transpose(img_np, (2, 0, 1))
    return np.expand_dims(img_np, axis=0)


def _softmax(x: np.ndarray) -> np.ndarray:
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum(axis=-1, keepdims=True)


def predict(image_bytes: bytes) -> PredictionResult:
    session = get_session()
    input_tensor = _preprocess(image_bytes)

    input_name = session.get_inputs()[0].name
    raw_logits = session.run(None, {input_name: input_tensor})[0]
    probs = _softmax(raw_logits[0])

    class_probabilities = {
        settings.CLASSES[i]: float(probs[i]) for i in range(len(settings.CLASSES))
    }
    predicted_idx = int(np.argmax(probs))
    predicted_class = settings.CLASSES[predicted_idx]
    confidence = float(probs[predicted_idx])

    return PredictionResult(
        predicted_class=predicted_class,
        risk_tier=_risk_tier_for_class(predicted_class),
        confidence=confidence,
        class_probabilities=class_probabilities,
    )