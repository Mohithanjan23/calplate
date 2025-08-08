import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-b border-white/10 z-50">
      <div className="flex items-center justify-between h-full px-4 max-w-4xl mx-auto">
        <Link to="/" className="text-2xl font-bold text-primary">
          Cal AI
        </Link>
        <Link to="/profile">
            <User className="text-text-secondary hover:text-primary transition-colors" />
        </Link>
      </div>
    </header>
  );
}