from fastapi import FastAPI
from app.api.routes import router as api_router

app = FastAPI(
    title="University Degree Recommendation System",
    description="API for recommending university degrees based on student data",
    version="1.0.0"
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to the University Degree Recommendation API"}