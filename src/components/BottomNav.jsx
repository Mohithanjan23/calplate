import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  PlusCircle,
  BarChart2,
  CircleWavyCheck,
  Dumbbell,
  Target,
  Search,
  LayoutDashboard
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Add', icon: PlusCircle, path: '/add' },
  { label: 'Stats', icon: BarChart2, path: '/stats' },
  { label: 'Suggest', icon: CircleWavyCheck, path: '/suggestions' },
  { label: 'Workout', icon: Dumbbell, path: '/workouts' },
  { label: 'Goal', icon: Target, path: '/goals' },
  { label: 'Search', icon: Search, path: '/search' }, // Optional
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' } // Optional
];

export default function BottomNav() {
  const location = useLocation();
  const current = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-700 shadow-sm flex justify-around py-2 z-50">
      {navItems.map(({ label, icon: Icon, path }) => {
        const isActive = current === path;

        return (
          <Link
            to={path}
            key={path}
            onClick={() => navigator.vibrate?.(15)}
            className="flex-1 flex flex-col items-center gap-1 text-xs relative group"
          >
            <motion.div
              animate={{ scale: isActive ? 1.2 : 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className={`text-center ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 dark:text-gray-300'
              }`}
            >
              <Icon size={22} />
            </motion.div>
            <span
              className={`transition-all duration-300 ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-gray-500 dark:text-gray-300'
              }`}
            >
              {label}
            </span>
            {isActive && (
              <motion.span
                layoutId="nav-underline"
                className="absolute -bottom-1 w-6 h-[2px] bg-blue-600 dark:bg-blue-400 rounded"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
