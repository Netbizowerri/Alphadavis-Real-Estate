import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Square, ChevronRight, MapPin, X, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { listenToLatestProperties } from '../lib/services';
import { formatNaira, getPropertyImage, getPropertyLocation } from '../lib/propertyFormat';
import ContactForm from './ContactForm';

export default function Properties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);

  useEffect(() => {
    if (!selectedProperty) {
      setIsConsulting(false);
    }
  }, [selectedProperty]);

  useEffect(() => {
    const unsubscribe = listenToLatestProperties((liveData) => {
      setProperties(liveData);
      setLoading(false);
    }, 3);
    return () => unsubscribe();
  }, []);

  return (
    <section id="properties" className="py-24 bg-brand-bg relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4">
            <span className="font-display text-brand-accent font-bold uppercase tracking-widest text-xs italic">Our Portfolio</span>
            <h2 className="text-2xl md:text-5xl font-black tracking-tight uppercase">
              <span className="font-serif-italic normal-case block mb-2">Featured</span>
              Listings.
            </h2>
          </div>
          <Link to="/listings" className="font-display inline-flex items-center gap-2 group font-bold text-brand-primary/40 hover:text-brand-accent transition-colors uppercase tracking-[0.2em] text-[10px]">
            View all properties <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="animate-spin text-brand-accent" size={40} />
            <p className="font-display text-brand-primary/40 uppercase font-black tracking-widest italic text-xs">
              Loading Extraordinary Opportunities...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {properties.map((property, idx) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedProperty(property)}
                className={`group cursor-pointer glass p-5 rounded-[3rem] border-2 card-depth card-accent-${(idx % 4) + 1} hover:border-brand-accent/40 transition-all duration-500 shadow-xl md:p-6 h-full flex flex-col`}
              >
                <div className="relative card-image-container mb-6">
                  <div className={`card-accent-dot card-accent-dot-${(idx % 4) + 1}`} />
                  <div className="absolute top-4 right-4 glass px-4 py-2 rounded-xl border border-white/10 font-display">
                    <span className="font-bold text-white text-sm tracking-tight">{formatNaira(property.price, property.priceLabel)}</span>
                  </div>
                  <img
                    src={getPropertyImage(property)}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-[2rem]" />
                </div>

                <div className="space-y-3 px-1 flex-1 flex flex-col">
                  <h3 className="text-lg md:text-xl font-black uppercase group-hover:text-brand-accent transition-colors tracking-tight text-brand-primary relative z-10">{property.title}</h3>
                  <p className="font-display text-brand-primary/60 flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest relative z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent/60" />
                    {getPropertyLocation(property)}
                  </p>
                  <p className="font-display text-[10px] md:text-[11px] text-brand-primary/50 leading-relaxed line-clamp-3 flex-1 relative z-10">
                    {property.shortDescription || property.description?.split('\n')[0] || 'Premium property in a prime location with excellent investment potential.'}
                  </p>
                  <div className="flex items-center gap-4 py-4 border-t border-white/5 relative z-10">
                    {(property.bedrooms || 0) > 0 ? (
                      <>
                        <div className="font-display flex items-center gap-1.5 text-[10px] font-black text-brand-primary/60 uppercase tracking-tighter">
                          <Bed size={16} className="text-brand-accent" /> {property.bedrooms}
                        </div>
                        <div className="font-display flex items-center gap-1.5 text-[10px] font-black text-brand-primary/60 uppercase tracking-tighter">
                          <Bath size={16} className="text-brand-accent" /> {property.bathrooms}
                        </div>
                      </>
                    ) : (
                      <div className="font-display flex items-center gap-1.5 text-[10px] font-black text-brand-primary/60 uppercase tracking-tighter">
                        <Square size={16} className="text-brand-accent" /> {property.floorAreaSqm || 500}m²
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProperty(property);
                    }}
                    className="font-display w-full bg-brand-accent/20 hover:bg-brand-accent/30 text-brand-accent py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] border border-brand-accent/30 hover:border-brand-accent transition-all duration-300 mt-auto relative z-10"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
            {!loading && properties.length === 0 && (
              <div className="col-span-full py-20 text-center glass rounded-3xl">
                <p className="font-display text-brand-primary/40 uppercase font-black tracking-widest italic">No Properties Available Yet</p>
                <p className="text-brand-primary/20 text-xs mt-2 font-display uppercase tracking-widest">Check back soon for new listings</p>
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProperty(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-brand-deep w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-hidden relative border border-white/10 flex flex-col shadow-2xl text-white mb-20 md:mb-0"
              >
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="absolute top-6 right-6 z-50 bg-brand-accent text-black w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-2xl shadow-brand-accent/30 border-4 border-brand-deep hover:border-brand-accent/50 active:scale-95"
                  aria-label="Close modal"
                >
                  <X size={24} strokeWidth={3} />
                </button>

                <div className="flex-1 overflow-y-auto scrollbar-hide">
                  {isConsulting ? (
                    <div className="p-6 md:p-12 lg:p-16">
                      <button
                        onClick={() => setIsConsulting(false)}
                        className="flex items-center gap-2 text-brand-accent font-display text-[10px] font-black uppercase tracking-widest mb-8 hover:opacity-70 transition-opacity pb-2"
                      >
                        <ArrowLeft size={16} /> Back to details
                      </button>
                      <div className="max-w-2xl mx-auto">
                        <ContactForm
                          initialMessage={`I am interested in "${selectedProperty.title}" located in ${getPropertyLocation(selectedProperty)}. I would like more information and a private consultation.`}
                          initialInterest={selectedProperty.propertyType === 'Land' ? 'LAND ACQUISITION' : 'PROPERTY DEVELOPMENT'}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="relative w-full h-[280px] sm:h-[350px] md:h-[450px]">
                        <img
                          src={getPropertyImage(selectedProperty)}
                          alt={selectedProperty.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/90 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                          <div className="font-display inline-flex items-center gap-2 bg-brand-accent text-black px-4 py-2 rounded-lg text-[10px] md:text-[11px] font-black uppercase tracking-widest mb-4">
                            {selectedProperty.status || 'AVAILABLE'}
                          </div>
                          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight max-w-3xl">
                            {selectedProperty.title}
                          </h2>
                        </div>
                      </div>

                      <div className="p-6 md:p-10 lg:p-12 space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="space-y-2">
                            <p className="font-display flex items-center gap-2 text-white/60 font-bold uppercase text-sm tracking-widest italic">
                              <MapPin size={18} className="text-brand-accent" /> {getPropertyLocation(selectedProperty)}
                            </p>
                            <div className="text-2xl md:text-4xl font-black text-brand-accent font-display tracking-tight">
                              {formatNaira(selectedProperty.price, selectedProperty.priceLabel)}
                            </div>
                          </div>

                          <div className="flex gap-6 py-4 px-6 md:px-8 rounded-2xl bg-white/5 border border-white/5">
                            {(selectedProperty.bedrooms || 0) > 0 ? (
                              <>
                                <div className="text-center">
                                  <div className="flex justify-center text-brand-accent mb-1.5"><Bed size={20} /></div>
                                  <div className="font-black text-lg md:text-xl">{selectedProperty.bedrooms}</div>
                                  <div className="text-[9px] uppercase opacity-40 font-bold tracking-wider">Beds</div>
                                </div>
                                <div className="text-center">
                                  <div className="flex justify-center text-brand-accent mb-1.5"><Bath size={20} /></div>
                                  <div className="font-black text-lg md:text-xl">{selectedProperty.bathrooms}</div>
                                  <div className="text-[9px] uppercase opacity-40 font-bold tracking-wider">Baths</div>
                                </div>
                              </>
                            ) : (
                              <div className="text-center flex-1">
                                <div className="flex justify-center text-brand-accent mb-1.5"><Square size={20} /></div>
                                <div className="font-black text-lg md:text-xl uppercase">{selectedProperty.floorAreaSqm || 500} SQM</div>
                                <div className="text-[9px] uppercase opacity-40 font-bold tracking-wider">Plot Size</div>
                              </div>
                            )}

                            {(selectedProperty.bedrooms || 0) > 0 && (
                              <div className="text-center hidden sm:block">
                                <div className="flex justify-center text-brand-accent mb-1.5"><Square size={20} /></div>
                                <div className="font-black text-lg md:text-xl">{(selectedProperty.floorAreaSqm || 0).toLocaleString()}</div>
                                <div className="text-[9px] uppercase opacity-40 font-bold tracking-wider">Sq Ft</div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                          <div className="space-y-5">
                            <h4 className="font-display text-xs font-black uppercase tracking-[0.35em] text-brand-accent italic">The Opportunity</h4>
                            <p className="text-sm md:text-base text-white/85 leading-relaxed font-poppins">
                              {selectedProperty.description || 'Experience the pinnacle of luxury living in this thoughtfully designed property.'}
                            </p>
                          </div>

                          {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                            <div className="space-y-5">
                              <h4 className="font-display text-xs font-black uppercase tracking-[0.35em] text-brand-accent italic">Exclusive Features</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {selectedProperty.amenities.map((feature: string) => (
                                  <div key={feature} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
                                    <CheckCircle2 size={14} className="text-brand-accent flex-shrink-0" />
                                    <span className="font-display text-[10px] font-bold uppercase tracking-wider text-white/70">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="pt-6 border-t border-white/5">
                          <button
                            onClick={() => setIsConsulting(true)}
                            className="font-display w-full bg-brand-accent text-brand-deep py-5 rounded-xl font-black text-[11px] uppercase tracking-[0.4em] hover:bg-brand-accent/90 transition-all shadow-xl shadow-brand-accent/30 hover:scale-[1.01] active:scale-95 text-center block"
                          >
                            Request Private Consultation
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
