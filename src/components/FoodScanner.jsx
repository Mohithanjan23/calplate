import { useState, useRef } from 'react';
import { Camera, Upload, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FoodScanner({ onFoodDetected, onClose }) {
  const [scanning, setScanning] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setScanning(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const base64Image = reader.result.split(',')[1];
        try {
            const PAT = import.meta.env.VITE_CLARIFAI_PAT;
            const response = await fetch(`https://api.clarifai.com/v2/models/food-item-recognition/outputs`, {
                method: 'POST',
                headers: { 'Authorization': `Key ${PAT}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ inputs: [{ data: { image: { base64: base64Image } } }] })
            });
            const data = await response.json();
            const concepts = data.outputs[0].data.concepts;
            
            // For simplicity, we'll map the concept name to a placeholder calorie value
            const detectedFoods = concepts.map(concept => ({ name: concept.name, calories: 100, confidence: concept.value }));
            onFoodDetected(detectedFoods);

        } catch (error) {
            toast.error("AI analysis failed. Please try again.");
            console.error(error);
            onClose();
        } finally {
            setScanning(false);
        }
    };
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">AI Food Scanner</h2>
        
        {imagePreview ? (
            <div className="text-center">
                <img src={imagePreview} alt="Food preview" className="w-full h-48 object-cover rounded-lg mb-4" />
                {scanning && (
                    <>
                        <RefreshCw className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-spin" />
                        <p className="text-gray-600">AI is analyzing your food...</p>
                    </>
                )}
            </div>
        ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">Upload an image of your food</p>
              <button onClick={() => fileInputRef.current.click()} className="py-2 px-4 bg-black text-white font-semibold rounded-lg">
                Upload Image
              </button>
            </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        <button onClick={onClose} className="w-full mt-4 py-3 border border-gray-300 font-semibold rounded-lg">Cancel</button>
      </div>
    </div>
  );
}