FROM python:3.6.15

# COPY . /app
COPY requirements_linux_container_heavy.txt /app/requirements_linux_container_heavy.txt

WORKDIR /app

RUN pip install -r requirements_linux_container_heavy.txt

RUN apt-get update
RUN apt-get install ffmpeg libsm6 libxext6  -y

# docker-compose file introduces mount point to mount source files without copying into docker image

COPY models/retinaface_r50_v1/R50-0000.params /root/.insightface/models/retinaface_r50_v1/R50-0000.params
COPY models/retinaface_r50_v1/R50-symbol.json /root/.insightface/models/retinaface_r50_v1//R50-symbol.json

CMD ["python", "./InsightFace.py"]