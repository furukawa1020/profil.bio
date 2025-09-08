# Rust AI Service Dockerfile for Railway
FROM rust:1.70 as builder

WORKDIR /app

# Copy Cargo files first for better caching
COPY Cargo.toml Cargo.lock ./

# Create src directory and copy source code
COPY src ./src

# Build the application in release mode
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
