# 🔬 DermaScan AI — Intelligent Skin Lesion Screening & Explainability

DermaScan AI is a full-stack, AI-powered assistive screening application designed to analyze skin lesions across 7 dermoscopic diagnostic categories using deep learning. Built for fast edge/web inference, it combines a lightweight ONNX Runtime backend with an interactive cross-platform frontend (Expo/React Native), providing instant risk classification alongside visual Grad-CAM interpretability.

> **Disclaimer:** *DermaScan AI is an assistive research and educational screening tool, not a certified medical diagnosis. Always consult a board-certified dermatologist for clinical evaluations.*

---

## Key Features

- **7-Class Diagnostic Classification:** Aligned with the HAM10000 dataset standard:
  - Melanoma (`MEL`)
  - Melanocytic Nevi (`NV`)
  - Basal Cell Carcinoma (`BCC`)
  - Actinic Keratoses / Intraepithelial Carcinoma (`AKIEC`)
  - Benign Keratosis (`BKL`)
  - Dermatofibroma (`DF`)
  - Vascular Lesions (`VASC`)
- **Triage Risk Stratification:** Categorizes predictions into actionable risk tiers (**Low**, **Moderate**, **High**).
- **Visual Explainability (Grad-CAM):** Generates activation heatmaps highlighting the exact lesion regions driving the prediction.
- **Ultra-Lightweight ONNX Inference:** Migrated from standard PyTorch to **ONNX Runtime**, slashing RAM consumption (<120MB) to easily run on free/constrained cloud tiers (e.g., Render 512MB RAM).
- **Cross-Platform Interface:** Fully responsive web and mobile application built with Expo / React Native Web.
- **Rigorous Model Evaluation:** Trained with a lesion-grouped train/validation split (`GroupShuffleSplit` on `lesion_id`) to eliminate data leakage between duplicate lesion photos — a common but overlooked pitfall on HAM10000.

---

## Architecture & Tech Stack

### Frontend
- **Framework:** Expo SDK / React Native (Web, iOS, Android)
- **Deployment:** Vercel
- **Styling & Components:** React Native Web, Lucide Icons, Expo Vector Icons

### Backend & Inference Engine
- **API Framework:** FastAPI (Python 3.10+)
- **Model Architecture:** EfficientNet-B0
- **Runtime:** ONNX Runtime (`onnxruntime`)
- **Deployment:** Render (Dockerized Web Service)
- **Image Processing:** Pillow, OpenCV (`opencv-python-headless`), NumPy

---

## Project Structure

```text
dermascan-ai/
├── dermascan-backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI application entrypoint & CORS
│   │   ├── config.py                # Environment configuration
│   │   ├── models/
│   │   │   ├── neural_net.py        # Model architecture & weight loader
│   │   │   └── schemas.py           # Pydantic request/response schemas
│   │   └── services/
│   │       ├── inference.py         # ONNX Runtime preprocessing & scoring
│   │       └── gradcam.py           # Grad-CAM heatmap visualization
│   ├── weights/
│   │   ├── best_dermascan_efficientnet.onnx       # Optimized ONNX model graph
│   │   └── best_dermascan_efficientnet.onnx.data  # Model weight parameters
│   ├── Dockerfile                   # Production container definition
│   └── requirements.txt             # Lightweight backend dependencies
│
└── mobile/
    ├── assets/                      # App icons and splash assets
    ├── constants/
    │   └── theme.js                 # Global styles, palette & API endpoints
    ├── src/
    │   ├── screens/                 # ScannerScreen, ResultScreen, HistoryScreen, OnboardingScreen
    │   ├── components/              # UI elements & Grad-CAM heatmap viewer
    │   └── services/
    │       └── api.js               # Cross-platform fetch & FormData pipeline
    ├── app.json                     # Expo configuration
    └── package.json                 # Web & mobile dependencies
```

---

## Getting Started Locally

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

### 2. Backend Setup
```bash
cd dermascan-backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start local FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
The API documentation will be accessible at `http://localhost:8000/docs`.

### 3. Frontend Setup
```bash
cd ../mobile

# Install dependencies
npm install

# Start the Expo development server
npx expo start
```
- Press `w` to open in your default web browser.
- Scan the QR code with the Expo Go app to test on physical iOS/Android devices.

---

## Production Deployments

| Component | Platform | URL |
|---|---|---|
| Frontend (Expo Web) | Vercel | `https://skin-cancer-screening-6fqk23qrd-ciphercoded-devs-projects.vercel.app/` |
| Backend API | Render | `https://dermascan-ai-backend-app.onrender.com/` |

---

## Security & Privacy

- Images uploaded for screening are processed in memory and are not persisted to disk or remote storage databases.
- CORS policies are strictly configured for authenticated cross-origin frontend communication.

---

## License

This project is licensed under the MIT License — see the `LICENSE` file for details.
