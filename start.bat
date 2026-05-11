@echo off
echo Starting JusticeBot...

:: Start FastAPI Backend
echo Starting Backend on port 8000...
start cmd /k "cd f:\Antigravity_p\RP\justice-chatbot && venv\Scripts\python.exe -m uvicorn backend.app:app --reload"

:: Start React Frontend
echo Starting Frontend on port 5173...
start cmd /k "cd f:\Antigravity_p\RP\justice-chatbot\frontend && npm run dev"

echo Both services are starting up!
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173

