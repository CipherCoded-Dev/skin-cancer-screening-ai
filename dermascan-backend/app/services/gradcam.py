"""
Grad-CAM heatmap generation for explainability.

Matches the exact approach used in training_pipeline.ipynb (Cell 7):
the model's forward() stores the last conv feature map and registers a
backward hook to capture its gradient, both directly on the model
object (model.activations / model.gradients) - not via an external
register_forward_hook on a separate target_layer.

Reference: Selvaraju et al., "Grad-CAM: Visual Explanations from Deep
Networks via Gradient-based Localization."
"""

import base64
import io

import cv2
import numpy as np
import torch
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms

from app.core.config import settings
from app.services.inference import get_model, _device

_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


def generate_heatmap(image_bytes: bytes, predicted_class: str) -> str:
    """
    Runs a forward + backward pass to compute Grad-CAM for the predicted
    class, overlays it on the original image, and returns base64 PNG.
    """
    model = get_model()
    class_idx = settings.CLASSES.index(predicted_class)

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    input_tensor = _transform(image).unsqueeze(0).to(_device)
    input_tensor.requires_grad_(True)

    model.zero_grad()
    output = model(input_tensor)
    output[0, class_idx].backward()

    # model.activations / model.gradients are populated by the model's
    # own forward() hook (see app/models/neural_net.py).
    weights = model.gradients[0].detach().cpu().numpy().mean(axis=(1, 2))  # (C,)
    activations = model.activations[0].detach().cpu().numpy()              # (C, H, W)

    cam = np.maximum(np.tensordot(weights, activations, axes=([0], [0])), 0)
    cam = cv2.resize(cam, (224, 224))
    cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)

    original = np.array(image.resize((224, 224)))
    heatmap = cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET)
    heatmap_rgb = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)
    overlay = np.uint8(0.6 * original + 0.4 * heatmap_rgb)

    overlay_img = Image.fromarray(overlay)
    buffer = io.BytesIO()
    overlay_img.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")