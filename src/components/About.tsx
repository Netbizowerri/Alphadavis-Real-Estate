import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Target, Lightbulb, ShieldCheck } from 'lucide-react';
import { BUSINESS_INFO } from '../constants';

export default function About() {
  const values = [
    { icon: <Target className="w-5 h-5" />, title: 'Our Vision', desc: 'To be the most trusted global real estate firm, setting standards for excellence.' },
    { icon: <ShieldCheck className="w-5 h-5" />, title: 'Reliability', desc: 'Our products & services are well grounded and well founded.' },
    { icon: <CheckCircle2 className="w-5 h-5" />, title: 'Integrity', desc: 'Ensuring absolute transparency and honesty in every transaction.' },
  ];

  return (
    <section id="about" className="py-24 bg-brand-light relative overflow-hidden text-brand-deep">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-[2.5rem] overflow-hidden h-[300px] shadow-lg transition-all duration-700 border border-brand-deep/5"
                >
                  <img 
                    src="https://i.postimg.cc/X7SH8Y5H/ALPHADAVIS-REAL-ESTATE.jpg" 
                    alt="Luxury Estate" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="rounded-[2.5rem] overflow-hidden h-[200px] shadow-lg transition-all duration-700 border border-brand-deep/5"
                >
                  <img 
                    src="https://i.postimg.cc/2jFvskJ4/ALPHADAVIS-REAL-ESTATE(1).jpg" 
                    alt="Premium Resident" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </div>
              <div className="space-y-4 pt-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="rounded-[2.5rem] overflow-hidden h-[200px] shadow-lg transition-all duration-700 border border-brand-deep/5"
                >
                  <img 
                    src="https://i.postimg.cc/2jFvskJh/ALPHADAVIS-REAL-ESTATE(2).jpg" 
                    alt="Modern Villa" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="rounded-[2.5rem] overflow-hidden h-[300px] shadow-lg transition-all duration-700 border border-brand-deep/5"
                >
                  <img 
                    src="https://i.postimg.cc/Bv9nZDPp/tastefully-built-4-bedroom-duplex-in-owerri-for-sa-4n-Y0xpz-AXVq-Pxw49mbf-R.jpg" 
                    alt="Exclusive Property" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </div>
            </div>
            
            {/* Experience Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-xl w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-2xl border border-brand-accent/20 font-display">
              <span className="text-3xl font-black text-brand-accent tracking-tighter">15+</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-deep/40 italic">Years</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
             <div className="space-y-4 font-display">
              <span className="text-brand-accent font-bold uppercase tracking-widest text-sm italic">About {BUSINESS_INFO.name}</span>
              <h2 className="text-3xl md:text-6xl font-black leading-tight tracking-tight uppercase text-brand-deep">
                Where <span className="text-brand-accent italic">Dreams</span> Meet.
              </h2>
              <p className="font-body text-xl md:text-2xl text-brand-deep/60 leading-relaxed font-medium">
                {BUSINESS_INFO.description}
              </p>
            </div>

            <div className="space-y-6">
              {values.map((val) => (
                <div key={val.title} className="flex gap-4">
                  <div className="bg-brand-deep/5 p-4 rounded-2xl text-brand-accent h-fit">
                    {val.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-xl md:text-2xl uppercase tracking-wider text-brand-deep">{val.title}</h4>
                    <p className="font-display text-sm md:text-base uppercase font-bold tracking-tight text-brand-deep/60 italic">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link to="/about" className="bg-brand-accent text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-base md:text-lg hover:scale-105 transition-all whitespace-nowrap">
                Learn our Story
              </Link>
              <div className="flex flex-wrap items-center gap-4 font-display font-bold text-xs md:text-sm uppercase tracking-widest text-brand-deep/30 italic">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-brand-accent" size={18} /> Professional
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="text-brand-accent" size={18} /> Global reaching
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
