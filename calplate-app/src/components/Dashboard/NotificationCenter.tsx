import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationCenter() {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Smart Reminder Logic
        const checkTime = () => {
            const hours = new Date().getHours();

            // If it's past 2 PM (14:00) and we haven't logged lunch (simulated check)
            if (hours >= 14 && hours < 16) {
                setMessage("Don't forget to track your lunch, Mohith!");
                setShow(true);
            } else if (hours >= 20) {
                setMessage("Final log check! Did you have dinner?");
                setShow(true);
            } else {
                // Default welcome or tip
                // setMessage("Tip: Drink water before your meal!");
                // setShow(true);
            }
        };

        // Check immediatley for demo purposes, then interval
        checkTime();
        // In real app, check context or last logged time

        const timer = setTimeout(() => setShow(true), 1500); // Demo delay
        return () => clearTimeout(timer);
    }, []);

    if (!message) return null;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-indigo-900 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between mb-6 relative overflow-hidden"
                >
                    {/* Decorative bg */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-800 rounded-full blur-2xl -mr-10 -mt-10" />

                    <div className="flex items-center gap-3 relative z-10">
                        <div className="p-2 bg-indigo-800 rounded-xl">
                            <Bell className="w-5 h-5 text-indigo-300" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">Smart Reminder</p>
                            <p className="text-white/80 text-xs">{message}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShow(false)}
                        className="relative z-10 p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4 text-white/60" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
