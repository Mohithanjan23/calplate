import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SelectionButton = ({ label, selected, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full text-left p-4 border rounded-lg transition flex items-center ${
            selected ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-200'
        }`}
    >
        <span className="font-semibold">{label}</span>
        {selected && <Check size={20} className="ml-auto" />}
    </button>
);

export default function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [userData, setUserData] = useState({});
    const totalSteps = 5;

    const handleNext = () => setStep(prev => Math.min(prev + 1, totalSteps));
    const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

    const updateUserData = (key, value) => {
        setUserData(prev => ({ ...prev, [key]: value }));
        handleNext(); // Automatically go to next step on selection
    };

    const handleSubmit = () => {
        console.log("Onboarding complete, navigating to auth:", userData);
        navigate('/auth', { state: { onboardingData: userData } });
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <h2 className="text-3xl font-bold mb-4">What is your primary goal?</h2>
                        <div className="space-y-3">
                            <SelectionButton label="Lose Weight" selected={userData.goal === 'lose'} onClick={() => updateUserData('goal', 'lose')} />
                            <SelectionButton label="Maintain Weight" selected={userData.goal === 'maintain'} onClick={() => updateUserData('goal', 'maintain')} />
                            <SelectionButton label="Gain Weight" selected={userData.goal === 'gain'} onClick={() => updateUserData('goal', 'gain')} />
                        </div>
                    </div>
                );
            // Add other steps from your screenshots here
            default:
                return (
                    <div>
                        <h2 className="text-3xl font-bold mb-4">You're all set!</h2>
                        <p className="text-gray-500">Click Finish to create your account and get started.</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col p-4">
            <div className="flex items-center gap-4">
                {step > 1 && <button onClick={handleBack}><ArrowLeft size={24} /></button>}
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <motion.div className="bg-black h-1.5 rounded-full" animate={{ width: `${(step / totalSteps) * 100}%` }} />
                </div>
            </div>

            <div className="flex-1 flex items-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="py-4">
                <button
                    onClick={step === totalSteps ? handleSubmit : handleNext}
                    className="w-full py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800"
                >
                    {step === totalSteps ? 'Finish' : 'Continue'}
                </button>
            </div>
        </div>
    );
}