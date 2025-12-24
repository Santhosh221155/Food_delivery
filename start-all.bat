@echo off
REM Food Delivery App - Complete Startup Script

echo.
echo ========================================
echo Food Delivery App - Starting All Services
echo ========================================
echo.

REM Colors
setlocal enabledelayedexpansion

REM Get the directory of this script
set "SCRIPT_DIR=%~dp0"

echo Starting Python FastAPI Backend...
start "Python Backend - FastAPI" /MIN python -m uvicorn main:app --host 0.0.0.0 --port 5000
timeout /t 2 /nobreak

echo Starting Node.js API Gateway...
start "Node.js API Gateway" /MIN cmd /k "cd %SCRIPT_DIR%backend\node-service && node --require dotenv/config src/server.js"
timeout /t 2 /nobreak

echo Starting Frontend (Vite)...
start "Frontend - Vite" /MIN cmd /k "cd %SCRIPT_DIR%frontend && npm run dev"
timeout /t 3 /nobreak

echo.
echo ========================================
echo All services are starting...
echo ========================================
echo.
echo Services:
echo   - Frontend:      http://localhost:5173
echo   - Node.js API:   http://localhost:3000/api
echo   - Python API:    http://localhost:5000
echo.
echo Press any key to exit...
pause >nul
