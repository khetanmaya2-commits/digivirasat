import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Landmark, Sparkles, ArrowRight } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Explore', path: '/explore', hindi: 'अन्वेषण' },
    { name: 'Preserve', path: '/preserve', hindi: 'संरक्षण' },
    { name: 'About', path: '/about', hindi: 'परिचय' },
    { name: 'Dashboard', path: '/dashboard', hindi: 'नियंत्रण केंद्र' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#18130E]/90 backdrop-blur-md border-b border-[#C5A059]/30 py-3 shadow-lg'
          : 'bg-gradient-to-b from-[#16120E]/95 via-[#16120E]/70 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group select-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E9D7A5] via-[#C5A059] to-[#996515] p-[1.5px] shadow-md group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full rounded-[10px] bg-[#1F1813] flex items-center justify-center text-[#E9D7A5]">
              <Landmark size={20} className="transition-transform group-hover:rotate-6" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#E9D7A5] transition-colors">
                DigiVirasat
              </span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-[#C5A059]/20 text-[#E9D7A5] border border-[#C5A059]/40">
                2.0
              </span>
            </div>
            <p className="text-[10px] font-hindi text-[#C5A059] tracking-wider leading-none">
              डिजिटल विरासत संरक्षण
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[#1F1813]/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#C5A059]/20 shadow-inner">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'text-[#1F1813] bg-gradient-to-r from-[#E9D7A5] to-[#C5A059] font-semibold shadow-sm'
                    : 'text-stone-300 hover:text-[#E9D7A5] hover:bg-[#2C221A]/50'
                }`}
              >
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/preserve"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#996515] text-[#16120E] text-xs font-bold tracking-wider hover:brightness-110 shadow-[0_0_15px_rgba(197,160,89,0.3)] transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span>Begin Preservation</span>
            <ArrowRight size={14} />
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800/80 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#18130E] border-b border-[#C5A059]/30 px-6 py-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#C5A059]/20 text-[#E9D7A5] border border-[#C5A059]/40'
                      : 'text-stone-300 hover:bg-stone-800/50 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  <span className="text-xs font-hindi text-[#C5A059]">{link.hindi}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2">
            <Link
              to="/preserve"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#996515] text-[#16120E] text-sm font-bold shadow-md"
            >
              <span>Begin Preservation</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
