import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const initialTheme = root.classList.contains('dark') ? 'dark' : 'light';
    setTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newTheme);
  };

  if (!theme) return <div className="w-10 h-10" />;

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-md hover:bg-muted-background transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 group overflow-hidden"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-5 h-5">
        <div 
          className={`absolute inset-0 transform transition-transform duration-500 ease-in-out ${
            theme === 'dark' ? 'translate-y-0 opacity-100 rotate-0' : 'translate-y-10 opacity-0 -rotate-90'
          }`}
        >
          <Sun className="w-5 h-5 text-warning" />
        </div>
        <div 
          className={`absolute inset-0 transform transition-transform duration-500 ease-in-out ${
            theme === 'light' ? 'translate-y-0 opacity-100 rotate-0' : '-translate-y-10 opacity-0 rotate-90'
          }`}
        >
          <Moon className="w-5 h-5 text-link" />
        </div>
      </div>
    </button>
  );
}
