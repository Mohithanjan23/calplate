
import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2 } from 'lucide-react';

interface FoodScannerProps {
    onDetected: (food: { name: string; calories: number }) => void;
}

export const FoodScanner: React.FC<FoodScannerProps> = ({ onDetected }) => {
    const [scanning, setScanning] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const simulateScan = async () => {
        setScanning(true);
        // Simulate AI delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock results
        const results = [
            { name: 'Grilled Chicken Breast', calories: 165, confidence: 0.89 },
            { name: 'Steamed Broccoli', calories: 25, confidence: 0.76 },
            { name: 'Brown Rice', calories: 150, confidence: 0.82 }
        ];

        setScanning(false);
        return results;
    };

    const handlefileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                handleScan();
            };
            reader.readAsDataURL(file);
        }
    };

    const handleScan = async () => {
        const results = await simulateScan();
        // For simplified UX, auto-select the first item or let user choose.
        // Here we'll just auto-select the main item as "detected".
        // In a real app we'd show a list.
        onDetected(results[0]);
    };

    if (scanning) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center h-64">
                <div className="relative">
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25"></div>
                    <div className="bg-white p-4 rounded-full shadow-xl relative z-10">
                        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                    </div>
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">Analyzing food...</h3>
                <p className="text-sm text-gray-500">Identifying ingredients and calories</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-6 text-center hover:bg-gray-100 transition-colors cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handlefileUpload}
            />

            {image ? (
                <div className="relative">
                    <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-lg mx-auto" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white font-medium">Click to change</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex justify-center gap-4 mb-4">
                        <div className="bg-white p-3 rounded-full shadow-sm text-blue-500">
                            <Camera className="w-6 h-6" />
                        </div>
                        <div className="bg-white p-3 rounded-full shadow-sm text-green-500">
                            <Upload className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="font-medium text-gray-900">Scan Food</h3>
                    <p className="text-sm text-gray-500 mt-1">Take a photo or upload to analyze</p>
                </>
            )}
        </div>
    );
};
