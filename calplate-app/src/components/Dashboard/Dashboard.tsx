import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChefHat, BarChart3 } from 'lucide-react';
import ProgressCard from './ProgressCard';
import FloatingActionButton from '../Navigation/FloatingActionButton';
import NotificationCenter from './NotificationCenter';
import StreakCalendar from './StreakCalendar';
import PhotoJournal from '../Meals/PhotoJournal';

export default function Dashboard() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [consumed] = useState(1250); // Mocked for demo

    useEffect(() => {
        if (supabase) {
            getProfile();
        }
    }, []);

    const getProfile = async () => {
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            setProfile(data);
        }
    };

    const handleSignOut = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 pb-24">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500">Welcome back</p>
                </div>
                <button onClick={handleSignOut} className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-100 transition-colors">
                    <LogOut className="w-5 h-5 text-slate-600" />
                </button>
            </div>

            <NotificationCenter />

            {profile && (
                <div className="space-y-6">
                    <ProgressCard
                        currentCalories={consumed}
                        goalCalories={profile.calorie_goal || 2000}
                        burnedCalories={350} // Mocked exercise
                    />

                    <PhotoJournal />

                    <StreakCalendar />

                    <div className="grid grid-cols-2 gap-4">
                        <div
                            onClick={() => navigate('/meal-prep')}
                            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-200 transition-colors aspect-square"
                        >
                            <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
                                <ChefHat className="w-6 h-6" />
                            </div>
                            <span className="font-semibold text-slate-900">Meal Prep</span>
                        </div>

                        <div
                            onClick={() => navigate('/insights')}
                            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-200 transition-colors aspect-square"
                        >
                            <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <span className="font-semibold text-slate-900">Insights</span>
                        </div>
                    </div>
                </div>
            )}

            <FloatingActionButton />
        </div>
    );
}
