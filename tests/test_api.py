"""
Basic API smoke tests using FastAPI's TestClient.
"""

import pytest


@pytest.mark.skip(reason="Enable once app.main is runnable in this environment.")
def test_health_endpoint():
    from fastapi.testclient import TestClient
    from dermascan_backend.app.main import app  # adjust import once packaged

    client = TestClient(app)
    response = client.get("/api/v1/health")
    assert response.status_code == 200
