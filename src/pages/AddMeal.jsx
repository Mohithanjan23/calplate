// src/pages/AddMeal.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ManualMealForm from '../components/ManualMealForm';
import { Camera, RefreshCw } from 'lucide-react';
import { ClarifaiStub, grpc } from "clarifai-nodejs-grpc";

const AiScanner = () => {
  const navigate = useNavigate();
  // ... (all the state from the previous AiScanner example: image, previewUrl, results, loading, error)
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const analyzeImage = async () => {
    // ... (The full analyzeImage function with the Clarifai API call)
    // This is the same function from our last response.
  };

  // The crucial next step is to make this function work!
  const handleLogItem = (itemName) => {
    // Navigate to the manual form and pass the detected item name as state
    navigate('/add', { state: { activeTab: 'manual', foodName: itemName } });
  };

  return (
    <div className="space-y-4">
      {/* ... (The UI for the file upload and "Analyze" button) ... */}
      {results.length > 0 && (
        <div>
          <h3 className="font-bold mb-2">Detected Items:</h3>
          <ul className="space-y-2">
            {results.map(item => (
              <li key={item.id} className="bg-black/20 p-3 rounded-lg flex justify-between items-center">
                <span>{item.name}</span>
                {/* This button now navigates to the form to confirm */}
                <button onClick={() => handleLogItem(item.name)} className="text-sm text-primary font-semibold hover:underline">
                  Confirm & Log
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


export default function AddMeal() {
  const location = useLocation();
  // Set the initial tab based on navigation state, otherwise default to 'scan'
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
        <TabB/utton tabName="manual">Manual Entry</TabButton>
      </div>
      <div className="bg-surface p-1 rounded-b-lg">
        {activeTab === 'scan' ? <AiScanner /> : <ManualMealForm />}
      </div>
    </div>
  );
}
