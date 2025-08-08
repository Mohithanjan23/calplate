import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ManualMealForm from '../components/ManualMealForm.jsx';
import AiScanner from '../components/AiScanner.jsx'; // Assuming you've separated this
import Card from '../components/Card.jsx';

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