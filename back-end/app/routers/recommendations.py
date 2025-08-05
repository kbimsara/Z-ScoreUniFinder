from fastapi import APIRouter
import pandas as pd
from pathlib import Path

router = APIRouter()

DATASET_PATH = Path(__file__).parent.parent / "data" / "dataset.csv"

@router.get("/health")
def health_check():
    return {"status": "healthy", "message": "Degree Recommendation API is running"}

@router.get("/districts")
def get_districts():
    df = pd.read_csv(DATASET_PATH)
    districts = df["District"].unique().tolist()
    return districts

@router.get("/streams")
def get_streams():
    df = pd.read_csv(DATASET_PATH)
    streams = df["Stream"].unique().tolist()
    return streams

@router.post("/recommendations")
def get_recommendations(request: dict):
    from app.services.ml_service import MLService
    ml_service = MLService()
    recommendations = ml_service.get_recommendations(
        zscore=request.get("zscore"),
        district=request.get("district"),
        stream=request.get("stream"),
        exam_year=request.get("exam_year")
    )
    return {"recommendations": recommendations}