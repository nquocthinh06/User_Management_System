@echo off
title Docker - User Management System

echo.
echo ========================================
echo   User Management System - Docker
echo ========================================
echo.

:: Check Docker installation
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed!
    echo Please install Docker Desktop from https://docker.com
    pause
    exit /b 1
)

:: Check Docker daemon is running
echo [INFO] Checking Docker daemon...
docker info >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker daemon is NOT running!
    echo Please start Docker Desktop from Start Menu
    echo Or run: "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    pause
    exit /b 1
)
echo [OK] Docker daemon is running
echo.

:: Check if port 3306 is available
echo [INFO] Checking port 3306 availability...
netstat -ano | findstr :3306 >nul 2>nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 3306 is already in use!
    echo.
    echo This is likely because MySQL local is running.
    echo.
    echo Solutions:
    echo   1. Stop MySQL local and run again:
    echo      .\stop-mysql-local.ps1
    echo      (Run PowerShell as Administrator)
    echo.
    echo   2. Or use alternative port (3307):
    echo      docker-compose -f docker-compose.alt.yml up --build -d
    echo.
    set /p choice="Do you want to continue anyway? (y/n): "
    if /i not "%choice%"=="y" (
        echo.
        echo [INFO] Cancelled. Please resolve port conflict first.
        pause
        exit /b 1
    )
    echo.
) else (
    echo [OK] Port 3306 is available
    echo.
)

echo [INFO] Starting all services with Docker Compose...
echo.

docker-compose up --build -d

echo.
echo ========================================
echo   Services Started Successfully!
echo ========================================
echo.
echo   Frontend:  http://localhost:5173
echo   Backend:   http://localhost:5000
echo   MySQL:     localhost:3306
echo.
echo   Commands:
echo     Stop:    docker-compose down
echo     Logs:    docker-compose logs -f
echo     Status:  docker-compose ps
echo.
pause
