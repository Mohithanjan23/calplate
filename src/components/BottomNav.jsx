import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, BarChart2, User, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Workouts', icon: Dumbbell, path: '/workouts' },
  { label: 'Add', icon: PlusCircle, path: '/add' },
  { label: 'Stats', icon: BarChart2, path: '/stats' },
  { label: 'Profile', icon: User, path: '/profile' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-lg border-t border-white/10 z-50 flex justify-around items-center">
      {navItems.map(({ label, icon: Icon, path }) => {
        const isActive = location.pathname === path;
        return (
          <Link to={path} key={path} className="flex flex-col items-center gap-1 text-xs text-text-secondary transition-colors hover:text-white relative pt-1">
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