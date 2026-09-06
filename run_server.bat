@echo off
title QueueLess Smart Crowd Server
cd /d "%~dp0"
set PATH=C:\Users\Asus\nodejs;%PATH%
echo ===================================================
echo   Starting QueueLess Production Server on 0.0.0.0:3000
echo   Local:   http://localhost:3000
echo   Network: http://10.119.2.183:3000
echo ===================================================
node ./node_modules/next/dist/bin/next start -H 0.0.0.0 -p 3000
if errorlevel 1 (
    echo Production server failed, starting development server fallback...
    node ./node_modules/next/dist/bin/next dev -H 0.0.0.0 -p 3000
)
pause

