import { motion } from 'motion/react';
import { Play, Map, Sparkles } from 'lucide-react';

export default function VirtualTour() {
  return (
    <section className="py-24 bg-brand-light text-brand-deep overflow-hidden relative border-y border-brand-deep/5">
      {/* Background overlay */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1920" 
          alt="Virtual Tour BG" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <span className="font-display text-brand-accent font-bold uppercase tracking-widest text-xs italic">Virtual Experience</span>
            <h2 className="text-2xl md:text-5xl leading-tight tracking-tight uppercase text-brand-deep">
              <span className="font-serif-italic normal-case block mb-2 font-serif">Immersive</span>
              <span className="font-black">Property Tours.</span>
            </h2>
            <p className="text-xl text-brand-deep/60 leading-relaxed font-medium">
              Experience the prestige of ALPHADAVIS ESTATE through our premium property tours. Explore every detail of our strategic land and residential collections directly from your screen.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-brand-deep/5 p-6 rounded-3xl space-y-3">
                <div className="bg-brand-accent w-10 h-10 rounded-lg flex items-center justify-center">
                  <Map size={20} className="text-black" />
                </div>
                <h4 className="font-bold uppercase text-[10px] tracking-widest italic text-brand-deep">Strategic Locations</h4>
                <p className="font-display text-[10px] text-brand-deep/40 uppercase font-bold tracking-tight italic">Prime Enugu & Beyond</p>
              </div>
              <div className="bg-brand-deep/5 p-6 rounded-3xl space-y-3">
                <div className="bg-brand-deep/10 w-10 h-10 rounded-lg flex items-center justify-center">
                  <Sparkles size={20} className="text-brand-deep" />
                </div>
                <h4 className="font-bold uppercase text-[10px] tracking-widest italic text-brand-deep">Premium Finish</h4>
                <p className="font-display text-[10px] text-brand-deep/40 uppercase font-bold tracking-tight italic">Exquisite Artistry</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[9/16] md:aspect-video rounded-[3rem] overflow-hidden shadow-2xl relative border border-brand-deep/10 group bg-black">
              <iframe 
                src="https://www.youtube.com/embed/lsiULJNHVSg?autoplay=0&mute=0&loop=1&playlist=lsiULJNHVSg"
                title="ALPHADAVIS ESTATE Tour"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              
              <div className="absolute top-6 left-6 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 font-display italic pointer-events-none">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-deep">Featured Tour</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
