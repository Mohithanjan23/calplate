import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ManualMealForm from '../components/ManualMealForm';
import { Camera, RefreshCw } from 'lucide-react';
import Card from '../components/Card';

const AiScanner = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setError('');
            setResults([]);
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const analyzeImage = async () => {
        if (!image) return;
        setLoading(true);
        setError('');
        setResults([]);

        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = async () => {
            const base64Image = reader.result.split(',')[1];
            
            const USER_ID = 'clarifai';
            const APP_ID = 'main';
            const MODEL_ID = 'food-item-recognition';
            const PAT = import.meta.env.VITE_CLARIFAI_PAT;

            try {
                const response = await fetch(`https://api.clarifai.com/v2/users/${USER_ID}/apps/${APP_ID}/models/${MODEL_ID}/outputs`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Key ${PAT}`
                    },
                    body: JSON.stringify({
                        "inputs": [
                            { "data": { "image": { "base64": base64Image } } }
                        ]
                    })
                });

                if (!response.ok) {
                    throw new Error(`API Error: ${response.statusText}`);
                }

                const data = await response.json();
                const concepts = data.outputs[0].data.concepts;
                setResults(concepts);

            } catch (err) {
                console.error("Clarifai fetch error:", err);
                setError("Sorry, something went wrong analyzing the image.");
            } finally {
                setLoading(false);
            }
        };
        reader.onerror = () => {
            setLoading(false);
            setError("Failed to read the image file.");
        };
    };
    
    const handleLogItem = (itemName) => {
        navigate('/add', { state: { activeTab: 'manual', foodName: itemName } });
    };

    return (
        <Card className="!p-4 space-y-4">
            <div className="relative border-2 border-dashed border-white/30 rounded-lg p-6 text-center">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
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
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition bg-primary hover:bg-primary-dark disabled:bg-primary/50 disabled:cursor-not-allowed"
                >
                    {loading && <RefreshCw className="animate-spin" size={20} />}
                    {loading ? 'Analyzing...' : '✨ Analyze Meal'}
                </button>
            )}

            {error && <p className="text-red-400 text-center">{error}</p>}

            {results.length > 0 && (
                <div>
                    <h3 className="font-bold mb-2">Detected Items:</h3>
                    <ul className="space-y-2">
                        {results.map(item => (
                            <li key={item.id} className="bg-black/20 p-3 rounded-lg flex justify-between items-center">
                                <span>{item.name}</span>
                                <button onClick={() => handleLogItem(item.name)} className="text-sm text-primary font-semibold hover:underline">
                                  Confirm & Log
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Card>
    );
};


export default function AddMeal() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'scan');

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
      <div className="bg-surface rounded-b-lg">
        {activeTab === 'scan' ? <AiScanner /> : <ManualMealForm />}
      </div>
    </div>
  );
}