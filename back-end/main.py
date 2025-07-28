from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List
import joblib
import os

# Constants for validation
STREAMS = [
    "Biological Science", "Physical Science", "Cross Stream", "Commerce", "Arts", "Engineering Technology", "Biosystems Technology"
]
DISTRICTS = [
    "Colombo", "Gampaha", "Kalutara", "Matale", "Kandy", "Nuwara Eliya", "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya", "Trincomalee", "Batticaloa", "Ampara", "Puttalam", "Kurunegala", "Anuradhapura", "Polonnaruwa", "Badulla", "Monaragala", "Kegalle", "Ratnapura"
]

# Placeholder for program list (add full list as needed)
PROGRAMS = [
    "Software Engineering (University Of Moratuwa)",
    "Computer Science (University Of Colombo)",
    "Medicine (University Of Colombo)",
    "Engineering (University Of Peradeniya)"
    # ... add all programs here ...
]

app = FastAPI()

class RecommendationRequest(BaseModel):
    z_score: float = Field(..., example=1.75)
    stream: str = Field(..., example="Biological Science")
    district: str = Field(..., example="Colombo")

    def validate(self):
        if self.stream not in STREAMS:
            raise HTTPException(status_code=400, detail=f"Invalid stream. Must be one of: {STREAMS}")
        if self.district not in DISTRICTS:
            raise HTTPException(status_code=400, detail=f"Invalid district. Must be one of: {DISTRICTS}")

class Recommendation(BaseModel):
    program: str
    score: float

class RecommendationResponse(BaseModel):
    recommendations: List[Recommendation]

# TODO: Load your trained model here
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "model.pkl")
model = None
if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
    except Exception as e:
        print(f"Failed to load model: {e}")

@app.post("/recommend", response_model=RecommendationResponse)
def recommend(req: RecommendationRequest):
    req.validate()
    # TODO: Use your model for real recommendations
    # For now, return dummy recommendations
    dummy_recommendations = [
        Recommendation(program=PROGRAMS[0], score=0.95),
        Recommendation(program=PROGRAMS[1], score=0.90),
        Recommendation(program=PROGRAMS[2], score=0.85)
    ]
    return RecommendationResponse(recommendations=dummy_recommendations) 