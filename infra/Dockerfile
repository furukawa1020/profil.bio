# Rust AI Service
FROM rust:1.70 as rust-builder

WORKDIR /app
COPY microservices/rust-ai/ .
RUN cargo build --release

# Go Backend Service
FROM golang:1.21 as go-builder

WORKDIR /app
COPY backend/ .
RUN go mod download
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Python SNS Service
FROM python:3.11-slim as python-builder

WORKDIR /app
COPY microservices/python-sns/ .
RUN pip install --no-cache-dir -r requirements.txt

# Final multi-service image
FROM debian:bookworm-slim

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create directories for each service
RUN mkdir -p /app/go /app/rust /app/python

# Copy built applications
COPY --from=go-builder /app/main /app/go/
COPY --from=rust-builder /app/target/release/ai_server /app/rust/
COPY --from=python-builder /app /app/python/

# Copy startup script
COPY infra/start-services.sh /app/
RUN chmod +x /app/start-services.sh

EXPOSE 8080 3001 3002

CMD ["/app/start-services.sh"]
