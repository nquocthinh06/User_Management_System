@echo off
title User Management System - Local Development

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║    User Management System - Local Development      ║
echo ╠════════════════════════════════════════════════════╣
echo ║  Backend:   http://localhost:5000                  ║
echo ║  Frontend:  http://localhost:5173                  ║
echo ║  MySQL:     localhost:3306                         ║
echo ╚════════════════════════════════════════════════════╝
echo.
echo [INFO] LƯU Ý: Cần MySQL đã cài đặt và chạy trước!
echo [INFO] Nếu chưa có MySQL, hãy dùng: .\docker-start.bat
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

:: Kill any existing node processes
echo [INFO] Stopping existing servers...
taskkill /F /IM node.exe >nul 2>nul
timeout /t 2 /nobreak >nul

:: Start Backend Server in new window
echo [INFO] Starting Backend Server (port 5000)...
cd /d "%~dp0backend"
if not exist "node_modules" (
    echo [INFO] Installing backend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install backend dependencies!
        pause
        exit /b 1
    )
)
echo [INFO] Backend will connect to MySQL at localhost:3306
echo [INFO] Make sure MySQL is running and database 'user_management' exists!
timeout /t 2 /nobreak >nul
start "Backend Server - Port 5000" cmd /k "title Backend Server && node server.js"

:: Wait for backend to start
timeout /t 3 /nobreak >nul

:: Start Frontend Server in new window
echo [INFO] Starting Frontend Server (port 5173)...
cd /d "%~dp0frontend"
if not exist "node_modules" (
    echo [INFO] Installing frontend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install frontend dependencies!
        pause
        exit /b 1
    )
)
start "Frontend Server - Port 5173" cmd /k "title Frontend Server && npm run dev"

:: Wait and open browser
timeout /t 5 /nobreak >nul
echo [INFO] Opening browser...
start http://localhost:5173

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║          Servers Starting in Background...         ║
echo ╠════════════════════════════════════════════════════╣
echo ║  Frontend:  http://localhost:5173  (Main App)      ║
echo ║  Backend:   http://localhost:5000  (API Server)    ║
echo ║  MySQL:     localhost:3306  (Required)             ║
echo ╠════════════════════════════════════════════════════╣
echo ║  Two new windows will open:                        ║
echo ║    1. Backend Server window                        ║
echo ║    2. Frontend Server window                       ║
echo ╠════════════════════════════════════════════════════╣
echo ║  To stop: Close both windows or run .\stop.bat     ║
echo ╚════════════════════════════════════════════════════╝
echo.
timeout /t 3 /nobreak >nul
start http://localhost:5173
echo [INFO] Opening browser in 3 seconds...
pause
