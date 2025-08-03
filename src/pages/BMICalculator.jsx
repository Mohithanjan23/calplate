import { useState } from 'react';
import Card from '../components/Card';
import { Ruler } from 'lucide-react';

export default function BMICalculator() {
  const [weight, setWeight] = useState(''); // in kg
  const [height, setHeight] = useState(''); // in cm
  const [bmi, setBmi] = useState(null);
  const [message, setMessage] = useState('');

  const calculateBmi = (e) => {
    e.preventDefault();
    const weightKg = parseFloat(weight);
    const heightM = parseFloat(height) / 100; // Convert cm to meters

    if (isNaN(weightKg) || isNaN(heightM) || weightKg <= 0 || heightM <= 0) {
      setMessage('Please enter a valid weight and height.');
      setBmi(null);
      return;
    }

    const bmiValue = weightKg / (heightM * heightM);
    setBmi(Number(bmiValue.toFixed(2)));

    if (bmiValue < 18.5) {
      setMessage('You are in the underweight range.');
    } else if (bmiValue >= 18.5 && bmiValue < 24.9) {
      setMessage('You are in the healthy weight range.');
    } else if (bmiValue >= 25 && bmiValue < 29.9) {
      setMessage('You are in the overweight range.');
    } else {
      setMessage('You are in the obesity range.');
    }
  };
  
  const inputStyles = "w-full px-4 py-2 bg-black/20 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="p-4 space-y-6">
        <div className="flex items-center gap-3">
            <Ruler size={28} />
            <h1 className="text-3xl font-bold">BMI Calculator</h1>
        </div>

        <Card>
            <form onSubmit={calculateBmi} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Weight (kg)</label>
                    <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g., 70" className={inputStyles}/>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Height (cm)</label>
                    <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g., 175" className={inputStyles}/>
                </div>

                <button type="submit" className="w-full py-3 rounded-lg font-semibold text-white transition bg-primary hover:bg-primary-dark">
                    Calculate BMI
                </button>
            </form>

            {bmi !== null && (
                <div className="mt-6 text-center border-t border-white/10 pt-6">
                    <p className="text-text-secondary">Your BMI is</p>
                    <p className="text-4xl font-bold text-primary">{bmi}</p>
                    <p className="mt-2">{message}</p>
                </div>
            )}
        </Card>
    </div>
  );
}