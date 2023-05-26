FROM python:3.10-slim
WORKDIR /app

ARG DREW_DOCQA_OPENAI_API_KEY
ENV DREW_DOCQA_OPENAI_API_KEY $DREW_DOCQA_OPENAI_API_KEY

COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
