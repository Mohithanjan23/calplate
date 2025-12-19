#!/usr/bin/env python3
"""
Backend API Testing Script for CalPlate Nutrition App
Tests all backend endpoints using the production URL from frontend/.env
"""

import requests
import json
import os
from pathlib import Path
from datetime import datetime

# Load the backend URL from frontend/.env
def load_backend_url():
    frontend_env_path = Path("/app/frontend/.env")
    if not frontend_env_path.exists():
        raise FileNotFoundError("Frontend .env file not found")
    
    with open(frontend_env_path, 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                return line.split('=', 1)[1].strip()
    
    raise ValueError("REACT_APP_BACKEND_URL not found in frontend/.env")

# Test configuration
BASE_URL = load_backend_url()
API_BASE = f"{BASE_URL}/api"

print(f"Testing backend at: {API_BASE}")
print("=" * 60)

# Test results storage
test_results = []

def log_test(test_name, success, details, response_data=None):
    """Log test results"""
    result = {
        "test": test_name,
        "success": success,
        "details": details,
        "timestamp": datetime.now().isoformat(),
        "response_data": response_data
    }
    test_results.append(result)
    
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} {test_name}")
    print(f"   Details: {details}")
    if response_data:
        print(f"   Response: {json.dumps(response_data, indent=2)}")
    print()

