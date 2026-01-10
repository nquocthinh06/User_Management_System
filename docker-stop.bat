@echo off
title Docker - Stop Services

echo.
echo [INFO] Stopping all Docker services...
docker-compose down

echo.
echo [SUCCESS] All services stopped!
echo.
pause
