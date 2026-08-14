from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_healthcheck():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "project": "quantix"}

def test_home():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Quantix backend is alive!"}