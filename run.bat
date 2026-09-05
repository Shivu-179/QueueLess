@echo off
title QueueLess - Smart Crowd Prediction System
echo ========================================================
echo   Starting QueueLess (Smart Crowd Prediction System)
echo ========================================================
echo.

set PATH=C:\Users\Asus\nodejs;%PATH%

echo Checking Node.js environment...
call node -v
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not found in C:\Users\Asus\nodejs.
    pause
    exit /b 1
)

echo Starting QueueLess Development Server...
start "" http://localhost:3000
npm run dev

pause