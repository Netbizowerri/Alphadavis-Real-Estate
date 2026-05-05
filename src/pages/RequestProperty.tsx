import { useActionState, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, MapPin, Loader2, Home, Landmark, ShieldCheck, ChevronDown } from 'lucide-react';
import SuccessModal from '../components/SuccessModal';
import { submitPropertyRequest } from '../lib/services';

async function requestAction(prevState: any, formData: FormData) {
  const data = {
    fullName: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    preferredArea: formData.get('location'),
    budgetMax: formData.get('budget'),
    requestType: formData.get('type'),
    additionalNotes: formData.get('specs'),
  };

  try {
    await submitPropertyRequest(data);
    return { success: true, message: "Request received! Our agents will contact you with matching properties." };
  } catch (error) {
    return { success: false, error: 'Submission failed. Please try again.' };
  }
}

export default function RequestProperty() {
  const [state, formAction, isPending] = useActionState(requestAction, null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setShowModal(true);
    }
  }, [state]);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-brand-light">
      <SuccessModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        message={state?.message}
      />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <span className="font-display text-brand-accent font-bold uppercase tracking-widest text-xs italic">Tailored Finding</span>
              <h1 className="text-2xl md:text-5xl font-black tracking-tight uppercase leading-none text-brand-deep">
                Property <span className="font-serif-italic normal-case block md:inline text-brand-deep">Request.</span>
              </h1>
              <p className="text-xl text-brand-deep/60 font-medium leading-relaxed max-w-lg">
                Can't find what you're looking for? Tell us exactly what you want, where you want it, and your budget.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-brand-deep/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-brand-deep/10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <MapPin size={24} />
                </div>
                <h4 className="font-display font-black uppercase text-xs tracking-widest italic text-brand-deep">Specific Locations</h4>
                <p className="text-xs text-brand-deep/50 leading-relaxed font-medium">From Lagos to Abuja & Abroad, we find the exact spot you desire.</p>
              </div>
              <div className="bg-brand-deep/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-brand-deep/10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="font-display font-black uppercase text-xs tracking-widest italic text-brand-deep">Verified Title</h4>
                <p className="text-xs text-brand-deep/50 leading-relaxed font-medium">We ensure all properties meet strict legal documentation standards.</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-brand-deep/5 border border-brand-deep/10 backdrop-blur-md p-8 md:p-12 rounded-[4rem] relative shadow-2xl">
              <div className="absolute -top-12 right-12 w-24 h-24 bg-brand-accent rounded-[2rem] flex items-center justify-center -rotate-12 shadow-2xl shadow-brand-accent/30">
                <Landmark size={32} className="text-black" />
              </div>

              <h2 className="font-display text-[10px] font-black uppercase tracking-[0.4em] mb-12 text-brand-accent italic">Request Form</h2>
              
              <form action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-brand-deep">
                <div className="md:col-span-2">
                    <input 
                      name="name"
                      type="text" 
                      required
                      placeholder="FULL NAME" 
                      className="font-display w-full bg-white border border-brand-accent/30 rounded-xl px-6 py-4 focus:border-brand-accent outline-none transition-all font-bold text-[10px] tracking-widest uppercase placeholder:text-brand-deep/30 text-black shadow-sm" 
                    />
                </div>
                <input 
                  name="phone"
                  type="tel" 
                  required
                  placeholder="PHONE NUMBER" 
                  className="font-display w-full bg-white border border-brand-accent/30 rounded-xl px-6 py-4 focus:border-brand-accent outline-none transition-all font-bold text-[10px] tracking-widest uppercase placeholder:text-brand-deep/30 text-black shadow-sm" 
                />
                <input 
                  name="email"
                  type="email" 
                  required
                  placeholder="EMAIL ADDRESS" 
                  className="font-display w-full bg-white border border-brand-accent/30 rounded-xl px-6 py-4 focus:border-brand-accent outline-none transition-all font-bold text-[10px] tracking-widest uppercase placeholder:text-brand-deep/30 text-black shadow-sm" 
                />
                <input 
                  name="location"
                  type="text" 
                  required
                  placeholder="PREFERRED LOCATION (E.G. LEKKI)" 
                  className="font-display w-full bg-white border border-brand-accent/30 rounded-xl px-6 py-4 focus:border-brand-accent outline-none transition-all font-bold text-[10px] tracking-widest uppercase placeholder:text-brand-deep/30 text-black md:col-span-2 shadow-sm" 
                />
                <input 
                  name="budget"
                  type="text" 
                  required
                  placeholder="BUDGET RANGE (E.G. 50M - 100M)" 
                  className="font-display w-full bg-white border border-brand-accent/30 rounded-xl px-6 py-4 focus:border-brand-accent outline-none transition-all font-bold text-[10px] tracking-widest uppercase placeholder:text-brand-deep/30 text-black shadow-sm" 
                />
                <div className="relative">
                  <select 
                    name="type"
                    className="font-display w-full bg-white border border-brand-accent/30 rounded-xl px-6 py-4 focus:border-brand-accent outline-none transition-all font-bold text-[10px] tracking-widest uppercase text-black appearance-none shadow-sm"
                  >
                    <option className="bg-white text-black">4 BEDROOM DUPLEX</option>
                    <option className="bg-white text-black">PORTION OF LAND</option>
                    <option className="bg-white text-black">APARTMENT/FLAT</option>
                    <option className="bg-white text-black">COMMERCIAL PLOT</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={14} className="text-brand-accent" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <textarea 
                    name="specs"
                    rows={4} 
                    placeholder="SPECIFIC FEATURES (E.G. BOREHOLE, GYM, GARDEN...)" 
                    className="font-display w-full bg-white border border-brand-accent/30 rounded-xl px-6 py-4 focus:border-brand-accent outline-none transition-all font-bold text-[10px] tracking-widest uppercase placeholder:text-brand-deep/30 text-black resize-none shadow-sm"
                  />
                </div>

                <button 
                  disabled={isPending}
                  className="font-display md:col-span-2 w-full bg-brand-accent text-black py-5 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-brand-accent/90 transition-all shadow-xl shadow-brand-accent/20 disabled:opacity-70 mt-4"
                >
                  {isPending ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>Submit Property Request <Send size={14} /></>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
