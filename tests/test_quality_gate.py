"""
Tests for the OpenCV quality gate. Add real sample images (one sharp,
one blurry, one over/under-exposed) to test fixtures once available.
"""

import pytest


def test_quality_gate_rejects_invalid_bytes():
    from dermascan_backend.app.services import quality_gate  # adjust import once packaged

    result = quality_gate.check(b"not a real image")
    assert result.passed is False


# TODO: add fixture images and assert pass/fail on real blur & brightness cases.
