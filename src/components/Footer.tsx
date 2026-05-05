import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, ArrowUpRight } from 'lucide-react';
import { BUSINESS_INFO } from '../constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { name: 'Home', href: '/' },
    { name: 'About AlphaDavis', href: '/about' },
    { name: 'Full Listings', href: '/listings' },
    { name: 'Request Property', href: '/request-property' },
  ];

  return (
    <footer className="bg-brand-deep pt-24 pb-32 md:pb-12 overflow-hidden border-t border-white/5 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-20 border-b border-white/5">
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center gap-4">
              <div className="h-[86px] w-auto">
                <img 
                  src={BUSINESS_INFO.logo} 
                  alt={BUSINESS_INFO.name} 
                  className="h-full w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-display font-black text-xl tracking-tight uppercase leading-tight max-w-[200px]">
                {BUSINESS_INFO.name}
              </span>
            </div>
            <p className="text-white/40 max-w-sm leading-relaxed font-bold uppercase text-[10px] tracking-widest">
              {BUSINESS_INFO.address}
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-black transition-all">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-xs uppercase tracking-[0.3em] text-brand-accent italic">Navigation</h4>
            <ul className="space-y-4">
              {links.map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group text-[10px] font-bold uppercase tracking-widest">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div id="footer-contact" className="space-y-6">
            <h4 className="font-bold text-xs uppercase tracking-[0.3em] text-brand-accent italic">Contact Us</h4>
            <div className="space-y-4 text-white/60 font-display text-[10px] items-center font-bold uppercase tracking-widest">
               <p className="flex items-center gap-2">
                 <span className="text-brand-accent italic text-[8px]">Phone:</span> {BUSINESS_INFO.phone}
               </p>
               <p className="flex items-center gap-2">
                 <span className="text-brand-accent italic text-[8px]">Email:</span> {BUSINESS_INFO.email}
               </p>
               <p className="flex items-start gap-2">
                 <span className="text-brand-accent italic text-[8px]">Office:</span> <span className="max-w-[200px] leading-relaxed">{BUSINESS_INFO.address}</span>
               </p>
            </div>
          </div>

        </div>

        <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">
            © {currentYear} {BUSINESS_INFO.name}.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/10">
            <span className="text-brand-accent">INSTAGRAM</span>
            <span>LINKEDIN</span>
            <span>FACEBOOK</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
