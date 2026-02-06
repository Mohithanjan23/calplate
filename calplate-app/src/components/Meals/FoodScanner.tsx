import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Image as ImageIcon, Loader2, Check } from 'lucide-react';

const CLARIFAI_API_KEY = import.meta.env.VITE_CLARIFAI_API_KEY;
const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

interface ScannedItem {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export default function FoodScanner() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>('');
    const [results, setResults] = useState<ScannedItem[] | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                analyzeImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const simulateAIAnalysis = (): Promise<ScannedItem[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mocking multiple results
                resolve([
                    { name: "Grilled Chicken Salad", calories: 450, protein: 35, carbs: 12, fat: 20 },
                    { name: "Caesar Salad", calories: 550, protein: 25, carbs: 20, fat: 42 },
                    { name: "Garden Salad", calories: 200, protein: 5, carbs: 15, fat: 10 }
                ]);
            }, 2000);
        });
    };

    const analyzeImage = async (base64Image: string) => {
        console.log("Analyzing:", base64Image ? "Image Present" : "No Image");
        setLoading(true);
        setStatus('Analyzing image...');
        setResults(null);

        try {
            let analysisResults: ScannedItem[];

            if (CLARIFAI_API_KEY && SPOONACULAR_API_KEY) {
                // Mocking API call for now even if keys exist to ensure flow works in this demo
                console.log("Keys present, simulating fallback for demo flow...");
                analysisResults = await simulateAIAnalysis();
            } else {
                setStatus('Using simulation mode (No API Keys)...');
                analysisResults = await simulateAIAnalysis();
            }

            // Allow user to select from results
            setResults(analysisResults);
            setStatus('Select the best match');

        } catch (error) {
            console.error("Analysis failed:", error);
            setStatus('Analysis failed. Try manual entry.');
        } finally {
            setLoading(false);
        }
    };

    const confirmSelection = (item: ScannedItem) => {
        navigate('/add-meal', { state: { scannedData: item, image: image } });
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 to-slate-900 z-0" />

            <div className="z-10 w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                        AI Food Scanner
                    </h1>
                    <p className="text-slate-400">Snap a photo to track calories instantly</p>
                </div>

                {!results ? (
                    <>
                        <div className="aspect-square bg-slate-800/50 rounded-3xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center relative overflow-hidden group">
                            {image ? (
                                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <>
                                    <Camera className="w-16 h-16 text-slate-600 mb-4 group-hover:scale-110 transition-transform" />
                                    <p className="text-slate-500 font-medium">No image selected</p>
                                </>
                            )}

                            {loading && (
                                <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center backdrop-blur-sm">
                                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-3" />
                                    <p className="text-indigo-200 font-medium animate-pulse">{status}</p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                            >
                                <ImageIcon className="w-5 h-5 text-indigo-400" />
                                Upload
                            </button>
                            <button
                                onClick={() => {
                                    if (fileInputRef.current) {
                                        fileInputRef.current.setAttribute("capture", "environment");
                                        fileInputRef.current.click();
                                        fileInputRef.current.removeAttribute("capture");
                                    }
                                }}
                                className="p-4 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors flex items-center justify-center gap-2 font-semibold"
                            >
                                <Camera className="w-5 h-5" />
                                Snap
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="space-y-4">
                        <p className="text-center text-indigo-300 font-medium mb-2">We found multiple matches:</p>
                        {results.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => confirmSelection(item)}
                                className="w-full bg-slate-800 p-4 rounded-2xl flex items-center justify-between hover:bg-slate-700 hover:ring-2 hover:ring-indigo-500 transition-all text-left group"
                            >
                                <div>
                                    <div className="font-bold text-white">{item.name}</div>
                                    <div className="text-sm text-slate-400">{item.calories} kcal • {item.protein}g Protein</div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                                    <Check className="w-5 h-5" />
                                </div>
                            </button>
                        ))}
                        <button onClick={() => setResults(null)} className="w-full text-center text-slate-500 text-sm mt-4 hover:text-white">
                            Retake Photo
                        </button>
                    </div>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                />

                {!results && (
                    <button onClick={() => navigate('/dashboard')} className="w-full text-slate-500 hover:text-white transition-colors text-sm">
                        Cancel and go back
                    </button>
                )}
            </div>
        </div>
    );
}
