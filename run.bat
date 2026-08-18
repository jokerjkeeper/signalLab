@echo off
REM ============================================================
REM  Signal Lab - start dev service (Vite dev server, port 5179)
REM  The dev server also acts as the write-back backend for
REM  data/projects.json
REM ============================================================
setlocal
cd /d "%~dp0"

set PORT=5179

REM --- already running? do not start twice ---
netstat -ano | findstr /R /C:":%PORT% .*LISTENING" >nul 2>&1
if %errorlevel%==0 (
    echo [Signal Lab] Service already running on port %PORT%, opening browser...
    start "" "http://localhost:%PORT%/"
    goto :eof
)

REM --- install deps on first run ---
if not exist "node_modules" (
    echo [Signal Lab] node_modules not found, running npm install ...
    call npm install
    if errorlevel 1 (
        echo [Signal Lab] npm install failed, aborting.
        pause
        exit /b 1
    )
)

echo [Signal Lab] Starting dev server on port %PORT% ...
REM run in a separate, identifiable window so stop.bat can close it
start "SignalLab-Dev" cmd /c "npm run dev"

echo [Signal Lab] Waiting for service to be ready...
timeout /t 3 /nobreak >nul
start "" "http://localhost:%PORT%/"

echo [Signal Lab] Started. Run stop.bat to stop it.
endlocal
