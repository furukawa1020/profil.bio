#!/bin/bash

echo "🚀 Starting Polyglot Philosophy Playground Services..."

# Start PostgreSQL (if needed)
echo "📊 Setting up database..."

# Start Rust AI Service
echo "🦀 Starting Rust AI Service on port 3001..."
cd /app/rust && ./ai_server &

# Start Python SNS Service  
echo "🐍 Starting Python SNS Service on port 3002..."
cd /app/python && python main.py &

# Start Go Gateway Service
echo "🐹 Starting Go Gateway Service on port 8080..."
cd /app/go && ./main &

echo "✨ All services started successfully!"
echo "🌐 Gateway: http://localhost:8080"
echo "🤖 AI Service: http://localhost:3001"
echo "📱 SNS Service: http://localhost:3002"

# Keep container running
wait
