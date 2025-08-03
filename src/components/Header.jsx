import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-lg border-b border-white/10 z-50">
      <div className="flex items-center justify-between h-full px-4">
        <Link to="/" className="text-2xl font-bold text-primary">
          CALPLATE
        </Link>
        <Link to="/profile">
            <User className="text-text-secondary hover:text-primary transition-colors" />
        </Link>
      </div>
    </header>
  );
}