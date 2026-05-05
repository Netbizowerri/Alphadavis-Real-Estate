import { motion } from 'motion/react';
import { Play, Film, ArrowRight } from 'lucide-react';

const videos = [
  {
    id: 1,
    title: "ALPHADAVIS LUXURY SHOWCASE",
    thumbnail: "https://i.postimg.cc/SRbVQg7V/Whats-App-Image-2026-05-04-at-2-58-28-PM(1).jpg",
    url: "https://www.youtube.com/embed/L3CRNW5WW44",
    category: "High-End Development"
  },
  {
    id: 2,
    title: "ALPHADAVIS ESTATE PREVIEW",
    thumbnail: "https://i.postimg.cc/SRbVQg7V/Whats-App-Image-2026-05-04-at-2-58-28-PM(1).jpg",
    url: "https://www.youtube.com/embed/eLTI63suSN8",
    category: "Landed Property"
  }
];

export default function PropertyVideos() {
  return (
    <section className="py-24 bg-brand-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4 max-w-2xl">
            <span className="font-display text-brand-accent font-bold uppercase tracking-widest text-[10px] italic">Visual Experience</span>
            <h2 className="text-2xl md:text-5xl font-black tracking-tight uppercase text-brand-deep leading-none">Property <span className="font-serif-italic normal-case font-serif text-brand-accent">Showcase.</span></h2>
            <p className="font-display text-brand-deep/60 text-lg leading-relaxed font-medium">
              Dive deep into our exclusive developments with cinematic property tours. Experience the space, the light, and the lifestyle before you visit.
            </p>
          </div>
          <div className="flex items-center gap-4 text-brand-deep/30">
             <Film size={40} className="animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {videos.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="group"
            >
              <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl border border-brand-deep/5 bg-black">
                <iframe 
                  src={`${video.url}?autoplay=0&mute=0`}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                
                <div className="absolute top-6 left-6 flex gap-2">
                  <span className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 font-display text-[9px] font-black uppercase tracking-widest text-brand-deep">
                    {video.category}
                  </span>
                </div>
              </div>
              
              <div className="mt-8 flex items-center justify-center group-hover:scale-105 transition-all duration-500">
                <div className="flex items-center gap-3 bg-brand-deep/5 px-6 py-3 rounded-2xl group-hover:bg-brand-accent transition-colors duration-500">
                  <div className="w-8 h-[1px] bg-brand-accent group-hover:bg-brand-deep" />
                  <span className="font-display text-xs font-black uppercase tracking-[0.2em] text-brand-deep italic">Watch Full Tour</span>
                  <ArrowRight size={16} className="text-brand-accent group-hover:text-brand-deep" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
