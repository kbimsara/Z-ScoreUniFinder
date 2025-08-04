from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from app.api.routes import router
from app.services.ml_service import MLService
from app.dependencies import ml_service

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    global ml_service
    try:
        ml_service = MLService()
        ml_service.load_model()
        logger.info("ML service initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize ML service: {e}")
    yield
    logger.info("Application shutting down")

app = FastAPI(
    title="University Degree Recommendation System",
    description="AI-powered degree recommendation based on Z-scores",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Degree Recommendation API is running"}