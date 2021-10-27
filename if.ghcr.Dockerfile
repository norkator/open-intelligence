FROM python:3.6.15

# COPY . /app
COPY requirements_linux_container_heavy.txt /app/requirements_linux_container_heavy.txt

WORKDIR /app

RUN pip install -r requirements_linux_container_heavy.txt

RUN apt-get update
RUN apt-get install ffmpeg libsm6 libxext6  -y

# Get models and unzip them
WORKDIR /root/.insightface/models
COPY models.sh ./models.sh
RUN chmod +x models.sh
RUN ./models.sh
RUN unzip models.zip

CMD ["python", "./InsightFace.py"]