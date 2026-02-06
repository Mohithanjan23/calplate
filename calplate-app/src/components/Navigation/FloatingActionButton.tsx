import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FloatingActionButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/scanner')}
            className="fixed bottom-6 right-6 w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform z-50 text-white"
        >
            <Plus className="w-8 h-8" />
        </button>
    );
}
