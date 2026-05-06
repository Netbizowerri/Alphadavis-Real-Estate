import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { BUSINESS_INFO } from '../constants';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Listings', href: '/listings' },
    { name: 'Request Property', href: '/request-property' },
  ];

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-brand-deep shadow-2xl border-b border-white/5 text-white`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="pt-4 pb-1 md:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-14 md:h-20 w-auto">
              <img 
                src={BUSINESS_INFO.logo} 
                alt={BUSINESS_INFO.name} 
                className="h-full w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-display font-bold text-lg tracking-tight hidden sm:block uppercase max-w-[200px] leading-tight">
              {BUSINESS_INFO.name}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) => 
                  `font-display text-sm uppercase tracking-widest font-bold transition-colors ${
                    isActive ? 'text-brand-accent' : 'text-white/70 hover:text-brand-accent'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <a 
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="font-display px-8 py-3 bg-white/5 border border-white/20 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-all font-black whitespace-nowrap"
            >
              Contact Agent
            </a>
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full inset-x-0 md:hidden"
          >
            <div className="bg-brand-deep p-8 border-b border-white/10 shadow-2xl space-y-6 max-h-[80vh] overflow-y-auto">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) => 
                    `font-display block text-lg font-black uppercase tracking-widest py-4 border-b border-white/5 transition-colors ${
                      isActive ? 'text-brand-accent' : 'text-white hover:text-brand-accent'
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-6 space-y-6">
                <a href={`tel:${BUSINESS_INFO.phone}`} className="flex items-center gap-4 text-base font-bold uppercase tracking-widest text-white/60">
                  <Phone size={24} />
                  {BUSINESS_INFO.phone}
                </a>
                <a href={`mailto:${BUSINESS_INFO.email}`} className="flex items-center gap-4 text-base font-bold uppercase tracking-widest text-white/60">
                  <Mail size={24} />
                  {BUSINESS_INFO.email}
                </a>
              </div>
              <div className="pt-6 border-t border-white/5">
                <a 
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    setTimeout(() => {
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="font-display w-full bg-brand-accent text-black px-6 py-4 rounded-xl font-black uppercase tracking-widest text-center block"
                >
                  Contact Agent
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
