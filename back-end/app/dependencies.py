from fastapi import HTTPException
from app.services.ml_service import MLService

def get_ml_service():
    global ml_service
    if ml_service is None:
        raise HTTPException(status_code=500, detail="ML service not initialized")
    return ml_service

# Global ML service instance (will be initialized in main.py)
ml_service = None