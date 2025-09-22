#!/bin/bash

# Local development startup script (without Docker)
echo "🚀 Starting Dependency Management App Locally"
echo "============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if MongoDB is running locally
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running locally. You may need to start MongoDB or use Docker."
    echo "   To start with Docker: docker run -d -p 27017:27017 --name mongodb mongo:7.0"
fi

cd ../../

echo "🔧 Starting Backend Server..."
cd backend

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
fi

# Start backend in background
echo "   Installing dependencies and starting backend..."
npm run dev &
BACKEND_PID=$!

echo "   Backend starting with PID: $BACKEND_PID"
echo "   Waiting for backend to initialize..."
sleep 10

cd ../frontend

echo "🎨 Starting Frontend Server..."
echo "   Installing dependencies and starting frontend..."
npm run dev &
FRONTEND_PID=$!

echo "   Frontend starting with PID: $FRONTEND_PID"

echo ""
echo "✅ Local development servers started!"
echo "============================================="
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:5000"
echo "🏥 Health Check: http://localhost:5000/api/v1/health"
echo ""
echo "📋 Process IDs:"
echo "   Backend PID:  $BACKEND_PID"
echo "   Frontend PID: $FRONTEND_PID"
echo ""
echo "🛑 To stop servers:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo "   Or press Ctrl+C"

# Wait for user to stop
trap "echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

# Keep script running
wait
EOF && chmod +x local-dev.sh