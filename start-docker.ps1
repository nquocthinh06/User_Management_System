# Script khởi động Docker Desktop và kiểm tra
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Docker Desktop Starter" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra Docker Desktop đã cài đặt chưa
$dockerDesktopPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
if (-not (Test-Path $dockerDesktopPath)) {
    Write-Host "[ERROR] Docker Desktop not found at: $dockerDesktopPath" -ForegroundColor Red
    Write-Host "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Kiểm tra Docker daemon đã chạy chưa
Write-Host "[INFO] Checking if Docker Desktop is running..." -ForegroundColor Yellow
docker info >$null 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Docker Desktop is already running!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run:" -ForegroundColor White
    Write-Host "  docker-compose up --build" -ForegroundColor Green
    Write-Host "  .\docker-start.bat" -ForegroundColor Green
    exit 0
}

Write-Host "[INFO] Docker Desktop is not running. Starting..." -ForegroundColor Yellow
Write-Host "Please wait for Docker Desktop to start (this may take 1-2 minutes)..." -ForegroundColor Yellow
Write-Host ""

# Khởi động Docker Desktop
Start-Process -FilePath $dockerDesktopPath -WindowStyle Hidden

# Đợi Docker Desktop khởi động
Write-Host "[INFO] Waiting for Docker Desktop to start..." -ForegroundColor Yellow
$timeout = 120  # 2 phút
$elapsed = 0
$checkInterval = 5

while ($elapsed -lt $timeout) {
    Start-Sleep -Seconds $checkInterval
    $elapsed += $checkInterval
    
    docker info >$null 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Docker Desktop is now running!" -ForegroundColor Green
        Write-Host ""
        Write-Host "You can now run:" -ForegroundColor White
        Write-Host "  docker-compose up --build" -ForegroundColor Green
        Write-Host "  .\docker-start.bat" -ForegroundColor Green
        exit 0
    }
    
    Write-Host "   Still waiting... ($elapsed seconds)" -ForegroundColor Gray
}

Write-Host "[ERROR] Docker Desktop failed to start within $timeout seconds" -ForegroundColor Red
Write-Host "Please start Docker Desktop manually from Start Menu" -ForegroundColor Yellow
exit 1

