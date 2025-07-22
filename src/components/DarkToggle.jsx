import { useLayoutEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function DarkToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(prev => !prev)}
      aria-label="Toggle dark mode"
      className="fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-black dark:text-white shadow-md transition hover:scale-105 active:scale-95"
      title="Toggle Dark Mode"
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
