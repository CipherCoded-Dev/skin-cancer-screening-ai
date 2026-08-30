# 🔬 DermaScan AI — Backend Service

FastAPI backend service running the dermatological screening pipeline: image quality gating → deep learning inference (PyTorch EfficientNet-B0) → Grad-CAM explainability → clinical risk tiering.

---

## 🚀 Quickstart & Setup

### 1. Local Environment Setup

```bash
cd dermascan-backend
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Model Weights

Place the trained model checkpoint at:
```
weights/best_dermascan_efficientnet.onnx
weights/best_dermascan_efficientnet.onnx.data
```


### 3. Run Server Locally

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- Interactive OpenAPI Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/

---

## 📡 API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/` | Root service status and documentation link |
| GET | `/api/v1/health` | Health check verifying model loading and system status |
| POST | `/api/v1/screen` | Multipart image upload returning prediction, risk tier, confidence, and Grad-CAM heatmap |

---

## 🧠 Model Architecture & Risk Stratification

- **Backbone:** ONNX Runtime EfficientNet-B0 with a customized classifier head (`Dropout(0.3)` → `Linear(num_classes=7)`).
- **Explainability:** Integrated Grad-CAM layer extracting gradient activations from final convolutional blocks for visual heatmap overlay.

### Supported Classes (HAM10000)

| Class Code | Diagnosis | Clinical Risk Tier |
|---|---|---|
| mel | Melanoma | High |
| bcc | Basal cell carcinoma | High |
| akiec | Actinic keratoses | Moderate |
| nv | Melanocytic nevi (benign mole) | Low |
| bkl | Benign keratosis-like lesions | Low |
| df | Dermatofibroma | Low |
| vasc | Vascular lesions | Low |

---

## 🐳 Docker Containerization & Cloud Deployment

### Local Container Build & Run

```bash
docker build -t dermascan-backend .
docker run -p 10000:10000 -e PORT=10000 dermascan-backend
```

### Cloud Deployment Configuration (e.g. Render)

- **Runtime:** Docker
- **Environment:** Reads dynamic `$PORT` environment variable injected by the host platform (defaulting to 10000).
- **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

> Note: if deploying to Hugging Face Spaces instead, the platform expects the container to listen on port `7860` specifically — adjust the `EXPOSE` line in the Dockerfile and the start command port accordingly.
