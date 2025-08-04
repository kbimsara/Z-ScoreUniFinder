from fastapi import APIRouter, HTTPException, Depends
from typing import List
import time
import logging
from app.models.schemas import StudentProfile, RecommendationResponse, CourseRecommendation, ModelStats
from app.dependencies import get_ml_service
from app.services.ml_service import MLService

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/recommendations", response_model=RecommendationResponse)
async def get_course_recommendations(
    student_profile: StudentProfile,
    top_k: int = 10,
    ml_service: MLService = Depends(get_ml_service)
):
    try:
        start_time = time.time()
        if top_k < 1 or top_k > 50:
            raise HTTPException(status_code=400, detail="top_k must be between 1 and 50")
        
        recommendations = ml_service.get_recommendations(student_profile, top_k)
        generation_time = time.time() - start_time
        
        response = RecommendationResponse(
            student_profile=student_profile,
            recommendations=recommendations,
            total_courses_analyzed=len(recommendations),
            generation_time=round(generation_time, 3)
        )
        
        logger.info(f"Generated {len(recommendations)} recommendations for student with Z-score {student_profile.zscore}")
        return response
        
    except Exception as e:
        logger.error(f"Error generating recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/model/stats", response_model=ModelStats)
async def get_model_statistics(ml_service: MLService = Depends(get_ml_service)):
    try:
        stats = ml_service.get_model_stats()
        return ModelStats(**stats)
    except Exception as e:
        logger.error(f"Error getting model stats: {e}")
        raise HTTPException(status_code=500, detail="Unable to retrieve model statistics")

@router.get("/districts")
async def get_available_districts(ml_service: MLService = Depends(get_ml_service)):
    try:
        stats = ml_service.get_model_stats()
        return {"districts": stats.get('districts', [])}
    except Exception as e:
        logger.error(f"Error getting districts: {e}")
        raise HTTPException(status_code=500, detail="Unable to retrieve districts")

@router.get("/streams")
async def get_available_streams():
    return {
        "streams": [
            {"value": "Arts", "label": "Arts"},
            {"value": "Commerce", "label": "Commerce"},
            {"value": "Biological Science", "label": "Biological Science"},
            {"value": "Physical Science", "label": "Physical Science"},
            {"value": "Engineering Technology", "label": "Engineering Technology"},
            {"value": "Biosystems Technology", "label": "Biosystems Technology"},
            {"value": "Cross Stream", "label": "Cross Stream"}
        ]
    }