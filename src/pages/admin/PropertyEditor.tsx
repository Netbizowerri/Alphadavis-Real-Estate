import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight,
  Upload, 
  X, 
  Loader2, 
  CheckCircle, 
  MapPin, 
  Home, 
  Image as ImageIcon,
  Plus,
  Trash2,
  Settings,
  ChevronRight,
  ChevronLeft,
  Layout,
  Video,
  Youtube,
  Link2,
  Play,
  Star
} from 'lucide-react';
import { auth, db, storage } from '../../lib/firebase';
import { collection, addDoc, updateDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const STEPS = [
  { id: 1, title: 'Identity', icon: <Home size={18} /> },
  { id: 2, title: 'Location', icon: <MapPin size={18} /> },
  { id: 3, title: 'Features', icon: <CheckCircle size={18} /> },
  { id: 4, title: 'Media', icon: <ImageIcon size={18} /> }
];

export default function PropertyEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'Apartment',
    listingType: 'sale',
    status: 'Available',
    price: '',
    priceLabel: '',
    negotiable: false,
    state: 'Enugu',
    city: '',
    neighborhood: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    toilets: '',
    parkingSpaces: '',
    floorAreaSqm: '',
    amenities: [] as string[],
    isFeatured: false,
    isDiasporaPick: false,
    isNewListing: false,
    isPublished: true,
    videoType: 'youtube' as 'youtube' | 'vimeo' | 'upload',
    videoUrl: '',
  });

  // Media State
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
  
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);
  
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const propertyTypes = ['Apartment', 'Duplex', 'Penthouse', 'Terraced House', 'Detached Villa', 'Commercial', 'Land', 'Short Let'];
  const nigerianStates = ['Enugu', 'Lagos', 'Abuja', 'Ogun', 'Oyo', 'Rivers', 'Anambra', 'Imo', 'Delta', 'Edo', 'Kano', 'Kaduna', 'Cross River', 'Akwa Ibom', 'Bayelsa', 'Other'];
  const commonAmenities = ['24/7 Power', 'Swimming Pool', 'Gym', 'Gated Community', 'Smart Home', 'Security', 'Elevator', 'Boys Quarter', 'CCTV', 'Cinema', 'Good Road', 'Fence/Gated', 'Recreational Arena', 'Shopping Mall', 'School', 'Standard Clinic', 'Water', '24/7 Security', 'Solar Lighting', 'Central Water System'];

  useEffect(() => {
    if (id) {
      const fetchProperty = async () => {
        try {
          const docSnap = await getDoc(doc(db, "properties", id));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData(prev => ({
              ...prev,
              ...data,
              price: data.price?.toString() || '',
              bedrooms: data.bedrooms?.toString() || '',
              bathrooms: data.bathrooms?.toString() || '',
              toilets: data.toilets?.toString() || '',
              parkingSpaces: data.parkingSpaces?.toString() || '',
              floorAreaSqm: data.floorAreaSqm?.toString() || '',
            }));
            setExistingCoverUrl(data.coverImageUrl);
            setCoverPreview(data.coverImageUrl);
            setExistingGalleryUrls(data.galleryImages || []);
            setGalleryPreviews(data.galleryImages || []);
          }
        } catch (err) {
          console.error("Fetch failed:", err);
        } finally {
          setInitialLoading(false);
        }
      };
      fetchProperty();
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file as Blob));
      setExistingCoverUrl(null);
    }
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setGalleryImages(prev => [...prev, ...files]);
    setGalleryPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f as Blob))]);
  };

  const removeGalleryImage = (index: number) => {
    if (index < existingGalleryUrls.length) {
      setExistingGalleryUrls(prev => prev.filter((_, i) => i !== index));
      setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - existingGalleryUrls.length;
      setGalleryImages(prev => prev.filter((_, i) => i !== newIndex));
      setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverPreview) {
      alert("Cover image is required!");
      return;
    }
    
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Unauthorized");

      const storageId = id || Date.now().toString();
      let coverUrl = existingCoverUrl;

      if (coverImage) {
        const coverRef = ref(storage, `properties/${storageId}/cover_${Date.now()}`);
        const coverSnapshot = await uploadBytes(coverRef, coverImage);
        coverUrl = await getDownloadURL(coverSnapshot.ref);
      }

      const newGalleryUrls = await Promise.all(
        galleryImages.map(async (file) => {
          const fileRef = ref(storage, `properties/${storageId}/gallery/${Date.now()}_${file.name}`);
          const snap = await uploadBytes(fileRef, file);
          return getDownloadURL(snap.ref);
        })
      );

      const finalGalleryUrls = [...existingGalleryUrls, ...newGalleryUrls];

      const finalData = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        toilets: Number(formData.toilets),
        parkingSpaces: Number(formData.parkingSpaces),
        floorAreaSqm: Number(formData.floorAreaSqm),
        slug: generateSlug(formData.title),
        coverImageUrl: coverUrl,
        galleryImages: finalGalleryUrls,
        updatedAt: serverTimestamp(),
      };

      if (id) {
        await updateDoc(doc(db, "properties", id), finalData);
      } else {
        await addDoc(collection(db, "properties"), {
          ...finalData,
          createdBy: user.uid,
          createdAt: serverTimestamp(),
        });
      }
      
      setSuccess(true);
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err) {
      console.error("Failed to save property:", err);
      alert("Error saving property.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-accent h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-all text-slate-600"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-sm font-black uppercase tracking-widest text-brand-accent italic">
              {id ? 'Edit Property' : 'New Property Registration'}
            </h1>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest italic mt-0.5">
              Secure Terminal &bull; AlphaDavis Real Estate
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 px-4 transition-colors"
          >
            Cancel Session
          </button>
          {currentStep === 4 ? (
             <button 
               onClick={handleSubmit}
               disabled={loading}
               className="bg-brand-accent text-white font-black uppercase tracking-widest text-[10px] px-8 py-3.5 rounded-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-brand-accent/20"
             >
               {loading ? <Loader2 className="animate-spin" size={16} /> : id ? 'Deploy Updates' : 'Sync to Marketplace'}
             </button>
          ) : (
             <button 
               onClick={nextStep}
               className="bg-[#0f172a] text-white font-black uppercase tracking-widest text-[10px] px-8 py-3.5 rounded-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg"
             >
               Continue Step <ChevronRight size={16} />
             </button>
          )}
        </div>
      </header>

      {/* Progress Stepper */}
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <div className="relative flex justify-between">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          <div 
             className="absolute top-1/2 left-0 h-0.5 bg-brand-accent -translate-y-1/2 z-0 transition-all duration-500" 
             style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />
          
          {STEPS.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
              <button 
                onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                  currentStep >= step.id 
                    ? 'bg-brand-accent border-brand-accent text-white shadow-lg shadow-brand-accent/30' 
                    : 'bg-white border-slate-200 text-slate-300'
                }`}
              >
                {currentStep > step.id ? <CheckCircle size={20} /> : step.icon}
              </button>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] italic ${currentStep >= step.id ? 'text-slate-800' : 'text-slate-400'}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-6 mt-16">
         <AnimatePresence mode="wait">
            <motion.div
               key={currentStep}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.3 }}
            >
               {currentStep === 1 && (
                  <div className="space-y-8">
                     <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <SectionHeading title="Asset Identity" subtitle="Primary listing details and segment" />
                        <div className="space-y-6">
                           <InputField label="Asset Listing Title *" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. Diamond Crest Luxury Villa" />
                           <TextArea label="Architectural Narrative" name="description" value={formData.description} onChange={handleInputChange} placeholder="Tell the story of this luxury asset..." />
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <SelectField label="Property Type" name="propertyType" value={formData.propertyType} onChange={handleInputChange} options={propertyTypes} />
                              <SelectField label="Listing Type" name="listingType" value={formData.listingType} onChange={handleInputChange} options={[{val: 'sale', lbl: 'For Sale'}, {val: 'rent', lbl: 'Regular Rent'}, {val: 'shortlet', lbl: 'Short Let'}]} />
                              <InputField label="Status Tag" name="status" value={formData.status} onChange={handleInputChange} placeholder="e.g. Pre-Sale Price" />
                           </div>
                        </div>
                     </div>
                     <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <SectionHeading title="Valuation" subtitle="Pricing and financial terms" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <InputField label="Numeric Value (Price)" name="price" value={formData.price} onChange={handleInputChange} type="number" placeholder="0.00" />
                           <InputField label="Display Label" name="priceLabel" value={formData.priceLabel} onChange={handleInputChange} placeholder="e.g. ₦450 Million" />
                        </div>
                        <div className="mt-6 flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                           <input type="checkbox" id="negotiable" name="negotiable" checked={formData.negotiable} onChange={handleInputChange} className="w-5 h-5 accent-brand-accent rounded" />
                           <label htmlFor="negotiable" className="text-xs font-black uppercase tracking-widest text-slate-500 italic">Price is Negotiable</label>
                        </div>
                     </div>
                  </div>
               )}

               {currentStep === 2 && (
                  <div className="space-y-8">
                     <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <SectionHeading title="Location Intelligence" subtitle="Geographic data and accessibility" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <SelectField label="State Location" name="state" value={formData.state} onChange={handleInputChange} options={nigerianStates} />
                           <InputField label="Neighborhood / Area" name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} placeholder="e.g. Lekki Phase 1" />
                        </div>
                        <div className="mt-6">
                           <InputField label="Street Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Full building identity..." />
                        </div>
                     </div>
                     <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <SectionHeading title="Structural Specs" subtitle="Technical capacity of the asset" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                           <InputField label="Bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} type="number" />
                           <InputField label="Bathrooms" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} type="number" />
                           <InputField label="Toilets" name="toilets" value={formData.toilets} onChange={handleInputChange} type="number" />
                           <InputField label="Parking" name="parkingSpaces" value={formData.parkingSpaces} onChange={handleInputChange} type="number" />
                        </div>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Area (sqm)" name="floorAreaSqm" value={formData.floorAreaSqm} onChange={handleInputChange} type="number" />
                            <InputField label="City" name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Enugu, Lagos" />
                        </div>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                               <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} className="w-5 h-5 accent-brand-accent" />
                               <label htmlFor="isFeatured" className="text-xs font-black uppercase tracking-widest text-slate-500 italic">Featured</label>
                            </div>
                            <div className="flex items-center gap-3 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                               <input type="checkbox" id="isDiasporaPick" name="isDiasporaPick" checked={(formData as any).isDiasporaPick || false} onChange={handleInputChange} className="w-5 h-5 accent-brand-accent" />
                               <label htmlFor="isDiasporaPick" className="text-xs font-black uppercase tracking-widest text-slate-500 italic">Diaspora Pick</label>
                            </div>
                            <div className="flex items-center gap-3 p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                               <input type="checkbox" id="isNewListing" name="isNewListing" checked={(formData as any).isNewListing || false} onChange={handleInputChange} className="w-5 h-5 accent-brand-accent" />
                               <label htmlFor="isNewListing" className="text-xs font-black uppercase tracking-widest text-slate-500 italic">New Listing</label>
                            </div>
                        </div>
                     </div>
                  </div>
               )}

               {currentStep === 3 && (
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                     <SectionHeading title="Features & Amenities" subtitle="Signature luxury offerings" />
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {commonAmenities.map((amenity) => (
                          <button
                            key={amenity}
                            type="button"
                            onClick={() => toggleAmenity(amenity)}
                            className={`p-5 rounded-2xl border text-left flex items-center justify-between group transition-all ${formData.amenities.includes(amenity) ? 'bg-[#0f172a] border-[#0f172a] text-white shadow-xl shadow-slate-900/20 scale-[1.02]' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-brand-accent/30'}`}
                          >
                            <span className="text-[10px] font-black uppercase tracking-widest italic">{amenity}</span>
                            {formData.amenities.includes(amenity) ? <CheckCircle size={14} className="text-brand-accent" /> : <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                          </button>
                        ))}
                     </div>
                     <div className="mt-10 p-6 bg-brand-accent/10 border border-brand-accent/20 rounded-2xl flex items-center gap-4">
                        <Layout className="text-brand-accent" size={24} />
                        <div>
                           <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Dynamic Inventory</p>
                           <p className="text-[10px] font-bold text-slate-500">More amenities can be added in categories settings</p>
                        </div>
                     </div>
                  </div>
               )}

               {currentStep === 4 && (
                  <div className="space-y-8">
                     <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <SectionHeading title="Hero Media" subtitle="Primary visual identity (Required)" />
                        <div 
                          onClick={() => coverInputRef.current?.click()}
                          className={`relative aspect-video rounded-[2rem] border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center ${coverPreview ? 'border-brand-accent' : 'border-slate-200 hover:border-brand-accent/40 bg-slate-50'}`}
                        >
                           {coverPreview ? (
                             <img src={coverPreview} className="w-full h-full object-cover" />
                           ) : (
                             <>
                               <Upload className="mb-4 text-slate-300" size={48} />
                               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic text-center">Sync Primary Hero Asset<br/><span className="text-[8px] font-bold mt-2 block">1920x1080 Recommended</span></p>
                             </>
                           )}
                           {coverPreview && <div className="absolute top-4 left-4 px-3 py-1 bg-brand-accent text-white rounded-lg text-[9px] font-black uppercase flex items-center gap-1 shadow-lg"><Star size={10} fill="white" /> Primary</div>}
                           <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverSelect} />
                        </div>
                     </div>

                     <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <SectionHeading title="Asset Gallery" subtitle="Extended visual collection" />
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                           {galleryPreviews.map((preview, i) => (
                              <div key={i} className="relative aspect-square rounded-2xl border border-slate-200 overflow-hidden group shadow-sm">
                                 <img src={preview} className="w-full h-full object-cover" />
                                 <button 
                                   onClick={() => removeGalleryImage(i)}
                                   className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                 >
                                    <Trash2 size={24} />
                                 </button>
                              </div>
                           ))}
                           <button 
                             onClick={() => galleryInputRef.current?.click()}
                             className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-300 hover:text-brand-accent hover:border-brand-accent/40 transition-all"
                           >
                              <Plus size={32} />
                              <span className="text-[8px] font-black uppercase tracking-widest mt-2">Add Stock</span>
                           </button>
                           <input ref={galleryInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleGallerySelect} />
                        </div>
                     </div>

                     <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                        <SectionHeading title="Cinematic Tour" subtitle="External video link (YouTube/Vimeo)" />
                        <div className="flex gap-4 mb-6">
                           {['youtube', 'vimeo'].map((type) => (
                              <button 
                                key={type}
                                onClick={() => setFormData(prev => ({ ...prev, videoType: type as any }))}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-black uppercase tracking-widest text-[9px] italic transition-all ${formData.videoType === type ? 'bg-brand-accent border-brand-accent text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                              >
                                 {type === 'youtube' ? <Youtube size={16} /> : <Link2 size={16} />}
                                 {type}
                              </button>
                           ))}
                        </div>
                        <div className="relative">
                            <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input 
                               type="url" 
                               name="videoUrl"
                               value={formData.videoUrl}
                               onChange={handleInputChange}
                               placeholder={formData.videoType === 'youtube' ? "Paste YouTube Video URL..." : "Paste Vimeo Video URL..."}
                               className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all"
                            />
                        </div>
                     </div>
                  </div>
               )}
            </motion.div>
         </AnimatePresence>

         {/* Bottom Control Bar */}
         <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.03)] border-t border-slate-200 p-6 z-40 transition-all duration-500">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
               <button 
                 disabled={currentStep === 1}
                 onClick={prevStep}
                 className="flex items-center gap-2 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-slate-800 disabled:opacity-0 transition-all"
               >
                  <ChevronLeft size={16} /> Previous Sequence
               </button>
               
               <div className="flex items-center gap-4">
                  {currentStep < 4 ? (
                     <button 
                       onClick={nextStep}
                       className="bg-[#0f172a] text-white font-black uppercase tracking-widest text-[10px] px-10 py-4 rounded-2xl shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center gap-2"
                     >
                        Next Step <ArrowRight size={16} />
                     </button>
                  ) : (
                     <button 
                       onClick={handleSubmit}
                       disabled={loading}
                       className="bg-brand-accent text-white font-black uppercase tracking-widest text-[10px] px-12 py-4 rounded-2xl shadow-xl shadow-brand-accent/30 active:scale-95 transition-all flex items-center gap-2"
                     >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : 'Sync Global Marketplace'} <ArrowRight size={16} />
                     </button>
                  )}
               </div>
            </div>
         </div>
      </div>

      {/* Persistence Notification */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="w-24 h-24 bg-brand-accent/10 rounded-full flex items-center justify-center mb-8">
               <CheckCircle size={48} className="text-brand-accent" />
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 italic mb-4">Inventory Synced</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] italic animate-pulse">Redirecting to Control Center...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Subcomponents helper
function SectionHeading({ title, subtitle }: { title: string, subtitle: string }) {
   return (
      <div className="mb-10">
         <h3 className="text-xl font-black uppercase tracking-tight text-slate-800 italic underline decoration-brand-accent/30 decoration-4 underline-offset-4">{title}</h3>
         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 italic">{subtitle}</p>
      </div>
   );
}

function InputField({ label, name, value, onChange, placeholder, type = 'text' }: any) {
   return (
      <div className="space-y-2.5">
         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
         <input 
            type={type} 
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all"
         />
      </div>
   );
}

function TextArea({ label, name, value, onChange, placeholder }: any) {
   return (
      <div className="space-y-2.5">
         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
         <textarea 
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={5}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all resize-none"
         />
      </div>
   );
}

function SelectField({ label, name, value, onChange, options }: any) {
   return (
      <div className="space-y-2.5">
         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
         <select 
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all appearance-none italic"
         >
            {options.map((opt: any) => (
               <option key={typeof opt === 'string' ? opt : opt.val} value={typeof opt === 'string' ? opt : opt.val}>
                  {typeof opt === 'string' ? opt : opt.lbl}
               </option>
            ))}
         </select>
      </div>
   );
}
