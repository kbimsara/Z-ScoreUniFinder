from pydantic import BaseModel
from typing import List, Optional

class StudentInput(BaseModel):
    district: str
    stream: str
    zscore: float

class CourseRecommendation(BaseModel):
    course: str
    university: str
    predicted_score: float

class RecommendationResponse(BaseModel):
    recommendations: List[CourseRecommendation]