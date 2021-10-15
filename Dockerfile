FROM python:3.6.15

COPY . /app

WORKDIR /app

RUN pip install -r requirements_linux.txt --no-dependencies

RUN apt-get update
RUN apt-get install ffmpeg libsm6 libxext6  -y

CMD ["python", "./App.py"]