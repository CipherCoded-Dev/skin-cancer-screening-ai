"""
EfficientNet-B0 architecture - matches the exact class used in training
(training_pipeline.ipynb, Cell 3: DermaEfficientNet).

IMPORTANT: This must match the trained architecture exactly, including
the Sequential(Dropout, Linear) classifier head and the manual forward
pass, or best_dermascan_efficientnet.pth will fail to load with a
state_dict key mismatch.
"""

import torch
import torch.nn as nn
from torchvision import models

from app.core.config import settings

NUM_CLASSES = len(settings.CLASSES)


class DermaEfficientNet(nn.Module):
    """
    EfficientNet-B0 backbone with a Dropout + Linear classifier head,
    plus manual forward-pass hooks that capture activations and
    gradients on the last conv feature map - used by gradcam.py to
    compute Grad-CAM heatmaps.
    """

    def __init__(self, num_classes: int = NUM_CLASSES, pretrained: bool = False):
        super().__init__()
        self.backbone = models.efficientnet_b0(
            weights=models.EfficientNet_B0_Weights.DEFAULT if pretrained else None
        )
        in_features = self.backbone.classifier[1].in_features
        self.backbone.classifier = nn.Sequential(
            nn.Dropout(p=0.3, inplace=True),
            nn.Linear(in_features, num_classes),
        )

        # Populated during forward()/backward() for Grad-CAM.
        self.gradients = None
        self.activations = None
        self._hook = None

    def forward(self, x):
        x = self.backbone.features(x)
        self.activations = x

        if x.requires_grad:
            if self._hook is not None:
                self._hook.remove()
            self._hook = x.register_hook(lambda g: setattr(self, "gradients", g))

        x = self.backbone.avgpool(x)
        x = torch.flatten(x, 1)
        return self.backbone.classifier(x)


# Alias so any code referring to the old name "DermaScanNet" still
# resolves to the correct, matching architecture.
DermaScanNet = DermaEfficientNet


def load_model(weights_path: str, device: str = "cpu") -> DermaEfficientNet:
    """Instantiate the architecture and load trained weights."""
    model = DermaEfficientNet(pretrained=False)
    state_dict = torch.load(weights_path, map_location=device)
    model.load_state_dict(state_dict)
    model.to(device)
    model.eval()
    return model