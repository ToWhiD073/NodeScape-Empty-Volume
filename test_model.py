import torch
import torch.nn as nn

# Test script to analyze your model structure
def analyze_model():
    try:
        # Load the model
        model_data = torch.load('graph_classifier_model.pth', map_location='cpu')
        
        print("Model Analysis:")
        print("=" * 40)
        
        if isinstance(model_data, dict):
            print("Model is a state dictionary")
            print(f"Keys: {list(model_data.keys())}")
            
            # Analyze layer structure
            for key, tensor in model_data.items():
                print(f"{key}: {tensor.shape}")
        else:
            print("Model is a complete model object")
            print(f"Model type: {type(model_data)}")
            
            # Try to get state dict
            if hasattr(model_data, 'state_dict'):
                state_dict = model_data.state_dict()
                for key, tensor in state_dict.items():
                    print(f"{key}: {tensor.shape}")
        
        print("\nModel loaded successfully!")
        return True
        
    except Exception as e:
        print(f"Error loading model: {e}")
        return False

if __name__ == "__main__":
    analyze_model()