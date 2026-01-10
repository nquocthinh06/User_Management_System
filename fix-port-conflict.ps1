# Script kiểm tra và hướng dẫn xử lý port conflict
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Port Conflict Checker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ports = @(
    @{Port=3306; Service="MySQL"; Description="Database"},
    @{Port=5000; Service="Backend"; Description="API Server"},
    @{Port=5173; Service="Frontend"; Description="Web App"}
)

$hasConflict = $false

foreach ($portInfo in $ports) {
    Write-Host "[Checking] Port $($portInfo.Port) ($($portInfo.Service))..." -ForegroundColor Yellow
    
    $connection = Get-NetTCPConnection -LocalPort $portInfo.Port -ErrorAction SilentlyContinue
    
    if ($connection) {
        $hasConflict = $true
        $processId = $connection.OwningProcess
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        
        Write-Host "  ✗ Port $($portInfo.Port) is IN USE!" -ForegroundColor Red
        Write-Host "    Process ID: $processId" -ForegroundColor Yellow
        
        if ($process) {
            Write-Host "    Process Name: $($process.ProcessName)" -ForegroundColor Yellow
            Write-Host "    Process Path: $($process.Path)" -ForegroundColor Gray
        }
        
        # Đưa ra giải pháp cụ thể cho từng port
        if ($portInfo.Port -eq 3306) {
            Write-Host ""
            Write-Host "  Solutions:" -ForegroundColor Cyan
            Write-Host "    1. Stop MySQL local:" -ForegroundColor White
            Write-Host "       .\stop-mysql-local.ps1 (Run as Admin)" -ForegroundColor Green
            Write-Host ""
            Write-Host "    2. Use alternative port:" -ForegroundColor White
            Write-Host "       docker-compose -f docker-compose.alt.yml up --build -d" -ForegroundColor Green
        } elseif ($portInfo.Port -eq 5000) {
            Write-Host ""
            Write-Host "  Solution: Stop the process or change port in docker-compose.yml" -ForegroundColor Yellow
        } elseif ($portInfo.Port -eq 5173) {
            Write-Host ""
            Write-Host "  Solution: Stop the process or change port in docker-compose.yml" -ForegroundColor Yellow
        }
        Write-Host ""
    } else {
        Write-Host "  ✓ Port $($portInfo.Port) is available" -ForegroundColor Green
    }
}

Write-Host "========================================" -ForegroundColor Cyan

if ($hasConflict) {
    Write-Host ""
    Write-Host "[ACTION REQUIRED] Please resolve port conflicts before running Docker!" -ForegroundColor Red
    Write-Host ""
    
    # Đặc biệt cho MySQL
    $mysqlPort = Get-NetTCPConnection -LocalPort 3306 -ErrorAction SilentlyContinue
    if ($mysqlPort) {
        Write-Host "For MySQL (port 3306), the easiest solution is:" -ForegroundColor Yellow
        Write-Host "  1. Open PowerShell as Administrator" -ForegroundColor White
        Write-Host "  2. Run: .\stop-mysql-local.ps1" -ForegroundColor Green
        Write-Host ""
    }
    
    exit 1
} else {
    Write-Host ""
    Write-Host "[SUCCESS] All ports are available!" -ForegroundColor Green
    Write-Host "You can now run: .\docker-start.bat" -ForegroundColor Green
    Write-Host ""
    exit 0
}

