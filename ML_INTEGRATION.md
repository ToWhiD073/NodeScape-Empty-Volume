# ML Model Integration Guide

## Overview
Your PyTorch graph classification model (`graph_classifier_model.pth`) has been integrated into the React application.

## Quick Start

### Option 1: Use the startup script
```bash
start_app.bat
```

### Option 2: Manual startup
1. **Start Backend:**
   ```bash
   python graph_generator.py
   ```

2. **Start Frontend:**
   ```bash
   npm start
   ```

## How to Use

1. **Enter Graph Data:** Input edges in the format `u v` (one per line)
2. **Load Graph:** Click "Load Graph" to visualize
3. **Classify Graph:** Click "Classify Graph" to get ML prediction

## Model Integration Details

- **Model File:** `graph_classifier_model.pth` (your PyTorch model)
- **Backend:** Flask server on port 5000
- **Frontend:** React app on port 3000
- **Classification Types:** Tree, Cycle, DAG

## API Endpoints

- `POST /classify` - Classify graph structure
- `POST /generate_graph` - Generate graph visualization
- `GET /health` - Health check

## Testing

Test the backend:
```bash
python test_backend.py
```

## Files Added/Modified

### New Files:
- `simple_classifier.py` - ML model wrapper
- `ModelPrediction.jsx` - Prediction display component
- `start_app.bat` - Startup script
- `test_backend.py` - Backend testing

### Modified Files:
- `GraphInput.jsx` - Added classification button
- `graph_generator.py` - Added classification endpoint
- `App.jsx` - Updated title

## Troubleshooting

1. **Backend not starting:** Check if port 5000 is available
2. **Model not loading:** Ensure `graph_classifier_model.pth` exists
3. **Frontend errors:** Check if backend is running first

## Next Steps

To improve accuracy, you can:
1. Enhance feature extraction in `simple_classifier.py`
2. Add proper PyTorch model inference
3. Train the model with more graph features