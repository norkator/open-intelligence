FROM python:3.6.15

# COPY . /app
COPY requirements_linux_container.txt /app/requirements_linux_container.txt

WORKDIR /app

# RUN pip install -r requirements_linux.txt --no-dependencies
RUN pip install -r requirements_linux_container.txt

RUN apt-get update
RUN apt-get install ffmpeg libsm6 libxext6  -y

# docker-compose file introduces mount point to mount source files without copying into docker image

CMD ["python", "./SimilarityProcess.py"]