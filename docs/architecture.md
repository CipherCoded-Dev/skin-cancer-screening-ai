# DermaScan AI — System Architecture

## Pipeline

```
Capture photo on phone
        │
        ▼
OpenCV quality gate (blur / lighting check)
        │
        ▼
CNN inference → 7-class + risk tier
        │
        ▼
Grad-CAM heatmap overlay
        │
        ▼
Risk report + PDF export for doctor
```

## Technologies

- **Mobile app:** Flutter / React Native (camera capture, results UI)
- **Backend:** FastAPI (Python), async REST endpoint
- **ML:** PyTorch, EfficientNet-B0, Grad-CAM
- **Preprocessing:** OpenCV, Albumentations
- **Training data:** HAM10000, ISIC Archive
- **Hosting:** Docker on Hugging Face Spaces / Render (free tier)

## Risk tiering

| Risk Tier | Classes                  |
|-----------|---------------------------|
| High      | mel, bcc, akiec           |
| Moderate  | bkl, vasc                 |
| Low       | nv, df                    |

## Model evaluation notes

See `data_leakage_finding.md` for the lesion-level data leakage issue
found and corrected during training, and the resulting honest metrics.
