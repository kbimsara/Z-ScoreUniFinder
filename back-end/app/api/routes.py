from fastapi import APIRouter, HTTPException
from app.models.schemas import StudentInput, RecommendationResponse
from app.services.ml_service import MLService
import os

router = APIRouter()

ml_service = MLService(
    data_path=os.path.join(os.path.dirname(__file__), '../../data/dataset.csv'),
    model_path=os.path.join(os.path.dirname(__file__), '../../data/trained_model.pkl')
)

@router.post("/recommend", response_model=RecommendationResponse)
async def recommend(input_data: StudentInput):
    try:
        response = ml_service.recommend_courses(input_data)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))