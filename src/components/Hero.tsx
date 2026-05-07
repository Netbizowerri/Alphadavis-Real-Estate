import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { BUSINESS_INFO } from '../constants';

export default function Hero() {
  const HERO_IMAGE = 'https://i.ibb.co/PvgSqthq/Gemini-Generated-Image-y9orpfy9orpfy9or-1.png';

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 bg-brand-deep text-white">
      {/* Cinematic Background with Ken-Burns Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          initial={{ scale: 1, x: '0%', y: '0%' }}
          animate={{ 
            scale: [1, 1.15, 1],
            x: ['0%', '-2%', '0%'],
            y: ['0%', '-1%', '0%']
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 w-full h-full"
        >
          <img 
            src={HERO_IMAGE} 
            className="w-full h-full object-cover opacity-30 mix-blend-luminosity scale-110"
            alt="Hero Background"
          />
        </motion.div>
        
        {/* Gradients to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-deep via-brand-deep/80 to-transparent z-10" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-brand-deep to-transparent z-10" />
        
        {/* Animated Milky Way Overlay (Subtle) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-20 opacity-[0.05]">
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1] 
            }}
            transition={{ 
              rotate: { duration: 250, repeat: Infinity, ease: "linear" },
              scale: { duration: 20, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_1.5px)] bg-[length:80px_80px]"
          />
        </div>
      </div>

      <div className="relative z-30 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full border border-brand-accent/20">
            <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse" />
            <span className="font-display text-xs font-bold uppercase tracking-wider text-white/60 italic">
              ALPHADAVIS GLOBAL REACH
            </span>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl leading-[0.9] tracking-tighter flex flex-col font-black uppercase">
              <span className="text-white">ALPHADAVIS</span>
              <span className="text-brand-accent italic">REAL ESTATE</span>
              <span className="text-white">LIMITED</span>
            </h1>
          </div>
          
          <p className="text-lg md:text-xl text-white/70 max-w-xl leading-relaxed font-medium">
            Alphadavis Real Estate Ltd delivers world-class property solutions to a distinguished global clientele, seamlessly connecting investors from Nigeria and across key international markets with premium real estate opportunities defined by trust, excellence, and long-term value.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/listings" className="font-display inline-flex items-center gap-2 bg-brand-accent text-black px-10 py-5 rounded-2xl font-black hover:scale-105 transition-all active:scale-95 shadow-2x shadow-brand-accent/30 uppercase tracking-widest text-xs italic">
              Enter Portfolio <ArrowRight size={18} />
            </Link>
            <a href="/about" className="font-display glass px-10 py-5 rounded-2xl font-black flex items-center gap-2 hover:bg-white/10 transition-all text-xs uppercase tracking-widest italic border border-white/10">
              Our Legacy <ArrowRight size={16} />
            </a>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/5 font-display italic">
            <div>
              <div className="text-xl md:text-3xl font-black text-white not-italic font-display tracking-tighter">500+</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Success Stories</div>
            </div>
            <div>
              <div className="text-xl md:text-3xl font-black text-white not-italic font-display tracking-tighter">120+</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Global Assets</div>
            </div>
            <div>
              <div className="text-xl md:text-3xl font-black text-white not-italic font-display tracking-tighter">15+</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Years Mastery</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative hidden lg:block"
        >
          {/* Main Visual with independent Ken-Burns */}
          <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl relative border border-white/10 group">
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                x: ['0%', '1%', '0%']
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-full h-full"
            >
              <img
                src={HERO_IMAGE}
                alt="AlphaDavis Luxury Asset"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/80 via-transparent to-transparent opacity-60" />
            
            <div className="absolute bottom-10 left-10 p-6 glass rounded-3xl border-brand-accent/20 max-w-[250px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-brand-accent p-1.5 rounded-lg text-black">
                  <MapPin size={16} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent">Strategic Locations</span>
              </div>
              <p className="text-xs font-bold leading-relaxed text-white/70">
                Premium land and residential collections across Lagos, Abuja & Beyond.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


