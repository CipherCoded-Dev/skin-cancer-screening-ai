"""
Generates a doctor-ready PDF report: original photo, Grad-CAM overlay,
predicted class, risk tier, and the non-diagnostic disclaimer.

Build this last — it's cosmetic for the demo and not required for the
core pipeline to function. Uses ReportLab.
"""

import base64
import io

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas


def generate_report_pdf(
    predicted_class: str,
    risk_tier: str,
    confidence: float,
    heatmap_base64: str,
    disclaimer: str,
) -> bytes:
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    c.setFont("Helvetica-Bold", 16)
    c.drawString(2 * cm, height - 2 * cm, "DermaScan AI — Screening Report")

    c.setFont("Helvetica", 12)
    c.drawString(2 * cm, height - 3 * cm, f"Predicted class: {predicted_class}")
    c.drawString(2 * cm, height - 3.7 * cm, f"Risk tier: {risk_tier}")
    c.drawString(2 * cm, height - 4.4 * cm, f"Model confidence: {confidence * 100:.1f}%")

    # Embed the Grad-CAM heatmap image.
    try:
        image_bytes = base64.b64decode(heatmap_base64)
        image_reader = io.BytesIO(image_bytes)
        c.drawImage(image_reader, 2 * cm, height - 12 * cm, width=8 * cm, height=8 * cm)
    except Exception:
        pass  # If image embedding fails, still deliver the text report.

    c.setFont("Helvetica-Oblique", 9)
    c.drawString(2 * cm, 2 * cm, disclaimer)

    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer.read()
