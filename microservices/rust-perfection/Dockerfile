# Rust Perfection Service Dockerfile
FROM rust:1.70 AS builder

WORKDIR /app
COPY Cargo.toml Cargo.lock ./
COPY src ./src

RUN cargo build --release

FROM debian:bookworm-slim
WORKDIR /app

COPY --from=builder /app/target/release/rust-perfection .

EXPOSE 5002

CMD ["./rust-perfection"]
