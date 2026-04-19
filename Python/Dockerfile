FROM python:3.11-slim

WORKDIR /app

# Install system dependencies & LaTeX for PDF Generation
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    texlive-latex-base \
    texlive-fonts-recommended \
    && rm -rf /var/lib/apt/lists/*

# Install python requirements
COPY requirements-docker.txt .
RUN pip install --no-cache-dir -r requirements-docker.txt

# Download the small English model for spaCy
RUN python -m spacy download en_core_web_sm

# Copy the server configuration
COPY main.py .

EXPOSE 8000

# Run the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
