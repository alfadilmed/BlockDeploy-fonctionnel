# Base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install dependencies
# Using --no-cache-dir to reduce image size
# Consider using a virtual environment inside Docker for better isolation, though often not strictly necessary for simple apps
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code from local ./app to /app/app in the image
COPY ./app /app/app

# Add a non-root user and switch to it
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser

# Expose port the app runs on
EXPOSE 8000

# Healthcheck (optional, but good practice)
# This checks if the root endpoint is responsive. Adjust path/port if needed.
# HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
#   CMD curl -f http://localhost:8000/ || exit 1
# Note: curl might not be available in python:3.11-slim. Would need to install it or use a Python-based check.
# For simplicity in M6, I'll omit the HEALTHCHECK unless curl is added or a Python script is made.

# Labels (optional, good for metadata)
LABEL maintainer="BlockDeploy Team <dev@blockdeploy.com>"
LABEL version="0.1.0"
LABEL description="AI Assistant Backend for BlockDeploy"

# Command to run the application
# Uvicorn will be run as the 'appuser'
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
