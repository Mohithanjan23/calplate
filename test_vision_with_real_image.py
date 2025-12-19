#!/usr/bin/env python3
"""
Test vision analysis with a more realistic food image
"""

import requests
import json
import base64
from PIL import Image
import io

# Create a simple colored square image (100x100 pixels) that looks more like food
def create_test_food_image():
    # Create a 100x100 image with a brown color (like bread or cookie)
    img = Image.new('RGB', (100, 100), color=(139, 69, 19))  # Brown color
    
    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    img_data = buffer.getvalue()
    
    return base64.b64encode(img_data).decode('utf-8')

# Load backend URL
def load_backend_url():
    with open('/app/frontend/.env', 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                return line.split('=', 1)[1].strip()

BASE_URL = load_backend_url()
API_BASE = f"{BASE_URL}/api"

# Test with a more realistic image
food_image_b64 = create_test_food_image()

payload = {
    "image_base64": f"data:image/png;base64,{food_image_b64}",
    "prompt": "This is a brown square food item, please analyze"
}

print("Testing vision analysis with a 100x100 brown square image...")
print(f"API endpoint: {API_BASE}/vision/analyze")

try:
    response = requests.post(
        f"{API_BASE}/vision/analyze",
        json=payload,
        headers={"Content-Type": "application/json"},
        timeout=30
    )
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("✅ SUCCESS - Vision analysis worked!")
        print(json.dumps(data, indent=2))
        
        # Now test if the meal was saved
        print("\nTesting if meal was saved...")
        meals_response = requests.get(f"{API_BASE}/meals", timeout=10)
        if meals_response.status_code == 200:
            meals = meals_response.json()
            print(f"Found {len(meals)} meals in database")
            if len(meals) > 0:
                print("Latest meal:")
                print(json.dumps(meals[0], indent=2))
        
    else:
        print(f"❌ FAILED - Status: {response.status_code}")
        print(f"Response: {response.text}")
        
except Exception as e:
    print(f"❌ ERROR: {str(e)}")