FROM python:3.6.15

# COPY . /app
COPY requirements_linux_container_heavy.txt /app/requirements_linux_container_heavy.txt

WORKDIR /app

RUN pip install -r requirements_linux_container_heavy.txt

RUN pip install 'h5py==2.10.0' --force-reinstall

RUN apt-get update
RUN apt-get install ffmpeg libsm6 libxext6  -y

# docker-compose file introduces mount point to mount source files without copying into docker image

CMD ["python", "./SuperResolution.py"]