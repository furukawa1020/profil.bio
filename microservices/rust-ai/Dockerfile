# Rust AI Service Dockerfile for Railway - Version 2.2
FROM rust:latest as builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Cargo.toml and create dummy source for dependency caching
COPY Cargo.toml ./
RUN mkdir -p src && echo 'fn main() {}' > src/main.rs

# Build dependencies only
RUN cargo build --release
RUN rm -rf src/

# Copy real source code
COPY src/ ./src/

# Build the actual application
RUN cargo build --release

# Runtime stage with minimal image
FROM debian:bookworm-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy the binary from builder stage
COPY --from=builder /app/target/release/philosophy-ai /app/philosophy-ai

# Create data directory for AI models
RUN mkdir -p /app/data

# Expose port (Railway will override this)
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-3001}/health || exit 1

# Run the application
CMD ["./philosophy-ai"]
