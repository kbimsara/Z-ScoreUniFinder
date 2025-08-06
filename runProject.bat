@echo off

echo Starting Backend...
cd back-end
call venv\Scripts\activate
start cmd /k "python run.py"
cd ..

echo Starting Frontend...
cd front-end
start cmd /k "npm run dev"
echo All processes started.
pause