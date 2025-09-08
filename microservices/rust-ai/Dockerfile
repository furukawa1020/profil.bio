# Rust AI Service Dockerfile for Railway - Version 2.1
FROM rust:1.76-slim as builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# First, copy only Cargo.toml to leverage Docker layer caching
COPY Cargo.toml ./

# Create a placeholder main.rs for dependency caching
RUN mkdir -p src && echo "fn main() {println!(\"placeholder\");}" > src/main.rs

# Pre-build dependencies
RUN cargo build --release && rm -rf src target/release/deps/philosophy*

# Now copy the real source code
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
