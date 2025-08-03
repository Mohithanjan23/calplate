import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, BarChart2, Lightbulb, Dumbbell, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Stats', icon: BarChart2, path: '/stats' },
  { label: 'Add', icon: PlusCircle, path: '/add' },
  { label: 'Goals', icon: Target, path: '/goals' },
  { label: 'Workouts', icon: Dumbbell, path: '/workouts' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-surface/80 backdrop-blur-lg border-t border-white/10 z-50 flex justify-around items-center">
      {navItems.map(({ label, icon: Icon, path }) => {
        const isActive = location.pathname === path;
        return (
          <Link to={path} key={path} className="flex flex-col items-center gap-1 text-xs text-text-secondary transition-colors hover:text-white">
            <Icon size={24} className={isActive ? 'text-primary' : ''} />
            <span className={isActive ? 'text-primary font-bold' : ''}>
              {label}
            </span>
            {isActive && (
              <motion.div
                layoutId="active-nav-indicator"
                className="absolute -bottom-px w-8 h-1 bg-primary rounded-full"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}