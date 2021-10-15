FROM python:3.6.15

COPY . /app

WORKDIR /app

RUN pip install -r requirements_linux.txt --no-dependencies

CMD ["python", "./App.py"]