@echo off
title NEUROFIT Local Server
echo ====================================================
echo   Starting NEUROFIT Local Web Server at:
echo   http://localhost:8000
echo ====================================================
echo.
start http://localhost:8000
python -m http.server 8000
pause
