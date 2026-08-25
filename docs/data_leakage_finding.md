# Data Leakage Finding — Lesion-Level Split Correction

## The issue

HAM10000 contains multiple photos of the same physical lesion, grouped
by `lesion_id`. A naive random train/validation split at the image
level can place different photos of the *same* lesion into both sets,
letting the model partially "recognize" a lesion it has already seen
during training. This inflates every reported metric.

## The fix

Switched to `GroupShuffleSplit` grouped by `lesion_id`, guaranteeing no
lesion's photos appear in both training and validation sets.

## Before vs. after

| Metric              | Naive split (leaked) | Lesion-grouped split (honest) |
|----------------------|-----------------------|--------------------------------|
| Accuracy              | 88.92%               | 79.31%                        |
| Melanoma (mel) recall | —                     | 69% (F1 0.5695)               |
| BCC recall             | —                     | 83%                            |
| Akiec recall           | —                     | 54% (F1 0.5909)                |
| NV recall / precision  | —                     | 84% / 94%                     |

## Why this matters for the pitch

Many student projects on HAM10000 report 88–90% accuracy without
realizing this leakage exists. The 79.31% figure is the trustworthy
one — it reflects performance on lesions the model has genuinely never
seen, which is the real-world scenario for a new user's phone photo.

## Known weak points (be upfront about these)

- **Akiec recall (54%)** — misses close to half of actinic keratoses.
- **Melanoma precision (48%)** — over half of "melanoma" flags are
  false positives, though recall (69%) is prioritized since missing a
  true melanoma is the costlier error for a screening tool.
- **vasc / df classes** have very few validation samples (29 and 10
  respectively) — don't over-claim reliability on these.
