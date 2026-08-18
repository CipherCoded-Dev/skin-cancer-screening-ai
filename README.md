# skin-cancer-screening-ai
# DermaScan AI: Smartphone-Based Skin Lesion Screening & Triage

**Track:** Omni_BioTech_12 (Omnikon 2026)  
**Status:** Phase 1 - Idea & Architecture Submission

---

## Project Overview
DermaScan AI is a mobile-first, explainable skin lesion triage tool designed to help flag suspicious skin lesions using standard smartphone cameras.

### Key Components:
- **Pre-Capture Quality Gate:** OpenCV Laplacian blur check & exposure validation.
- **Deep Learning Classifier:** EfficientNet-B0 fine-tuned on the HAM10000 / ISIC dataset.
- **Explainability (XAI):** Grad-CAM heatmaps overlaying active morphological lesion features.
- **Triage & Reporting:** 3-tier risk stratification (Low / Moderate / High Risk) with physician-ready PDF summary export.

---

## Planned Tech Stack
- **Mobile Frontend:** React Native / Flutter
- **Backend API:** FastAPI (Python)
- **ML / Vision:** PyTorch, torchvision, OpenCV, Albumentations
- **Datasets:** HAM10000, ISIC Archive

---

## Team
- **Team Name:** Khushbuchandra2161
- **Team Lead:** Khushbu
