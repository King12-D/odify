FROM python:3.12-slim

WORKDIR /server

COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY server/ .

EXPOSE 8000

CMD ["uvicorn", "main:buildApp", "--host", "0.0.0.0", "--port", "8000"]
