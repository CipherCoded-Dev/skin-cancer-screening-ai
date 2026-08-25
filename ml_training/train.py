"""
Scripted version of your final training run (the lesion-grouped-split,
leakage-corrected pipeline). Kept here for reproducibility — this is
NOT imported by the backend at runtime; the backend only loads the
resulting .pth weights file.

Port over the logic from training_pipeline.ipynb once you have it
finalized:
    1. Load HAM10000 metadata.
    2. GroupShuffleSplit on lesion_id (prevents image-level leakage).
    3. Build EfficientNet-B0 with a 7-class head.
    4. Train frozen-backbone stage first, track Malignant F1.
    5. Optionally fine-tune (watch for overfitting — track train/val
       gap, and make sure the checkpoint-saving condition actually
       fires on improvement).
    6. Save best weights to ../dermascan-backend/weights/best_dermascan_efficientnet.pth
"""

# TODO: port training pipeline here once finalized in the notebook.

if __name__ == "__main__":
    raise NotImplementedError(
        "Training logic lives in notebooks/training_pipeline.ipynb for now. "
        "Port it here once finalized for a reproducible, scripted run."
    )