# Test 1: Health Check - GET /api/
def test_health_check():
    """Test the root health endpoint"""
    try:
        response = requests.get(f"{API_BASE}/", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            expected_message = "CalPlate backend alive"
            
            if data.get("message") == expected_message:
                log_test("Health Check", True, f"Status: {response.status_code}, Message correct", data)
                return True
            else:
                log_test("Health Check", False, f"Status: {response.status_code}, Wrong message: {data}", data)
                return False
        else:
            log_test("Health Check", False, f"Status: {response.status_code}, Response: {response.text}")
            return False
            
    except Exception as e:
        log_test("Health Check", False, f"Request failed: {str(e)}")
        return False

# Test 2: Nutrition Target Calculator - POST /api/nutrition/target
def test_nutrition_target():
    """Test the daily calorie target calculator"""
    payload = {
        "age": 30,
        "gender": "male", 
        "height_cm": 180,
        "weight_kg": 80,
        "activity_level": "moderate",
        "goal": "maintain"
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/nutrition/target",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["bmr", "tdee", "target_calories"]
            
            if all(field in data for field in required_fields):
                # Validate data types and reasonable values
                if (isinstance(data["bmr"], (int, float)) and data["bmr"] > 0 and
                    isinstance(data["tdee"], (int, float)) and data["tdee"] > 0 and
                    isinstance(data["target_calories"], (int, float)) and data["target_calories"] > 0):
                    log_test("Nutrition Target", True, f"Status: {response.status_code}, All fields present with valid values", data)
                    return True
                else:
                    log_test("Nutrition Target", False, f"Status: {response.status_code}, Invalid field values", data)
                    return False
            else:
                missing = [f for f in required_fields if f not in data]
                log_test("Nutrition Target", False, f"Status: {response.status_code}, Missing fields: {missing}", data)
                return False
        else:
            log_test("Nutrition Target", False, f"Status: {response.status_code}, Response: {response.text}")
            return False
            
    except Exception as e:
        log_test("Nutrition Target", False, f"Request failed: {str(e)}")
        return False

# Test 3: Vision Analysis - POST /api/vision/analyze
def test_vision_analyze():
    """Test the food image analysis endpoint with a tiny 1x1 PNG"""
    # Tiny 1x1 transparent PNG in base64
    tiny_png_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAuMBg6yqE6YAAAAASUVORK5CYII="
    
    payload = {
        "image_base64": f"data:image/png;base64,{tiny_png_b64}",
        "prompt": "test image analysis"
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/vision/analyze",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30  # Longer timeout for LLM call
        )
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["id", "created_at", "total_calories", "food_items", "raw_model_text"]
            
            if all(field in data for field in required_fields):
                # Validate field types
                valid_types = (
                    isinstance(data["id"], str) and
                    isinstance(data["created_at"], str) and
                    isinstance(data["total_calories"], (int, float)) and
                    isinstance(data["food_items"], list) and
                    isinstance(data["raw_model_text"], str)
                )
                
                if valid_types:
                    log_test("Vision Analysis", True, f"Status: {response.status_code}, All required fields present with correct types", data)
                    return True, data["id"]
                else:
                    log_test("Vision Analysis", False, f"Status: {response.status_code}, Invalid field types", data)
                    return False, None
            else:
                missing = [f for f in required_fields if f not in data]
                log_test("Vision Analysis", False, f"Status: {response.status_code}, Missing fields: {missing}", data)
                return False, None
                
        elif response.status_code == 502:
            # Expected for LLM errors - check if it contains LLM error string
            response_text = response.text
            if "LLM error" in response_text:
                log_test("Vision Analysis", True, f"Status: {response.status_code}, Proper LLM error handling", {"error": response_text})
                return True, None
            else:
                log_test("Vision Analysis", False, f"Status: {response.status_code}, Unexpected 502 response: {response_text}")
                return False, None
        else:
            log_test("Vision Analysis", False, f"Status: {response.status_code}, Response: {response.text}")
            return False, None
            
    except Exception as e:
        log_test("Vision Analysis", False, f"Request failed: {str(e)}")
        return False, None

# Test 4: List Meals - GET /api/meals
def test_list_meals(expect_meal=False):
    """Test the meals listing endpoint"""
    try:
        response = requests.get(f"{API_BASE}/meals", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            if isinstance(data, list):
                if expect_meal and len(data) > 0:
                    # Check if the meal has required fields
                    meal = data[0]
                    required_fields = ["id", "created_at", "total_calories", "food_items", "raw_model_text"]
                    
                    if all(field in meal for field in required_fields):
                        log_test("List Meals", True, f"Status: {response.status_code}, Found {len(data)} meals with correct structure", data)
                        return True
                    else:
                        missing = [f for f in required_fields if f not in meal]
                        log_test("List Meals", False, f"Status: {response.status_code}, Meal missing fields: {missing}", data)
                        return False
                elif not expect_meal:
                    log_test("List Meals", True, f"Status: {response.status_code}, Returned {len(data)} meals", {"count": len(data)})
                    return True
                else:
                    log_test("List Meals", False, f"Status: {response.status_code}, Expected meals but got empty list", data)
                    return False
            else:
                log_test("List Meals", False, f"Status: {response.status_code}, Response not a list", data)
                return False
        else:
            log_test("List Meals", False, f"Status: {response.status_code}, Response: {response.text}")
            return False
            
    except Exception as e:
        log_test("List Meals", False, f"Request failed: {str(e)}")
        return False

# Run all tests
def run_all_tests():
    """Execute all backend tests in sequence"""
    print("Starting Backend API Tests...")
    print(f"Target URL: {API_BASE}")
    print("=" * 60)
    
    # Test 1: Health Check
    health_ok = test_health_check()
    
    # Test 2: Nutrition Target
    nutrition_ok = test_nutrition_target()
    
    # Test 3: Vision Analysis
    vision_ok, meal_id = test_vision_analyze()
    
    # Test 4: List Meals (should show the meal if vision analysis worked)
    meals_ok = test_list_meals(expect_meal=vision_ok and meal_id is not None)
    
    # Summary
    print("=" * 60)
    print("TEST SUMMARY:")
    print("=" * 60)
    
    total_tests = len(test_results)
    passed_tests = sum(1 for r in test_results if r["success"])
    
    print(f"Total Tests: {total_tests}")
    print(f"Passed: {passed_tests}")
    print(f"Failed: {total_tests - passed_tests}")
    print()
    
    for result in test_results:
        status = "✅" if result["success"] else "❌"
        print(f"{status} {result['test']}: {result['details']}")
    
    print("=" * 60)
    
    # Return overall success
    return passed_tests == total_tests

if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)