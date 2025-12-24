# FoodDash - Stop All Services
Write-Host "Stopping all FoodDash services..." -ForegroundColor Red

# Kill processes on specific ports
$ports = @(5000, 3000, 5173)

foreach ($port in $ports) {
    Write-Host "Checking port $port..." -ForegroundColor Yellow
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    
    if ($connections) {
        $processes = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($processId in $processes) {
            try {
                $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
                if ($process) {
                    Write-Host "  Stopping $($process.ProcessName) (PID: $processId)" -ForegroundColor Red
                    Stop-Process -Id $processId -Force
                }
            } catch {
                Write-Host "  Could not stop process $processId" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "  No process on port $port" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "All services stopped!" -ForegroundColor Green
