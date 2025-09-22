#!/bin/bash

# Development startup script for Dependency Management App
echo "🚀 Starting Dependency Management App in Development Mode"
echo "================================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Set environment variables
export NODE_ENV=development
export COMPOSE_PROJECT_NAME=dep-mgmt-dev

echo "📦 Starting database services..."
docker-compose -f ../../docker-compose.dev.yml up -d mongodb redis

echo "⏳ Waiting for databases to be ready..."
sleep 10

echo "🔧 Starting backend services..."
docker-compose -f ../../docker-compose.dev.yml up -d backend-dev

echo "⏳ Waiting for backend to be ready..."
sleep 15

echo "🎨 Starting frontend services..."
docker-compose -f ../../docker-compose.dev.yml up -d frontend-dev

echo ""
echo "✅ Development environment started successfully!"
echo "================================================================="
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:5000"
echo "🏥 Health Check: http://localhost:5000/api/v1/health"
echo "📊 MongoDB: localhost:27017"
echo "🗄️  Redis: localhost:6379"
echo ""
echo "📋 To view logs:"
echo "   Backend:  docker logs -f dep-mgmt-backend-dev"
echo "   Frontend: docker logs -f dep-mgmt-frontend-dev"
echo ""
echo "🛑 To stop all services:"
echo "   docker-compose -f docker-compose.dev.yml down"
echo ""
EOF && chmod +x start-dev.sh