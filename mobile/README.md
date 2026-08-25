# DermaScan AI - Mobile App (Expo)

## Setup

```bash
cd mobile
npm install
npx expo start
```

Scan the QR code with the Expo Go app on your phone (same WiFi network as your laptop), or press `a`/`i` in the terminal for an Android/iOS emulator.

## Before running - required changes

1. **Update the API base URL.** Open `constants/theme.js` and change:
   ```js
   export const API_BASE_URL = "http://192.168.1.42:8000"; // <-- CHANGE THIS
   ```
   to your laptop's actual LAN IP (find it with `ipconfig` on Windows or `ifconfig | grep "inet "` on Mac/Linux). `localhost` will NOT work when testing on a physical phone, since it refers to the phone itself.

2. **Add real icon/splash assets.** The `assets/` folder needs actual PNG files:
   - `icon.png` (1024x1024)
   - `adaptive-icon.png` (1024x1024, Android)
   - `splash-icon.png`
   - `favicon.png` (web only)

   These are placeholders you'll need to add - Expo will error on build without them. For a hackathon demo, any square PNG works as a stand-in.

3. **The `/api/v1/export-report` endpoint does not exist yet** on the backend. `ExportModal.jsx` calls it via `src/services/api.js`'s `exportReport()`. You have two options:
   - Ask me to write that FastAPI endpoint (wraps the existing `app/services/pdf_generator.py`), or
   - For the demo, skip the Export screen entirely and rely on the Result screen (prediction + risk tier + Grad-CAM) as your shown output - this is still a complete, working screening flow without it.

## What's implemented

- **ScannerScreen** - live camera capture with a reticle overlay, plus a gallery-import fallback, wired to call `POST /api/v1/screen`.
- **ResultScreen** - shows risk badge, predicted class, confidence, Grad-CAM heatmap (toggle vs. original photo), and full 7-class probability bars.
- **ExportModal** - PDF export UI, blocked on the backend endpoint (see above).
- **api.js** - matches your actual backend response shape (`predicted_class`, `risk_tier`, `confidence`, `class_probabilities`, `heatmap_base64`, `disclaimer`).

## Known gaps to know about

- `useCameraQuality.js` is currently a placeholder - it doesn't yet read live camera brightness data (would need `expo-camera`'s frame processor or a native module). The server-side quality gate in the backend still runs regardless, so bad photos are still caught - this hook was just meant to warn the user *before* upload.
- No automated tests for the mobile app yet.
