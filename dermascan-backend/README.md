# DermaScan AI — Backend

FastAPI service that runs the skin lesion screening pipeline: quality gate → inference → Grad-CAM → risk tiering.

## Setup

```bash
cd dermascan-backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Place your trained checkpoint at:
```
weights/best_dermascan_efficientnet.pth
```

Run the server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Important:** use `--host 0.0.0.0`, not the default `127.0.0.1` — otherwise the server only accepts connections from the same machine, and the mobile app (running on a phone or emulator) won't be able to reach it.

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/` | Basic status check |
| GET | `/api/v1/health` | Confirms the server is up and the model loaded successfully |
| POST | `/api/v1/screen` | Upload a lesion image, get back prediction + risk tier + Grad-CAM heatmap |

Interactive API docs available at `http://localhost:8000/docs` once running.

## Model Architecture

`app/models/neural_net.py` defines `DermaEfficientNet` — an EfficientNet-B0 backbone with a `Sequential(Dropout(0.3), Linear)` classifier head, and a manual forward pass that captures activations/gradients for Grad-CAM. This must exactly match the architecture used during training (`ml_training/notebooks/`) or the checkpoint will fail to load with a state_dict mismatch.

## Class Labels & Risk Tiers

7 dermoscopic classes (from HAM10000), with risk tiers as used during training:

| Class | Meaning | Risk Tier |
|---|---|---|
| mel | Melanoma | High |
| bcc | Basal cell carcinoma | High |
| akiec | Actinic keratoses | Moderate |
| nv | Melanocytic nevi (benign mole) | Low |
| bkl | Benign keratosis-like lesions | Low |
| df | Dermatofibroma | Low |
| vasc | Vascular lesions | Low |

## Docker

```bash
docker build -t dermascan-backend .
docker run -p 8000:8000 -v $(pwd)/weights:/app/weights dermascan-backend
```

## Known Gaps

- `POST /api/v1/export-report` (PDF doctor report) is not yet implemented — `pdf_generator.py` exists as the underlying logic, but no endpoint currently wraps it.
- No live deployment yet — currently tested via local network / ngrok tunnel during development. Planned for Hugging Face Spaces deployment ahead of Final Submission.
