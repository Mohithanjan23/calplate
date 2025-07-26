// src/pages/AddMeal.jsx - Now with an AI Scanner!
import { useState } from 'react';
import ManualMealForm from '../components/ManualMealForm'; // We'll create this next
import { Camera } from 'lucide-react';

// --- AI SCANNER COMPONENT ---
const AiScanner = () => {
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResults([]); // Clear previous results
        }
    };

    const analyzeImage = async () => {
        if (!image) {
            alert('Please select an image first.');
            return;
        }
        setLoading(true);
        setResults([]);

        // This is a simplified example. In a real app, you'd have a backend
        // function to securely handle the API call with your PAT.
        // For this example, we'll assume a secure setup.

        // NOTE: You would typically call your own backend endpoint here,
        // which then calls the Clarifai API. For simplicity in this example,
        // we're showing the structure of what that backend call would do.
        // Direct frontend calls are not recommended for production.
        
        // This is a placeholder for the API call result.
        // Replace this with your actual Clarifai API call logic.
        setTimeout(() => {
            const mockApiResult = [
                { name: 'Scrambled Eggs', value: 0.98 },
                { name: 'Toast', value: 0.95 },
                { name: 'Coffee', value: 0.89 },
            ];
            setResults(mockApiResult);
            setLoading(false);
        }, 2000); // Simulate API call delay
    };

    return (
        <div className="space-y-4">
            <div className="relative border-2 border-dashed border-white/30 rounded-lg p-6 text-center">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center">
                    <Camera size={40} className="text-text-secondary mb-2" />
                    {previewUrl ? (
                        <img src={previewUrl} alt="Meal preview" className="max-h-48 rounded-lg" />
                    ) : (
                        <p className="text-text-secondary">Click to upload a photo</p>
                    )}
                </div>
            </div>

            {previewUrl && (
                <button
                    onClick={analyzeImage}
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-semibold text-white transition ${loading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'}`}
                >
                    {loading ? 'Analyzing...' : '✨ Analyze Meal'}
                </button>
            )}

            {results.length > 0 && (
                <div>
                    <h3 className="font-bold mb-2">Detected Items:</h3>
                    <ul className="space-y-2">
                        {results.map(item => (
                            <li key={item.name} className="bg-black/20 p-3 rounded-lg flex justify-between">
                                <span>{item.name}</span>
                                <button className="text-sm text-primary font-semibold">Log</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// --- MAIN AddMeal PAGE COMPONENT ---
export default function AddMeal() {
  const [activeTab, setActiveTab] = useState('scan'); // 'scan' or 'manual'

  const TabButton = ({ tabName, children }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`w-full py-2 font-semibold transition-colors rounded-t-lg ${
        activeTab === tabName ? 'bg-surface text-primary' : 'bg-transparent text-text-secondary'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="p-4">
      <div className="flex">
        <TabButton tabName="scan">Scan with AI</TabButton>
        <TabButton tabName="manual">Manual Entry</TabButton>
      </div>

      <div className="bg-surface p-1 rounded-b-lg">
        {activeTab === 'scan' ? <AiScanner /> : <ManualMealForm />}
      </div>
    </div>
  );
}
