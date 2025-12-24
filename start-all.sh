#!/bin/bash
# Food Delivery App - Unix/Mac Startup Script

echo ""
echo "========================================"
echo "Food Delivery App - Starting All Services"
echo "========================================"
echo ""

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Starting Python FastAPI Backend..."
cd "$SCRIPT_DIR/backend/flask-service"
python -m uvicorn main:app --host 0.0.0.0 --port 5000 &
PYTHON_PID=$!
sleep 2

echo "Starting Node.js API Gateway..."
cd "$SCRIPT_DIR/backend/node-service"
node --require dotenv/config src/server.js &
NODE_PID=$!
sleep 2

echo "Starting Frontend (Vite)..."
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!
sleep 3

echo ""
echo "========================================"
echo "All services started!"
echo "========================================"
echo ""
echo "Services:"
echo "  - Frontend:      http://localhost:5173"
echo "  - Node.js API:   http://localhost:3000/api"
echo "  - Python API:    http://localhost:5000"
echo ""
echo "Process IDs: Python=$PYTHON_PID Node=$NODE_PID Frontend=$FRONTEND_PID"
echo "Press Ctrl+C to stop all services"
echo ""

wait
