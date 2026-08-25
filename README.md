# 🔬 DermaScan AI
### Smartphone-Based Skin Lesion Screening & Triage

**Team Name:** Khushbuchandra2161
**Team Lead:** Khushbu
**Track:** Omni_BioTech_12 — Smartphone-Based Skin Cancer Screening (OMNIKON National Hackathon 2026)
**Status:** Phase 2 — In Progress

---

## Problem Statement

Dermatologists are scarce relative to population, delaying detection of skin conditions including cancers. DermaScan AI is an AI-assisted tool that helps flag suspicious skin lesions from smartphone images for further evaluation — giving users in dermatologist-scarce areas an immediate, low-cost first opinion instead of a weeks-long wait.

## What It Does

1. **Capture** — user takes a photo of a skin lesion (or picks one from their gallery) via the mobile app.
2. **Quality Gate** — an OpenCV blur/lighting check runs before inference, rejecting unusable photos rather than silently mis-scoring them.
3. **Classification** — a fine-tuned EfficientNet-B0 model classifies the lesion into one of 7 standard dermoscopic categories and assigns a risk tier (Low / Moderate / High).
4. **Explainability** — a Grad-CAM heatmap highlights exactly which region of the lesion drove the prediction, so the result isn't a black box.
5. **Output** — the app displays the prediction, risk tier, confidence, full class probability breakdown, and the heatmap, alongside a clear non-diagnostic disclaimer.

## Key Technical Highlight: Data Leakage Correction

HAM10000 contains multiple photos of the same physical lesion. A naive random train/validation split can leak different photos of the same lesion across both sets, inflating reported accuracy. We identified this and switched to a **lesion-grouped `GroupShuffleSplit`** (grouped by `lesion_id`), guaranteeing no lesion's photos appear in both sets.

This dropped our headline accuracy from a leaked **88.92%** down to an honest **80.48%** — but the corrected number reflects true performance on lesions the model has never seen, which is what actually matters for a real user's phone photo. Full write-up: [`docs/data_leakage_finding.md`](docs/data_leakage_finding.md).

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

Quick start (backend):
```bash
cd dermascan-backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Quick start (mobile):
```bash
cd mobile
npm install
npx expo start
```

## Progress So Far (Phase 2)

- ✅ Model trained, evaluated, and leakage-corrected (see metrics above)
- ✅ FastAPI backend built: quality gate, inference, Grad-CAM, risk tiering
- ✅ Expo mobile app built: camera capture, gallery import, live screening flow, results screen with heatmap + probability breakdown
- ✅ End-to-end flow tested (phone camera → backend → results)
- ⬜ PDF export for doctors (backend endpoint not yet built)
- ⬜ Public deployment (planned for Final Submission phase, via Hugging Face Spaces)

## Challenges Faced

- **Data leakage in the initial split** inflated early accuracy numbers; caught and corrected via lesion-grouped splitting (see above).
- **Checkpoint-saving bug** during initial fine-tuning meant several epochs silently didn't improve the saved best model — resolved by re-verifying the saved checkpoint against the actual best-scoring epoch.
- **Class imbalance** (nv makes up the majority of HAM10000) — addressed with Focal Loss and sqrt-inverse-frequency class weighting rather than full 'balanced' weighting, which was found to overcorrect.
- **Local network connectivity** between phone and backend during development, worked around using ngrok tunneling; permanent fix planned via cloud deployment.

## Future Roadmap

- Deploy backend to Hugging Face Spaces / Render for a permanent public endpoint (Final Submission)
- Build PDF export endpoint for doctor-ready reports
- Expand training data / consider test-time augmentation to improve akiec and melanoma precision
- Add automated tests for quality gate, inference, and API endpoints

## Non-Diagnostic Disclaimer

DermaScan AI is an assistive screening tool, not a medical diagnosis. It does not replace a licensed dermatologist. See [`docs/non_diagnostic_disclaimer.md`](docs/non_diagnostic_disclaimer.md).

## Reviewer Notes

This is a Phase 2 progress submission. The mobile app and backend are both functional and have been tested end-to-end locally. Public deployment is planned for the Final Submission round per the hackathon's phased requirements.
