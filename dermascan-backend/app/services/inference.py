"""
Loads the trained model once at startup and runs prediction + risk tiering.
"""

import io

import torch
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms

from app.core.config import settings
from app.models.neural_net import load_model
from app.models.schemas import PredictionResult

_device = "cuda" if torch.cuda.is_available() else "cpu"
_model = None  # loaded lazily via get_model()

_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


def get_model():
    global _model
    if _model is None:
        _model = load_model(settings.MODEL_WEIGHTS_PATH, device=_device)
    return _model


def is_model_loaded() -> bool:
    return _model is not None


def _risk_tier_for_class(predicted_class: str) -> str:
    if predicted_class in settings.HIGH_RISK_CLASSES:
        return "High"
    if predicted_class in settings.MODERATE_RISK_CLASSES:
        return "Moderate"
    return "Low"


def predict(image_bytes: bytes) -> PredictionResult:
    model = get_model()

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    input_tensor = _transform(image).unsqueeze(0).to(_device)

    with torch.no_grad():
        logits = model(input_tensor)
        probs = F.softmax(logits, dim=1).squeeze(0).cpu()

    class_probabilities = {
        settings.CLASSES[i]: float(probs[i]) for i in range(len(settings.CLASSES))
    }
    predicted_idx = int(torch.argmax(probs))
    predicted_class = settings.CLASSES[predicted_idx]
    confidence = float(probs[predicted_idx])

    return PredictionResult(
        predicted_class=predicted_class,
        risk_tier=_risk_tier_for_class(predicted_class),
        confidence=confidence,
        class_probabilities=class_probabilities,
    )
