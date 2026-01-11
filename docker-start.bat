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
    pause
    exit /b 1
)
echo [OK] Docker daemon is running
echo.

:: Check if required ports are in use
echo [INFO] Checking required ports (3306, 5000, 5173)...
set portConflict=0

netstat -ano | findstr ":3306" >nul 2>nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 3306 is already in use (MySQL)
    set portConflict=1
)

netstat -ano | findstr ":5000" >nul 2>nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 5000 is already in use (Backend)
    set portConflict=1
)

netstat -ano | findstr ":5173" >nul 2>nul
if %errorlevel% equ 0 (
    echo [WARNING] Port 5173 is already in use (Frontend)
    set portConflict=1
)

if %portConflict% equ 1 (
    echo.
    echo Solutions for port conflicts:
    echo   - Port 3306: Run .\stop-mysql-local.ps1 (as Administrator)
    echo              Or use: docker-compose -f docker-compose.alt.yml up --build -d
    echo   - Port 5000/5173: Stop the process using these ports
    echo.
    echo Do you want to continue anyway? (Y/N)
    set /p continue="Enter choice: "
    if /i not "%continue%"=="Y" (
        echo [INFO] Aborted by user.
        pause
        exit /b 1
    )
    echo [INFO] Continuing with startup (may fail if port conflict persists)...
    echo.
) else (
    echo [OK] All required ports are available
    echo.
)

:: Start Docker Compose services
echo [INFO] Starting all services with Docker Compose...
echo.

docker-compose up --build -d

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to start services!
    echo.
    echo Common issues:
    echo   - Port 3306 is already in use (MySQL local is running)
    echo     Solution: Run .\stop-mysql-local.ps1 (as Administrator)
    echo     Or use: docker-compose -f docker-compose.alt.yml up --build -d
    echo.
    echo Check logs: docker-compose logs
    echo.
    pause
    exit /b 1
)

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
