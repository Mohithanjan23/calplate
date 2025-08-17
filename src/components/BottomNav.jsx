import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Settings, Plus } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Progress', icon: BarChart2, path: '/progress' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100">
      <div className="flex justify-around items-center max-w-md mx-auto relative">
        {navItems.map(({ label, icon: Icon, path }) => (
          <Link 
            key={path}
            to={path}
            className={`flex flex-col items-center gap-1 text-xs ${location.pathname === path ? 'text-black font-semibold' : 'text-gray-400'}`}
          >
            <Icon />
            {label}
          </Link>
        ))}
        <div className="absolute -top-16">
          <button className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white shadow-lg">
            <Plus size={32} />
          </button>
        </div>
      </div>
    </nav>
  );
}