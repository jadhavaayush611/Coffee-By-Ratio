import React, { useState, useEffect } from 'react';
import { Menu, X, Coffee, ChevronRight } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  navLinks: NavLink[];
}

export default function MobileMenu({ navLinks }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -mr-2 rounded-md hover:bg-muted-background transition-colors focus:outline-none"
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <Menu className="w-6 h-6 text-foreground" />
      </button>

      {/* Overlay Backdrop */}
      <div 
        className={`fixed inset-0 z-[100] bg-background/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Slide-out Menu */}
      <div 
        className={`fixed inset-y-0 right-0 z-[101] w-[280px] bg-card border-l border-border shadow-2xl transition-all duration-300 ease-out ${
          isOpen ? 'translate-x-0 opacity-100 visible' : 'translate-x-full opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-2 font-semibold">
              <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center text-on-primary text-[10px]">
                <Coffee className="w-3.5 h-3.5" />
              </div>
              <span>Menu</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 -mr-2 rounded-md hover:bg-muted-background transition-colors focus:outline-none"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-foreground" />
            </button>
          </div>

          {/* Links */}
          <nav className="flex-grow py-6 px-4">
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="flex items-center justify-between p-3 rounded-lg text-body hover:text-foreground hover:bg-muted-background transition-all group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="font-medium">{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer/Action */}
          <div className="p-6 border-t border-border bg-background">
            <a
              href="/calculator"
              className="w-full h-12 bg-primary text-on-primary font-semibold rounded-pill flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg active:scale-[0.98]"
              onClick={() => setIsOpen(false)}
            >
              Start Brewing
            </a>
            <p className="mt-4 text-center text-[10px] text-muted uppercase tracking-widest font-mono">
              coffeebyratio.com
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
