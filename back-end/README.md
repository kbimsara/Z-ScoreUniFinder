# Z-ScoreUniFinder FastAPI Backend

## Setup

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the API**
   ```bash
   uvicorn main:app --reload
   ```

3. **Model File**
   - Place your trained model as `backend/models/model.pkl`.
   - The API will attempt to load this file at startup.

## API Endpoint

### `POST /recommend`
- **Request Body:**
  ```json
  {
    "z_score": 1.75,
    "stream": "Biological Science",
    "district": "Colombo"
  }
  ```
- **Response:**
  ```json
  {
    "recommendations": [
      {"program": "Software Engineering (University Of Moratuwa)", "score": 0.95},
      {"program": "Computer Science (University Of Colombo)", "score": 0.90}
    ]
  }
  ```

## Notes
- Streams and districts are validated against fixed lists.
- The model is not yet integrated; dummy recommendations are returned until you add your model logic. 