FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /var/www/python

# Copy application code
COPY services/python .

# Install Python dependencies
# RUN if [ -f requirements.txt ]; then pip install -r requirements.txt; fi

# Install common ML packages
RUN pip install --no-cache-dir --upgrade \
    ultralytics \
    opencv-python-headless \
    numpy \
    "fastapi[standard]"

COPY docker/python/startup.sh /startup.sh

# Create startup script
RUN chmod +x /startup.sh

EXPOSE 8001

CMD ["/startup.sh"]
