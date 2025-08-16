@echo off
setlocal

REM Go to the directory of the .bat file
set "BAT_DIR=%~dp0"
cd /d "%BAT_DIR%"

echo Starting backend server...
start "" /b cmd /c "cd backEnd\Controller && node Route.mjs"

REM Check if build exists
if not exist "frontEnd\dist" (
    echo Build not found. Running npm run build first...
    cd frontEnd
    call npm run build
    cd ..
) else (
    echo Build found. Skipping build step.
)

echo Starting frontend server...
start "" /b cmd /c "cd frontEnd && npm run preview"

REM Wait a bit to make sure server starts before opening browser
timeout /t 3 >nul

echo Opening frontend in browser...
start http://localhost:4173/

echo Both servers are running.
pause
