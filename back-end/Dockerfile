FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN pip install fastapi==0.115.2
RUN pip install uvicorn==0.32.0
RUN pip install pandas==2.2.3
RUN pip install scikit-learn==1.5.2
RUN pip install pydantic==2.9.2
RUN pip install lightgbm

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]