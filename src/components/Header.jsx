import { Link } from 'react-router-dom';
import { Menu, UserCircle } from 'lucide-react';
import { DarkToggle } from './DarkToggle'; // optional toggle
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* App Logo / Title */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="text-xl font-bold text-blue-600 dark:text-blue-400"
        >
          <Link to="/">CalPlate</Link>
        </motion.div>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          {/* Optional: Dark mode toggle */}
          <DarkToggle />

          {/* Profile or menu icon */}
          <Link to="/auth">
            <UserCircle className="w-6 h-6 text-gray-600 dark:text-gray-300 hover:text-blue-600" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
