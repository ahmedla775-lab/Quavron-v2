FROM python:3.12-slim

WORKDIR /app

COPY qai/requirements.txt ./requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY qai/ .
COPY qai_research/ ./qai_research/

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
