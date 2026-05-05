import { motion } from 'motion/react';
import { 
  Target, 
  Lightbulb, 
  ShieldCheck, 
  Zap, 
  Award, 
  Users, 
  Briefcase, 
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { BUSINESS_INFO } from '../constants';

export default function AboutPage() {
  const HERO_IMAGE = 'https://i.ibb.co/PvgSqthq/Gemini-Generated-Image-y9orpfy9orpfy9or-1.png';

  const coreValues = [
    {
      title: 'Knowledgeable',
      desc: 'We strive to stay up-to-date on market trends ensuring clients dream homes and choice investment are delivered.',
      icon: <Lightbulb className="w-6 h-6" />
    },
    {
      title: 'Reliable',
      desc: 'Our product & services are well grounded and well founded.',
      icon: <ShieldCheck className="w-6 h-6" />
    },
    {
      title: 'Integrity',
      desc: 'Ensuring transparency and honesty in every transaction.',
      icon: <HeartHandshake className="w-6 h-6" />
    },
    {
      title: 'Professional',
      desc: 'We are committed to high standards marketing, staging, and legal compliance to deliver superior results.',
      icon: <Briefcase className="w-6 h-6" />
    },
    {
      title: 'Excellence',
      desc: 'We uphold the value of Excellence by offering expert advice and delivering a top-notch customer experience.',
      icon: <Award className="w-6 h-6" />
    },
    {
      title: 'Swift',
      desc: 'Immediate response, timely support and rapt attention to our client’s needs.',
      icon: <Zap className="w-6 h-6" />
    }
  ];

  return (
    <div className="bg-brand-light">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-full h-full"
          >
            <img 
              src={HERO_IMAGE} 
              alt="AlphaDavis Luxury" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 text-center space-y-6 px-6 max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-accent font-black uppercase tracking-[0.4em] text-xs italic bg-black/40 px-6 py-2 rounded-full backdrop-blur-md"
          >
            The AlphaDavis Legacy
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white"
          >
            OUR <span className="text-brand-accent italic underline decoration-brand-accent/30 decoration-8 underline-offset-8">PHILOSOPHY</span>
          </motion.h1>
        </div>
      </section>

      {/* Intro Narrative */}
      <section className="py-24 bg-brand-light text-brand-deep">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
           <motion.div
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="w-12 h-1.5 bg-brand-accent mx-auto mb-12"
           />
           <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight text-brand-deep">
             Where dreams and affordable housing meet <span className="text-brand-accent italic">Reality</span>.
           </h2>
           <p className="text-lg md:text-xl text-brand-deep/60 leading-relaxed max-w-3xl mx-auto">
             AlphaDavis Real Estate Limited is dedicated to transforming the industry by providing innovative and sustainable housing solutions tailored to the needs of a modern, global clientele.
           </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-brand-deep/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Vision */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-brand-light p-10 md:p-16 rounded-[3rem] shadow-xl shadow-brand-deep/5 space-y-8 border border-brand-deep/5"
            >
              <div className="w-16 h-16 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent">
                <Target size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-black uppercase italic tracking-tight text-brand-deep">Our Vision</h2>
                <div className="w-12 h-1 bg-brand-accent/30" />
              </div>
              <p className="text-brand-deep/70 text-lg leading-relaxed font-medium italic">
                "To be the most trusted and global real estate firm, setting the standard for integrity and excellence in property development and exceptional client solutions."
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-brand-deep p-10 md:p-16 rounded-[3rem] shadow-2xl shadow-brand-accent/10 space-y-8 text-white"
            >
              <div className="w-16 h-16 bg-brand-accent rounded-2xl flex items-center justify-center text-black">
                <Zap size={32} />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-black uppercase italic tracking-tight text-white">Our Mission</h2>
                <div className="w-12 h-1 bg-brand-accent" />
              </div>
              <p className="text-white/70 text-lg leading-relaxed font-medium">
                Dedicated to empowering clients with endless possibilities and sustainable real estate solutions by building long-term relationships based on integrity, professionalism, and satisfaction.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-brand-light">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="space-y-4">
              <span className="text-brand-accent font-black uppercase tracking-widest text-xs italic">The Alpha Code</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-brand-deep">Core Values</h2>
            </div>
            <p className="text-brand-deep/40 max-w-sm font-medium uppercase tracking-tight text-sm">
              Our foundation is built on six pillars that define our commitment to every client and stakeholder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {coreValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group p-10 rounded-[3rem] bg-brand-deep/5 border border-transparent hover:border-brand-accent/20 transition-all hover:bg-brand-light hover:shadow-2xl hover:shadow-brand-deep/5"
              >
                <div className="w-14 h-14 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent mb-8 group-hover:scale-110 transition-transform group-hover:bg-brand-accent group-hover:text-black shadow-inner">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4 text-brand-deep">{value.title}</h3>
                <p className="text-brand-deep/50 text-sm leading-relaxed font-medium group-hover:text-brand-deep/80 transition-colors">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="pb-24 pt-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-[3.5rem] bg-brand-deep p-12 md:p-24 text-center">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
               <img src={HERO_IMAGE} className="w-full h-full object-cover opacity-20 filter grayscale" alt="Footer image" />
               <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/90 to-brand-deep/40" />
            </div>

            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter text-white max-w-4xl mx-auto leading-none">
                Transforming dreams into <span className="text-brand-accent italic font-display">Legacy Assets</span>
              </h2>
              <p className="text-white/40 max-w-xl mx-auto font-medium text-lg">
                Whether you're looking for your first home or a strategic investment, we have the expertise to get you there.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <a href="/listings" className="w-full sm:w-auto px-12 py-5 bg-brand-accent text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-105 transition-all shadow-xl shadow-brand-accent/20">
                  Explore Assets
                </a>
                <a href="/#contact" className="w-full sm:w-auto px-12 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 transition-all backdrop-blur-md">
                  Request Consultation
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
