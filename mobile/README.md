# 📱 DermaScan AI — Mobile & Web Client (Expo)

Cross-platform client interface built with React Native and Expo for skin lesion capture, immediate inference display, and visual Grad-CAM exploration.

---

## 🚀 Quickstart & Setup

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Start Development Server

```bash
npx expo start
```

- **Web:** Press `w` to open in browser.
- **Physical Phone (iOS/Android):** Scan the terminal QR code using the Expo Go app.
- **Emulator:** Press `a` (Android) or `i` (iOS simulator).

---

## ⚙️ Configuration

### API Endpoint Connection

Open `constants/theme.js` to point to your target backend:

**Cloud Deployment (Production):**
```javascript
export const API_BASE_URL = "https://your-backend-url.example.com";
```

**Local Testing on Physical Device:**
```javascript
export const API_BASE_URL = "http://<YOUR_LOCAL_LAN_IP>:8000";
```

---

## 📦 Features Implemented

- **Scanner Screen:** Image capture interface with alignment reticle and local camera-roll picker.
- **Inference Results:** Displays triage risk badge (High, Moderate, Low), predicted category, and confidence breakdown.
- **Visual Explainability:** Interactive toggle comparing the raw uploaded lesion against the Grad-CAM saliency heatmap.
- **Scan History:** Locally persisted history of past scans with thumbnail, timestamp, and risk tier.
- **Onboarding:** First-launch walkthrough explaining the capture → screening → explainability flow.
- **Responsible AI Disclaimer:** Built-in clinical notice emphasizing assistive triage functionality.

---

## 🌐 Web Deployment (Vercel)

The client is configured for static web export using Expo Web and Vercel:

```bash
# Generate static production web export
npm run build:web
```

- **Build Command:** `npx expo export -p web`
- **Output Directory:** `dist`
- Single Page App (SPA) routing rules are pre-configured in `vercel.json`.