// D:\calplate\frontend\src\components\Dashboard\FoodScanner.jsx
import React, { useState, useRef } from "react";
import { Camera, Upload } from "lucide-react";

const FoodScanner = ({ onFoodDetected, onClose }) => {
  const [scanning, setScanning] = useState(false);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const simulateAIAnalysis = async (file) => {
    setScanning(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockResults = [
      { name: "Grilled Chicken Breast", calories: 165, confidence: 0.89 },
      { name: "Steamed Broccoli", calories: 25, confidence: 0.76 },
      { name: "Brown Rice", calories: 150, confidence: 0.82 }
    ];
    setScanning(false);
    return mockResults;
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    const foods = await simulateAIAnalysis(file);
    onFoodDetected(foods);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">AI Food Scanner</h2>

        {!image ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">Take a photo or upload your food</p>

            <div className="space-y-3">
              <button
                onClick={() => fileInputRef.current.click()}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center space-x-2"
              >
                <Camera className="w-5 h-5" />
                <span>Take Photo</span>
              </button>
              <button
                onClick={() => fileInputRef.current.click()}
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Image</span>
              </button>
            </div>
          </div>
        ) : scanning ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">AI is analyzing your food...</p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-green-600 font-medium">✅ Analysis complete!</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />

        <div className="flex space-x-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodScanner;
