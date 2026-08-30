# 🔬 DermaScan AI

Smartphone-based skin lesion screening tool: an AI-assisted, explainable triage aid for regions where dermatologist access is scarce.

Capture a lesion photo → run an on-device quality check → get a 7-class, risk-tiered AI screening with a Grad-CAM explainability heatmap.

---

## What It Does

1. **Capture** — the user takes a photo of a skin lesion (or picks one from their gallery) via the mobile app.
2. **Quality Gate** — an OpenCV blur/lighting check runs before inference, rejecting unusable photos rather than silently mis-scoring them.
3. **Classification** — a fine-tuned EfficientNet-B0 model classifies the lesion into one of 7 standard dermoscopic categories and assigns a risk tier (Low / Moderate / High).
4. **Explainability** — a Grad-CAM heatmap highlights exactly which region of the lesion drove the prediction, so the result isn't a black box.
5. **Output** — the app displays the prediction, risk tier, confidence, full class probability breakdown, and the heatmap, alongside a clear non-diagnostic disclaimer.

---

## Key Technical Highlight: Data Leakage Correction

HAM10000 contains multiple photos of the same physical lesion. A naive random train/validation split can leak different photos of the same lesion across both sets, inflating reported accuracy. This project identified that issue and switched to a **lesion-grouped `GroupShuffleSplit`** (grouped by `lesion_id`), guaranteeing no lesion's photos appear in both sets.

This dropped the headline accuracy from a leaked **88.92%** down to an honest **80.48%** — but the corrected number reflects true performance on lesions the model has never seen, which is what matters for a real user's phone photo. Full write-up: [`docs/data_leakage_finding.md`](docs/data_leakage_finding.md).

**Final locked model metrics** (leakage-corrected, fine-tuned checkpoint):

| Metric | Value |
|---|---|
| Overall Accuracy | 80.48% |
| Macro ROC-AUC | 0.9631 |
| Melanoma (mel) Recall / Precision | 74.19% / 47.10% |
| BCC Recall / Precision | 84.85% / 69.14% |
| Akiec Recall / Precision | 50.00% / 58.54% |
| NV Recall / Precision | 85.83% / 94.27% |
| Malignant-Class Macro F1 | 62.58% |
| Malignant-Class Macro Recall | 69.68% |

---

## Architecture

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
Risk report displayed in-app
```

Full architecture notes: [`docs/architecture.md`](docs/architecture.md)

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile App | React Native (Expo) |
| Backend API | FastAPI (Python) |
| ML / Vision | PyTorch, torchvision (EfficientNet-B0), OpenCV, Grad-CAM |
| Datasets | HAM10000, ISIC Archive |
| Deployment (planned) | Docker via Hugging Face Spaces / Render |

## Project Structure

```
dermascan-ai/
├── dermascan-backend/   # FastAPI service — see dermascan-backend/README.md
├── mobile/              # Expo React Native app — see mobile/README.md
├── ml_training/          # training notebook + script (offline, not shipped)
├── docs/                 # architecture, data leakage write-up, disclaimers
└── tests/                # test stubs
```

## Setup

Each component has its own detailed setup guide:
- **Backend:** [`dermascan-backend/README.md`](dermascan-backend/README.md)
- **Mobile App:** [`mobile/README.md`](mobile/README.md)

## Non-Diagnostic Disclaimer

DermaScan AI is an assistive screening tool, not a medical diagnosis. It does not replace a licensed dermatologist. See [`docs/non_diagnostic_disclaimer.md`](docs/non_diagnostic_disclaimer.md).
