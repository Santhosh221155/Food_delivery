# Start Flask Service (Local Development)
Write-Host "🐍 Starting Flask Menu Service..." -ForegroundColor Green
Write-Host "Port: 5000" -ForegroundColor Yellow
Write-Host "Health: http://localhost:5000/healthz`n" -ForegroundColor Cyan

cd $PSScriptRoot\flask-service

# Activate virtual environment if it exists
if (Test-Path ".venv\Scripts\Activate.ps1") {
    .\.venv\Scripts\Activate.ps1
    Write-Host "✅ Virtual environment activated`n" -ForegroundColor Green
}

# Start Flask
python main.py
