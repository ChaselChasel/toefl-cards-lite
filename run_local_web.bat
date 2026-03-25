@echo off
setlocal
cd /d "%~dp0"

where py >nul 2>nul
if %errorlevel%==0 (
  start "TOEFL Cards Lite Server" cmd /c "py -m http.server 8000"
  goto :open
)

where python >nul 2>nul
if %errorlevel%==0 (
  start "TOEFL Cards Lite Server" cmd /c "python -m http.server 8000"
  goto :open
)

echo [ERROR] Python not found. Please install Python 3 first.
echo Download: https://www.python.org/downloads/
pause
exit /b 1

:open
timeout /t 1 >nul
start "" "http://127.0.0.1:8000/index.html"
echo Server started at http://127.0.0.1:8000/index.html
echo Close the "TOEFL Cards Lite Server" window to stop it.
endlocal
