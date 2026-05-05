import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Building2, 
  Tags, 
  LogOut, 
  Home, 
  Menu, 
  X,
  Activity,
  Search,
  ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../lib/firebase';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/admin/dashboard" },
    { label: "Properties", icon: <Building2 size={20} />, href: "/admin/properties" },
    { label: "Categories", icon: <Tags size={20} />, href: "/admin/categories" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col fixed inset-y-0 z-50 hidden lg:flex">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center shadow-lg shadow-brand-accent/20">
                <Home className="text-white" size={20} />
             </div>
             <div>
                <h1 className="text-lg font-black uppercase tracking-tighter leading-none">ChixaThair</h1>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1 italic">Control Panel</p>
             </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <button 
                key={item.label}
                onClick={() => {
                  navigate(item.href);
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-brand-accent transition-colors'}>{item.icon}</span>
                <span className="text-sm font-semibold tracking-tight uppercase">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all font-semibold uppercase tracking-widest text-[10px] italic"
          >
             <LogOut size={18} />
             Terminate Session
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden h-16 bg-[#0f172a] text-white px-6 flex items-center justify-between z-50 sticky top-0">
         <h1 className="text-xl font-black uppercase tracking-tighter">ChixaThair</h1>
         <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 bg-white/5 rounded-lg text-brand-accent">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
         </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsMenuOpen(false)}
               className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] lg:hidden"
             />
             <motion.div 
               initial={{ x: "-100%" }}
               animate={{ x: 0 }}
               exit={{ x: "-100%" }}
               transition={{ type: "spring", damping: 30, stiffness: 300 }}
               className="fixed inset-y-0 left-0 w-[300px] bg-[#0f172a] shadow-2xl z-[101] flex flex-col p-8 text-white lg:hidden"
             >
                <div className="mb-12 flex items-center justify-between">
                   <h1 className="text-2xl font-black uppercase tracking-tighter">ChixaThair</h1>
                   <button onClick={() => setIsMenuOpen(false)} className="text-brand-accent">
                      <X size={24} />
                   </button>
                </div>
                <nav className="flex-1 space-y-4">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <button 
                        key={item.label}
                        onClick={() => {
                          navigate(item.href);
                          setIsMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-[0.1em] italic text-xs transition-all ${isActive ? 'bg-brand-accent text-white' : 'text-slate-400 hover:text-white'}`}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
                <button 
                  onClick={handleLogout}
                  className="mt-auto py-5 text-red-400 font-black uppercase tracking-widest text-[10px] italic border-t border-white/5"
                >
                  Terminate Session
                </button>
             </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {children}
      </main>
    </div>
  );
}
