import { motion } from 'motion/react';
import { Phone, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { BUSINESS_INFO, SOCIAL_LINKS } from '../constants';
import ContactForm from './ContactForm';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-brand-light relative overflow-hidden text-brand-deep">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
           <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="space-y-4 font-display">
              <span className="text-brand-accent font-bold uppercase tracking-widest text-sm italic">Let's Connect</span>
              <h2 className="text-3xl md:text-6xl font-black leading-none tracking-tighter uppercase whitespace-normal break-words text-brand-deep">
                Request <span className="font-serif-italic normal-case block font-serif text-brand-accent">Consultation.</span>
              </h2>
              <p className="font-body text-xl md:text-2xl text-brand-deep/60 font-medium leading-relaxed">
                Connect with Nigeria’s premier luxury property consultants.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group text-brand-deep">
                <div className="bg-brand-deep/5 border border-brand-accent/20 p-4 rounded-2xl text-brand-deep group-hover:border-brand-accent transition-colors">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg md:text-xl uppercase tracking-wider mb-1">Our Location</h4>
                  <p className="font-display text-sm md:text-base font-black uppercase tracking-[0.2em] text-brand-deep/40 max-w-[280px]">{BUSINESS_INFO.address}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-6 group text-brand-deep">
                <div className="bg-brand-accent p-4 rounded-2xl text-black shadow-xl shadow-brand-accent/20">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg md:text-xl uppercase tracking-wider mb-1">Contact Phone</h4>
                  <p className="font-display text-sm md:text-base font-black uppercase tracking-[0.2em] text-brand-deep/40">{BUSINESS_INFO.phone}</p>
                  <p className="font-display text-sm md:text-base font-black uppercase tracking-[0.2em] text-brand-deep/40">{BUSINESS_INFO.mainPhone}</p>
                </div>
              </div>

              <div className="pt-8 space-y-6">
                <h4 className="font-display text-sm md:text-base font-black uppercase tracking-[0.4em] text-brand-accent italic">Digital Presence</h4>
                <div className="flex gap-4">
                  <a
                    href={SOCIAL_LINKS.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 md:w-20 md:h-20 bg-brand-deep/5 border border-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-deep/60 hover:text-brand-accent hover:border-brand-accent transition-all hover:scale-110 shadow-lg"
                    aria-label="Facebook"
                  >
                    <Facebook size={28} />
                  </a>
                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 md:w-20 md:h-20 bg-brand-deep/5 border border-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-deep/60 hover:text-brand-accent hover:border-brand-accent transition-all hover:scale-110 shadow-lg"
                    aria-label="Instagram"
                  >
                    <Instagram size={28} />
                  </a>
                  <a
                    href={SOCIAL_LINKS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-16 h-16 md:w-20 md:h-20 bg-brand-deep/5 border border-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-deep/60 hover:text-brand-accent hover:border-brand-accent transition-all hover:scale-110 shadow-lg"
                    aria-label="WhatsApp"
                  >
                    <MessageCircle size={28} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
