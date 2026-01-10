# Script dừng MySQL local để giải phóng port 3306 cho Docker
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Stop MySQL Local Service" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra quyền admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "[WARNING] This script requires Administrator privileges!" -ForegroundColor Yellow
    Write-Host "[INFO] Please run PowerShell as Administrator" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Right-click PowerShell -> Run as Administrator" -ForegroundColor Yellow
    pause
    exit 1
}

# Tìm MySQL service
$mysqlServices = Get-Service | Where-Object { $_.Name -like "*mysql*" -or $_.DisplayName -like "*MySQL*" }

if ($mysqlServices.Count -eq 0) {
    Write-Host "[INFO] No MySQL service found" -ForegroundColor Yellow
    Write-Host "[INFO] Trying to stop mysqld.exe process..." -ForegroundColor Yellow
    
    # Tìm process mysqld.exe
    $mysqlProcess = Get-Process -Name mysqld -ErrorAction SilentlyContinue
    if ($mysqlProcess) {
        Write-Host "[INFO] Found mysqld.exe process (PID: $($mysqlProcess.Id))" -ForegroundColor Green
        Write-Host "[INFO] Stopping mysqld.exe..." -ForegroundColor Yellow
        Stop-Process -Id $mysqlProcess.Id -Force
        Start-Sleep -Seconds 2
        
        # Kiểm tra lại
        $checkProcess = Get-Process -Name mysqld -ErrorAction SilentlyContinue
        if (-not $checkProcess) {
            Write-Host "[SUCCESS] mysqld.exe stopped successfully!" -ForegroundColor Green
        } else {
            Write-Host "[ERROR] Failed to stop mysqld.exe" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "[ERROR] No MySQL process found" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "[INFO] Found MySQL service(s):" -ForegroundColor Green
    foreach ($service in $mysqlServices) {
        Write-Host "  - $($service.DisplayName) ($($service.Name)) - Status: $($service.Status)" -ForegroundColor Cyan
    }
    Write-Host ""
    
    foreach ($service in $mysqlServices) {
        if ($service.Status -eq 'Running') {
            Write-Host "[INFO] Stopping service: $($service.DisplayName)..." -ForegroundColor Yellow
            Stop-Service -Name $service.Name -Force
            Start-Sleep -Seconds 2
            
            $service.Refresh()
            if ($service.Status -eq 'Stopped') {
                Write-Host "[SUCCESS] Service stopped: $($service.DisplayName)" -ForegroundColor Green
            } else {
                Write-Host "[WARNING] Service may still be running: $($service.DisplayName)" -ForegroundColor Yellow
            }
        }
    }
}

# Kiểm tra port 3306
Write-Host ""
Write-Host "[INFO] Checking port 3306..." -ForegroundColor Yellow
Start-Sleep -Seconds 1

$port3306 = Get-NetTCPConnection -LocalPort 3306 -ErrorAction SilentlyContinue
if ($port3306) {
    Write-Host "[WARNING] Port 3306 is still in use!" -ForegroundColor Red
    Write-Host "  Process ID: $($port3306.OwningProcess)" -ForegroundColor Yellow
    $process = Get-Process -Id $port3306.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "  Process Name: $($process.ProcessName)" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "You may need to manually stop the process or restart your computer" -ForegroundColor Yellow
} else {
    Write-Host "[SUCCESS] Port 3306 is now available!" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Next Steps" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Now you can run:" -ForegroundColor White
Write-Host "  .\docker-start.bat" -ForegroundColor Green
Write-Host ""
Write-Host "To restart MySQL local later, run:" -ForegroundColor White
Write-Host "  net start MySQL80" -ForegroundColor Yellow
Write-Host "  (or find MySQL service in Services.msc)" -ForegroundColor Yellow
Write-Host ""
pause

