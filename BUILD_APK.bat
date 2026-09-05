@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo     QueueLess - Android APK Build Pipeline
echo ===================================================
echo.

set "PATH=C:\Users\Asus\nodejs;%PATH%"

echo [1/3] Building Next.js Web Assets...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Web asset build failed!
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Syncing Capacitor Android Project...
call npx cap sync android
if %errorlevel% neq 0 (
    echo [ERROR] Capacitor sync failed!
    pause
    exit /b %errorlevel%
)

echo.
echo [3/3] Compiling Native Android APK with Gradle...
cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo.
    echo ==============================================================
    echo [NOTE] Local Android SDK is required to compile .apk on PC.
    echo.
    echo Options to get your APK:
    echo 1. Open folder 'queueless\android' in Android Studio
    echo    and click Build ^> Build APK(s).
    echo 2. Use GitHub Actions workflow (.github/workflows/build-apk.yml)
    echo    which compiles app-debug.apk in the cloud automatically.
    echo 3. Install on phone instantly via Chrome 'Add to Home Screen'
    echo    (WebAPK full screen native app).
    echo ==============================================================
    cd ..
    pause
    exit /b 1
)

cd ..
echo.
echo ===================================================
echo  SUCCESS! APK generated at:
echo  android\app\build\outputs\apk\debug\app-debug.apk
echo ===================================================
pause

