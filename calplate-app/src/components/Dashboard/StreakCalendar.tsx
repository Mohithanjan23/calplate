import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy } from 'lucide-react';

export default function StreakCalendar() {
    const [streak, setStreak] = useState(0);
    const [history, setHistory] = useState<boolean[]>([]);

    useEffect(() => {
        // Simulate fetching history or reading from localStorage
        const storedStreak = parseInt(localStorage.getItem('calplate_streak') || '0');
        setStreak(storedStreak);

        // Mock 30-day history (true = goal met, false = missed)
        // In a real app, this would come from Supabase daily logs
        const mockHistory = Array.from({ length: 30 }, () => {
            // Randomize some data for visual variation, favoring success
            return Math.random() > 0.3;
        });
        setHistory(mockHistory);
    }, []);

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-50 rounded-2xl text-orange-500">
                        <Flame className="w-6 h-6 fill-orange-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">{streak} Day Streak</h3>
                        <p className="text-slate-500 text-sm">Keep the fire burning!</p>
                    </div>
                </div>
                <Trophy className="w-6 h-6 text-yellow-500" />
            </div>

            <div className="grid grid-cols-7 gap-2">
                {history.map((met, index) => (
                    <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className={`
              aspect-square rounded-lg flex items-center justify-center text-xs font-medium
              ${met
                                ? 'bg-green-500 text-white shadow-sm shadow-green-200'
                                : 'bg-slate-100 text-slate-300'
                            }
            `}
                    >
                        {met && <CheckIcon />}
                    </motion.div>
                ))}
                {/* Placeholder for future days */}
                {Array.from({ length: 5 }).map((_, i) => ( // Fill remaining grid
                    <div key={`future-${i}`} className="aspect-square rounded-lg bg-slate-50 border border-slate-100 border-dashed" />
                ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>Last 30 Days</span>
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> Goal Met</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-200" /> Missed</span>
                </div>
            </div>
        </div>
    );
}

function CheckIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    )
}
