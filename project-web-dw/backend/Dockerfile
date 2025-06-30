# backend/Dockerfile

FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# instalar dependencias de sistema
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copiar código y datos
COPY . .

EXPOSE 5000

# comando por defecto: arranca Flask
CMD ["python", "manage.py"]
