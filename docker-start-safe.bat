@echo off
title Docker - User Management System (Safe Mode)

echo.
echo ========================================
echo   User Management System - Docker
echo   (Port Conflict Safe Mode)
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
    pause
    exit /b 1
)
echo [OK] Docker daemon is running
echo.

:: Check port 3306
echo [INFO] Checking port 3306...
netstat -ano | findstr :3306 >nul 2>nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 3306 is already in use!
    echo.
    echo This is likely because MySQL local is running.
    echo.
    echo Options:
    echo   1. Stop MySQL local (Recommended)
    echo      - Run PowerShell as Admin
    echo      - Run: .\stop-mysql-local.ps1
    echo.
    echo   2. Use alternative port 3307
    echo      - This script will use docker-compose.alt.yml
    echo      - MySQL will be available at localhost:3307
    echo.
    set /p choice="Use alternative port 3307? (y/n): "
    if /i "%choice%"=="y" (
        echo.
        echo [INFO] Using alternative port 3307...
        echo [INFO] MySQL will be at localhost:3307 (instead of 3306)
        echo.
        docker-compose -f docker-compose.alt.yml up --build -d
        
        if %errorlevel% equ 0 (
            echo.
            echo ========================================
            echo   Services Started Successfully!
            echo ========================================
            echo.
            echo   Frontend:  http://localhost:5173
            echo   Backend:   http://localhost:5000
            echo   MySQL:     localhost:3307 (Alternative port)
            echo.
            echo   Note: Backend connects to MySQL internally,
            echo   so it still works correctly!
            echo.
        ) else (
            echo.
            echo [ERROR] Failed to start services!
            echo Check logs: docker-compose -f docker-compose.alt.yml logs
            echo.
        )
        pause
        exit /b
    ) else (
        echo.
        echo [INFO] Please stop MySQL local first, then run this script again.
        echo Or run: .\stop-mysql-local.ps1 (as Administrator)
        pause
        exit /b 1
    )
) else (
    echo [OK] Port 3306 is available
    echo.
    echo [INFO] Starting all services with Docker Compose...
    echo.
    
    docker-compose up --build -d
    
    if %errorlevel% equ 0 (
        echo.
        echo ========================================
        echo   Services Started Successfully!
        echo ========================================
        echo.
        echo   Frontend:  http://localhost:5173
        echo   Backend:   http://localhost:5000
        echo   MySQL:     localhost:3306
        echo.
    ) else (
        echo.
        echo [ERROR] Failed to start services!
        echo Check logs: docker-compose logs
        echo.
    )
)

echo.
echo   Commands:
echo     Stop:    docker-compose down
echo     Logs:    docker-compose logs -f
echo     Status:  docker-compose ps
echo.
pause

