# Script kiểm tra Docker và cấu hình
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Docker Configuration Checker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Kiểm tra Docker đã cài đặt chưa
Write-Host "[1] Checking Docker installation..." -ForegroundColor Yellow
$dockerVersion = docker --version 2>$null
if ($dockerVersion) {
    Write-Host "   ✓ Docker found: $dockerVersion" -ForegroundColor Green
} else {
    Write-Host "   ✗ Docker not found! Please install Docker Desktop" -ForegroundColor Red
    Write-Host "   Download from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# 2. Kiểm tra Docker daemon có chạy không
Write-Host "[2] Checking Docker daemon..." -ForegroundColor Yellow
$dockerInfo = docker info 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Docker daemon is running" -ForegroundColor Green
} else {
    Write-Host "   ✗ Docker daemon is NOT running!" -ForegroundColor Red
    Write-Host "   Please start Docker Desktop from Start Menu" -ForegroundColor Yellow
    Write-Host "   Or run: Start-Process 'C:\Program Files\Docker\Docker\Docker Desktop.exe'" -ForegroundColor Yellow
    exit 1
}

# 3. Kiểm tra Docker Compose
Write-Host "[3] Checking Docker Compose..." -ForegroundColor Yellow
$composeVersion = docker compose version 2>$null
if ($composeVersion) {
    Write-Host "   ✓ Docker Compose found: $composeVersion" -ForegroundColor Green
} else {
    Write-Host "   ✗ Docker Compose not found!" -ForegroundColor Red
    exit 1
}

# 4. Kiểm tra file docker-compose.yml
Write-Host "[4] Checking docker-compose.yml..." -ForegroundColor Yellow
if (Test-Path "docker-compose.yml") {
    Write-Host "   ✓ docker-compose.yml found" -ForegroundColor Green
    
    # Đọc file và kiểm tra cấu hình
    $composeContent = Get-Content "docker-compose.yml" -Raw
    
    if ($composeContent -match "version:") {
        Write-Host "   ⚠ Warning: 'version' attribute detected (obsolete in Compose v2)" -ForegroundColor Yellow
    }
    
    if ($composeContent -match "services:") {
        Write-Host "   ✓ Services defined" -ForegroundColor Green
    }
} else {
    Write-Host "   ✗ docker-compose.yml not found!" -ForegroundColor Red
    exit 1
}

# 5. Kiểm tra Dockerfiles
Write-Host "[5] Checking Dockerfiles..." -ForegroundColor Yellow
$backendDockerfile = Test-Path "backend\Dockerfile"
$frontendDockerfile = Test-Path "frontend\Dockerfile"

if ($backendDockerfile) {
    Write-Host "   ✓ backend/Dockerfile found" -ForegroundColor Green
} else {
    Write-Host "   ✗ backend/Dockerfile not found!" -ForegroundColor Red
}

if ($frontendDockerfile) {
    Write-Host "   ✓ frontend/Dockerfile found" -ForegroundColor Green
} else {
    Write-Host "   ✗ frontend/Dockerfile not found!" -ForegroundColor Red
}

# 6. Kiểm tra ports đã được sử dụng chưa
Write-Host "[6] Checking ports availability..." -ForegroundColor Yellow
$ports = @(3306, 5000, 5173)
foreach ($port in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connection) {
        Write-Host "   ⚠ Port $port is already in use" -ForegroundColor Yellow
    } else {
        Write-Host "   ✓ Port $port is available" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If all checks passed, you can now run:" -ForegroundColor White
Write-Host "  docker-compose up --build" -ForegroundColor Green
Write-Host ""
Write-Host "Or use the batch file:" -ForegroundColor White
Write-Host "  .\docker-start.bat" -ForegroundColor Green
Write-Host ""

