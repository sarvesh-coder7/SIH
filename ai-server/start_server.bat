@echo off
cd /d "%~dp0"
echo ===================================================
echo Starting SolveSphere AI Server on Port 8001...
echo ===================================================

if exist "venv\Scripts\python.exe" (
    "venv\Scripts\python.exe" -m uvicorn app:app --reload --host 0.0.0.0 --port 8001
) else (
    echo [!] Virtual environment not found. Using system python...
    python -m uvicorn app:app --reload --host 0.0.0.0 --port 8001
)
pause
