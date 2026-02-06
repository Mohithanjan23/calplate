import { useState } from 'react';
import { Plus, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingActionButton() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [water, setWater] = useState(0);

    const addWater = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Simulate log
        setWater(prev => prev + 250);
        alert(`Logged 250ml water! Total: ${water + 250}ml`);
        setOpen(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        onClick={addWater}
                        className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer text-white"
                    >
                        <Droplets className="w-5 h-5" />
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setOpen(!open)}
                onDoubleClick={() => navigate('/scanner')}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all ${open ? 'bg-indigo-700 rotate-45' : 'bg-slate-900'
                    } text-white`}
            >
                <Plus className="w-8 h-8" />
            </button>

            {open && (
                <>
                    <div onClick={() => navigate('/log-workout')} className="absolute right-0 bottom-36 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer text-white">
                        <span className="font-bold text-[10px] uppercase">Gym</span>
                    </div>
                    <div onClick={() => navigate('/scanner')} className="absolute right-0 bottom-20 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer text-white">
                        <span className="font-bold text-xs">Food</span>
                    </div>
                </>
            )}
        </div>
    );
}
