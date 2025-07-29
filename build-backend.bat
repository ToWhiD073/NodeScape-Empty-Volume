@echo off
echo Building Backend Docker Image
echo ============================

docker build -f Dockerfile.backend -t algo-visualize-backend:latest .

echo Backend image built successfully!
echo Run with: docker run -p 5000:5000 algo-visualize-backend:latest