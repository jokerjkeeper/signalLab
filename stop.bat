@echo off
REM ============================================================
REM  Signal Lab - stop dev service (Vite dev server, port 5179)
REM ============================================================
setlocal enabledelayedexpansion
cd /d "%~dp0"

set PORT=5179
set FOUND=0

echo [Signal Lab] Looking for service on port %PORT% ...

REM --- find LISTENING PID on the port and kill its process tree ---
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":%PORT% .*LISTENING"') do (
    if not "%%P"=="0" (
        echo [Signal Lab] Killing PID %%P ...
        taskkill /PID %%P /T /F >nul 2>&1
        set FOUND=1
    )
)

REM --- also close the titled window opened by run.bat, if any ---
taskkill /FI "WINDOWTITLE eq SignalLab-Dev*" /T /F >nul 2>&1

if "!FOUND!"=="1" (
    echo [Signal Lab] Service stopped.
) else (
    echo [Signal Lab] No service found on port %PORT% (maybe already stopped).
)

endlocal
