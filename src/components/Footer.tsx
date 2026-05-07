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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-20 border-b border-white/5">
          {/* About Preview */}
          <div className="space-y-6">
            <h4 className="font-bold text-xs uppercase tracking-[0.3em] text-brand-accent italic">About Alphadavis</h4>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[60px] w-auto">
                <img
                  src={BUSINESS_INFO.logo}
                  alt={BUSINESS_INFO.name}
                  className="h-full w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-display font-black text-lg tracking-tight uppercase leading-tight max-w-[150px]">
                {BUSINESS_INFO.name}
              </span>
            </div>
            <p className="text-white/60 max-w-sm leading-relaxed font-medium text-sm">
              Delivering world-class property solutions to a distinguished global clientele with trust, excellence, and long-term value.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-accent hover:text-black transition-all">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div id="footer-contact" className="space-y-6">
            <h4 className="font-bold text-xs uppercase tracking-[0.3em] text-brand-accent italic">Contact Details</h4>
            <div className="space-y-4 text-white/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center">
                  <span className="text-brand-accent text-xs font-black">📞</span>
                </div>
                <div>
                  <p className="font-bold text-xs uppercase tracking-widest text-brand-accent italic">Phone</p>
                  <p className="font-display text-sm font-bold">{BUSINESS_INFO.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center">
                  <span className="text-brand-accent text-xs font-black">✉️</span>
                </div>
                <div>
                  <p className="font-bold text-xs uppercase tracking-widest text-brand-accent italic">Email</p>
                  <p className="font-display text-sm font-bold">{BUSINESS_INFO.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center mt-1">
                  <span className="text-brand-accent text-xs font-black">🏢</span>
                </div>
                <div>
                  <p className="font-bold text-xs uppercase tracking-widest text-brand-accent italic">Office</p>
                  <p className="font-display text-sm font-bold max-w-[200px] leading-relaxed">{BUSINESS_INFO.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <h4 className="font-bold text-xs uppercase tracking-[0.3em] text-brand-accent italic">Navigation</h4>
            <ul className="space-y-4">
              {links.map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-white/60 hover:text-white transition-colors flex items-center gap-2 group text-sm font-bold uppercase tracking-widest">
                    {link.name}
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
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
