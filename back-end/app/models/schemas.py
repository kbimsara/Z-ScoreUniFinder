from pydantic import BaseModel, Field, validator
from typing import List
from enum import Enum

class StreamEnum(str, Enum):
    ARTS = "Arts"
    COMMERCE = "Commerce"
    BIOLOGICAL_SCIENCE = "Biological Science"
    PHYSICAL_SCIENCE = "Physical Science"
    ENGINEERING_TECHNOLOGY = "Engineering Technology"
    BIOSYSTEMS_TECHNOLOGY = "Biosystems Technology"
    CROSS_STREAM = "Cross Stream"

class StudentProfile(BaseModel):
    zscore: float = Field(..., ge=-3.0, le=3.0, description="Student's Z-score")
    district: str = Field(..., min_length=1, max_length=50)
    stream: StreamEnum = Field(..., description="Academic stream")
    exam_year: int = Field(..., ge=2019, le=2025)

    @validator('zscore')
    def validate_zscore(cls, v):
        if v < -3.0 or v > 3.0:
            raise ValueError('Z-score must be between -3.0 and 3.0')
        return v

    @validator('district')
    def validate_district(cls, v):
        v = v.strip().title()
        if not v.replace(' ', '').isalpha():
            raise ValueError('District must contain only letters')
        return v

class CourseRecommendation(BaseModel):
    course: str
    university: str
    admission_probability: float
    rank: int
    category: str
    intake: int

class RecommendationResponse(BaseModel):
    student_profile: StudentProfile
    recommendations: List[CourseRecommendation]
    total_courses_analyzed: int
    generation_time: float

class ModelStats(BaseModel):
    model_name: str
    accuracy: float
    total_courses: int
    districts: List[str]
    streams: List[str]
    last_trained: str