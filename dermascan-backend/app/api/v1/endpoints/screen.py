"""
POST /screen — the core DermaScan AI endpoint.

Flow:
    1. Receive an uploaded lesion photo.
    2. Run it through the OpenCV quality gate (reject blurry/dark photos).
    3. Run inference -> 7-class prediction + risk tier.
    4. Generate a Grad-CAM heatmap overlay.
    5. Return the result (and optionally a PDF report).
"""

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.models.schemas import ScreenResponse
from app.services import gradcam, inference, quality_gate

router = APIRouter()


@router.post("/screen", response_model=ScreenResponse)
async def screen_lesion(image: UploadFile = File(...)):
    image_bytes = await image.read()

    # Step 1: quality gate — fail fast on unusable photos.
    quality_result = quality_gate.check(image_bytes)
    if not quality_result.passed:
        raise HTTPException(
            status_code=400,
            detail=f"Image quality check failed: {quality_result.reason}",
        )

    # Step 2: run the classifier.
    prediction = inference.predict(image_bytes)

    # Step 3: Grad-CAM heatmap for explainability.
    heatmap_base64 = gradcam.generate_heatmap(image_bytes, prediction.predicted_class)

    return ScreenResponse(
        predicted_class=prediction.predicted_class,
        risk_tier=prediction.risk_tier,
        confidence=prediction.confidence,
        class_probabilities=prediction.class_probabilities,
        heatmap_base64=heatmap_base64,
        disclaimer="This is an assistive screening tool, not a medical diagnosis. Consult a dermatologist for any concerning result.",
    )
