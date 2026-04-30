import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plane, Brain, BookOpen, Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/aviation', label: 'Aviation', icon: Plane },
    { path: '/models', label: 'Models', icon: Brain },
    { path: '/reading', label: 'Reading', icon: BookOpen },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[rgba(10,14,20,0.95)] backdrop-blur-xl border-b border-[rgba(0,212,255,0.1)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00d4ff]/20 to-[#39ff14]/20 border border-[#00d4ff]/30 flex items-center justify-center group-hover:border-[#00d4ff]/60 transition-all duration-300">
              <span className="font-mono font-bold text-[#00d4ff] text-sm">P/D</span>
            </div>
            <div className="absolute inset-0 rounded-lg bg-[#00d4ff]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="hidden sm:block">
            <span className="font-mono font-semibold text-[#e8eef4] text-sm tracking-tight">PILOT</span>
            <span className="font-mono text-[#00d4ff] text-sm">/DATA</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 group ${
                  isActive
                    ? 'text-[#00d4ff] bg-[rgba(0,212,255,0.1)]'
                    : 'text-[#8b9aae] hover:text-[#e8eef4] hover:bg-[rgba(255,255,255,0.05)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-mono text-sm">{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#00d4ff] rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <button className="btn-glass text-sm">
            Contact
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-[#8b9aae] hover:text-[#e8eef4] transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-16 left-0 right-0 glass-panel border-t border-[rgba(0,212,255,0.1)] transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'text-[#00d4ff] bg-[rgba(0,212,255,0.1)]'
                    : 'text-[#8b9aae] hover:text-[#e8eef4] hover:bg-[rgba(255,255,255,0.05)]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-mono">{link.label}</span>
              </Link>
            );
          })}
          <button className="w-full btn-glass mt-4">Contact</button>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
