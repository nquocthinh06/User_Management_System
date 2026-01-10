@echo off
title Stop All Servers

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║           Stopping All Servers...                  ║
echo ╚════════════════════════════════════════════════════╝
echo.

taskkill /F /IM node.exe >nul 2>nul

echo [SUCCESS] All servers stopped!
echo.
pause
