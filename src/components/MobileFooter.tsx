import { NavLink } from 'react-router-dom';
import { Home, List, FilePlus, Info } from 'lucide-react';

export default function MobileFooter() {
  const navItems = [
    { name: 'Home', icon: <Home size={20} />, href: '/' },
    { name: 'About', icon: <Info size={20} />, href: '/about' },
    { name: 'Listings', icon: <List size={20} />, href: '/listings' },
    { name: 'Request', icon: <FilePlus size={20} />, href: '/request-property' },
  ];

  return (
    <footer className="md:hidden fixed bottom-0 inset-x-0 z-[60] bg-brand-deep backdrop-blur-xl border-t border-white/10 pb-safe">
      <div className="flex items-center justify-between px-6 py-3">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) => 
              `flex flex-col items-center gap-1 transition-all duration-300 ${
                isActive ? 'text-brand-accent' : 'text-white/40'
              }`
            }
          >
            <div className="p-1">
              {item.icon}
            </div>
            <span className="font-display text-[9px] font-black uppercase tracking-widest">
              {item.name}
            </span>
          </NavLink>
        ))}
      </div>
    </footer>
  );
}
