import { motion } from 'motion/react';
import { BUSINESS_INFO } from '../constants';
import Hero from '../components/Hero';
import Properties from '../components/Properties';
import VirtualTour from '../components/VirtualTour';
import About from '../components/About';
import PropertyVideos from '../components/PropertyVideos';
import Contact from '../components/Contact';
import SEO from '../lib/seo';

export default function Home() {
  return (
    <>
      <SEO
        title="Premium Real Estate Development in Nigeria"
        description="Discover luxury properties and land investments in Enugu, Nigeria. Alphadavis Real Estate offers premium real estate solutions with transparency and excellence."
        keywords={['real estate Nigeria', 'property development', 'land for sale', 'luxury homes', 'Enugu properties', 'investment properties']}
        url="https://alphadavisrealestate.com"
        image="https://i.postimg.cc/MHqCmSWF/Alphadavis(1).png"
      />
      <Hero />
      
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
      >
        <Properties />
      </motion.div>

      <VirtualTour />
      
      <About />

       <div className="bg-brand-light py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-brand-deep/5 backdrop-blur-2xl p-12 rounded-[4rem] text-center space-y-8 relative border-brand-accent/10">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-brand-accent rounded-full flex items-center justify-center shadow-xl shadow-brand-accent/30">
              <span className="text-black font-black text-4xl">!</span>
            </div>
            <h2 className="text-3xl md:text-6xl font-black pt-8 uppercase tracking-tight text-brand-deep">Ready to secure your future?</h2>
            <p className="text-xl md:text-2xl text-brand-deep/60 font-medium max-w-3xl mx-auto leading-relaxed">
              Alphadavis Real Estate Ltd delivers world-class property solutions to a distinguished global clientele, seamlessly connecting investors from Nigeria and across key international markets with premium real estate opportunities defined by trust, excellence, and long-term value.
            </p>
            <a href="/about" className="inline-block bg-brand-accent text-black px-12 py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-brand-accent/90 hover:shadow-2xl transition-all active:scale-95 shadow-xl shadow-brand-accent/20 text-lg md:text-xl">
              Consult Our Experts
            </a>
          </div>
        </div>
      </div>

      <PropertyVideos />
      
      <Contact />
    </>
  );
}
