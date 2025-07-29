@echo off
echo Starting Algo-Visualize Application
echo ===================================

echo Installing Python dependencies...
pip install torch numpy networkx flask flask-cors matplotlib

echo Starting Python backend...
start "Backend" cmd /k "python graph_generator.py"

echo Waiting for backend to start...
timeout /t 3

echo Starting React frontend...
start "Frontend" cmd /k "npm start"

echo Both services are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
pause