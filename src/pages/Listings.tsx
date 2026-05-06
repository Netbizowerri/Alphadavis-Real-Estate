import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bed, Bath, Square, MapPin, X, CheckCircle2, Search, Filter, ChevronDown, ArrowLeft, Loader2 } from 'lucide-react';
import { listenToAllProperties } from '../lib/services';
import { formatNaira, getPropertyImage, getPropertyLocation } from '../lib/propertyFormat';
import ContactForm from '../components/ContactForm';

export default function Listings() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    state: 'All',
    neighborhood: 'All',
    priceRange: 'All'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!selectedProperty) {
      setIsConsulting(false);
    }
  }, [selectedProperty]);

  useEffect(() => {
    const unsubscribe = listenToAllProperties((data) => {
      setProperties(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const states = ['All', ...Array.from(new Set(properties.map((p) => p.state || '').filter(Boolean)))];
  const neighborhoods = ['All', ...Array.from(new Set(properties.map((p) => p.neighborhood || '').filter(Boolean)))];

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      getPropertyLocation(p).toLowerCase().includes(searchQuery.toLowerCase());

    const matchesState = filters.state === 'All' || p.state === filters.state;
    const matchesNeighborhood = filters.neighborhood === 'All' || p.neighborhood === filters.neighborhood;

    const priceValue = typeof p.price === 'number' ? p.price : parseInt((p.price || '0').replace(/[^\d]/g, ''));
    let matchesPrice = true;
    if (filters.priceRange === 'Under 5M') matchesPrice = priceValue < 5000000;
    else if (filters.priceRange === '5M - 50M') matchesPrice = priceValue >= 5000000 && priceValue <= 50000000;
    else if (filters.priceRange === '50M - 200M') matchesPrice = priceValue > 50000000 && priceValue <= 200000000;
    else if (filters.priceRange === 'Above 200M') matchesPrice = priceValue > 200000000;

    return matchesSearch && matchesState && matchesNeighborhood && matchesPrice;
  });

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-light">
      <div className="max-w-7xl mx-auto px-6">
        <div className="space-y-12 mb-16">
          <div className="space-y-4">
            <span className="font-display text-brand-accent font-bold uppercase tracking-widest text-xs italic">Explore Our</span>
            <h1 className="text-2xl md:text-5xl font-black tracking-tight uppercase leading-none text-brand-deep">
              Full <span className="font-serif-italic normal-case block md:inline text-brand-deep">Inventory.</span>
            </h1>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-deep/30" size={20} />
                <input
                  type="text"
                  placeholder="SEARCH ASSETS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-brand-accent/30 rounded-2xl pl-16 pr-6 py-5 focus:border-brand-accent outline-none transition-all font-display font-bold text-xs tracking-widest uppercase placeholder:text-brand-deep/20 text-black shadow-sm"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`bg-brand-deep/5 backdrop-blur-md px-8 py-5 rounded-2xl flex items-center gap-3 font-display font-bold text-xs tracking-widest uppercase border border-brand-accent/20 hover:border-brand-accent transition-colors text-brand-deep ${showFilters ? 'border-brand-accent text-brand-accent' : ''}`}
              >
                <Filter size={18} /> Filters
              </button>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-brand-deep/5 border border-brand-deep/10 backdrop-blur-md p-8 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-deep/30 ml-2 italic">Select State</label>
                      <div className="relative">
                        <select
                          value={filters.state}
                          onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                          className="w-full bg-white border border-brand-accent/20 rounded-xl px-4 py-3 outline-none focus:border-brand-accent font-display text-[11px] font-bold uppercase tracking-wider appearance-none cursor-pointer text-black shadow-sm"
                        >
                          {states.map((s) => <option key={s} value={s} className="bg-white text-black">{s}</option>)}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <ChevronDown size={12} className="text-brand-accent" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-deep/30 ml-2 italic">Neighborhood</label>
                      <div className="relative">
                        <select
                          value={filters.neighborhood}
                          onChange={(e) => setFilters({ ...filters, neighborhood: e.target.value })}
                          className="w-full bg-white border border-brand-accent/20 rounded-xl px-4 py-3 outline-none focus:border-brand-accent font-display text-[11px] font-bold uppercase tracking-wider appearance-none cursor-pointer text-black shadow-sm"
                        >
                          {neighborhoods.map((n) => <option key={n} value={n} className="bg-white text-black">{n}</option>)}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <ChevronDown size={12} className="text-brand-accent" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-deep/30 ml-2 italic">Price Range</label>
                      <div className="relative">
                        <select
                          value={filters.priceRange}
                          onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                          className="w-full bg-white border border-brand-accent/20 rounded-xl px-4 py-3 outline-none focus:border-brand-accent font-display text-[11px] font-bold uppercase tracking-wider appearance-none cursor-pointer text-black shadow-sm"
                        >
                          {['All', 'Under 5M', '5M - 50M', '50M - 200M', 'Above 200M'].map((p) => <option key={p} value={p} className="bg-white text-black">{p}</option>)}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <ChevronDown size={12} className="text-brand-accent" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-brand-accent" size={48} />
            <p className="font-display text-brand-deep/40 uppercase font-black tracking-widest italic text-xs">Accessing Inventory...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-24 bg-white/60 rounded-[3rem] border border-brand-deep/10">
            <p className="font-display text-brand-deep/40 uppercase font-black tracking-widest italic text-sm">No Properties Found</p>
            <p className="text-brand-deep/20 text-xs mt-2 font-display uppercase tracking-widest">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProperties.map((property, idx) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedProperty(property)}
                className={`group cursor-pointer bg-brand-deep/5 p-5 rounded-[3rem] card-depth card-accent-${(idx % 4) + 1} hover:border-brand-accent/40 transition-all duration-500 shadow-xl h-full flex flex-col`}
              >
                <div className="relative card-image-container mb-6">
                  <div className={`card-accent-dot card-accent-dot-${(idx % 4) + 1}`} />
                  <div className="absolute top-4 right-4 bg-brand-deep/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 font-display">
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
                  <h3 className="text-lg md:text-xl font-black uppercase group-hover:text-brand-accent transition-colors tracking-tight text-brand-deep relative z-10">{property.title}</h3>
                  <p className="font-display text-brand-deep/60 flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest relative z-10">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent/60" />
                    {getPropertyLocation(property)}
                  </p>
                  <p className="font-display text-[10px] md:text-[11px] text-brand-deep/50 leading-relaxed line-clamp-3 flex-1 relative z-10">
                    {property.shortDescription || property.description?.split('\n')[0] || 'Premium property in a prime location with excellent investment potential.'}
                  </p>
                  <div className="flex items-center gap-4 py-4 border-t border-brand-deep/5 relative z-10">
                    {(property.bedrooms || 0) > 0 ? (
                      <>
                        <div className="font-display flex items-center gap-1.5 text-[10px] font-black text-brand-deep/60 uppercase tracking-tighter">
                          <Bed size={16} className="text-brand-accent" /> {property.bedrooms}
                        </div>
                        <div className="font-display flex items-center gap-1.5 text-[10px] font-black text-brand-deep/60 uppercase tracking-tighter">
                          <Bath size={16} className="text-brand-accent" /> {property.bathrooms}
                        </div>
                      </>
                    ) : (
                      <div className="font-display flex items-center gap-1.5 text-[10px] font-black text-brand-deep/60 uppercase tracking-tighter">
                        <Square size={16} className="text-brand-accent" /> {property.floorAreaSqm || 500}m²
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProperty(property);
                    }}
                    className="font-display w-full bg-brand-deep/20 hover:bg-brand-deep/30 text-brand-deep py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] border border-brand-deep/20 hover:border-brand-deep transition-all duration-300 mt-auto relative z-10"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <section id="listings-contact" className="py-24 bg-brand-light border-t border-brand-deep/5 mt-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <span className="font-display text-brand-accent font-bold uppercase tracking-widest text-xs italic">Direct Inquiry</span>
            <h2 className="text-3xl md:text-5xl font-black text-brand-deep uppercase tracking-tighter">Request <span className="font-serif-italic normal-case block md:inline text-brand-deep">Consultation.</span></h2>
            <p className="font-display text-brand-deep/40 font-bold uppercase text-[10px] tracking-[0.3em] italic">Tailored for your specific requirements</p>
          </div>
          <ContactForm />
        </div>
      </section>

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
    </div>
  );
}
