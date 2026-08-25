"""
Tests for the inference service. Requires best_dermascan_efficientnet.pth
to be present in dermascan-backend/weights/ to run.
"""

import pytest


@pytest.mark.skip(reason="Add a sample lesion image fixture before enabling this test.")
def test_predict_returns_valid_class():
    pass


# TODO: once you have a fixture image, load it, call inference.predict(),
# and assert predicted_class is one of settings.CLASSES and confidence
# is between 0 and 1.
