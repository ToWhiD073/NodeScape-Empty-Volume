import requests
import json

def test_backend():
    """Test the backend classification endpoint"""
    
    # Test data - simple tree
    test_edges = [
        ["A", "B"],
        ["B", "C"],
        ["B", "D"]
    ]
    
    try:
        # Test classification endpoint
        response = requests.post('http://localhost:5000/classify', 
                               json={'edges': test_edges},
                               timeout=10)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Backend is working!")
            print(f"Classification result: {json.dumps(result, indent=2)}")
            return True
        else:
            print(f"❌ Backend error: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Make sure it's running on port 5000")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing backend connection...")
    test_backend()