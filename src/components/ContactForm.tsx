import React, { useState, useEffect } from 'react';
import { Send, Loader2, ChevronDown } from 'lucide-react';
import SuccessModal from './SuccessModal';
import { submitConsultationRequest } from '../lib/services';

export default function ContactForm({ 
  titleColor = "text-brand-accent", 
  initialMessage = "", 
  initialInterest = "LAND ACQUISITION" 
}: { 
  titleColor?: string, 
  initialMessage?: string,
  initialInterest?: string 
}) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: initialInterest,
    message: initialMessage
  });

  // Sync initial message if it changes (e.g. user selects another property then comes back)
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      message: initialMessage,
      interest: initialInterest
    }));
  }, [initialMessage, initialInterest]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      fullName: formData.name,
      email: formData.email,
      interest: formData.interest,
      message: formData.message,
    };

    try {
      await submitConsultationRequest(data);
      setShowSuccess(true);
      setFormData({ name: '', email: '', interest: initialInterest, message: '' });
    } catch (error) {
      console.error('Submission failed', error);
    }
  }

  const isPending = false; // Simplified for this turn, or could use state

  return (
    <div className="glass p-6 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl bg-white/5 backdrop-blur-xl">
      <h4 className="font-display text-2xl md:text-3xl font-black uppercase tracking-tight mb-8 border-b-2 border-brand-accent/30 pb-5 italic text-brand-accent leading-none">
        Request Private Consultation
      </h4>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="font-display text-[9px] md:text-[10px] font-black uppercase tracking-widest text-brand-deep">Full Name</label>
          <input 
            name="name"
            type="text" 
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="ENTER YOUR FULL NAME" 
            className="font-display w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4 focus:border-brand-accent focus:bg-white/15 outline-none transition-all font-bold text-[10px] tracking-widest uppercase placeholder:text-brand-primary/30 text-white shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="font-display text-[9px] md:text-[10px] font-black uppercase tracking-widest text-brand-deep">Email Address</label>
          <input 
            name="email"
            type="email" 
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="ENTER YOUR EMAIL ADDRESS" 
            className="font-display w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4 focus:border-brand-accent focus:bg-white/15 outline-none transition-all font-bold text-[10px] tracking-widest uppercase placeholder:text-brand-primary/30 text-white shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="font-display text-[9px] md:text-[10px] font-black uppercase tracking-widest text-brand-deep">Service Interest</label>
          <div className="relative">
            <select 
              name="interest"
              value={formData.interest}
              onChange={(e) => setFormData({...formData, interest: e.target.value})}
              className="font-display w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4 focus:border-brand-accent focus:bg-white/15 outline-none transition-all font-bold text-[10px] tracking-widest uppercase text-white appearance-none cursor-pointer shadow-sm"
            >
              <option className="text-black bg-white" value="LAND ACQUISITION">LAND ACQUISITION</option>
              <option className="text-black bg-white" value="PROPERTY DEVELOPMENT">PROPERTY DEVELOPMENT</option>
              <option className="text-black bg-white" value="DIASPORA SERVICES">DIASPORA SERVICES</option>
              <option className="text-black bg-white" value="INVESTMENT ADVISORY">INVESTMENT ADVISORY</option>
              <option className="text-black bg-white" value="GENERAL INQUIRY">GENERAL INQUIRY</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown size={14} className="text-brand-accent/60" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-display text-[9px] md:text-[10px] font-black uppercase tracking-widest text-brand-deep">Your Requirements</label>
          <textarea 
            name="message"
            rows={4} 
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            placeholder="HOW CAN WE ASSIST YOU?"
            className="font-display w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4 focus:border-brand-accent focus:bg-white/15 outline-none transition-all font-bold text-[10px] tracking-widest uppercase placeholder:text-brand-primary/30 text-white resize-none h-32 shadow-sm"
          />
        </div>

        <button 
          type="submit"
          disabled={isPending}
          className="font-display w-full bg-brand-accent text-brand-deep py-5 rounded-xl font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-brand-accent/90 transition-all shadow-xl shadow-brand-accent/20 disabled:opacity-70 mt-6"
        >
          {isPending ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              Send Request <Send size={14} />
            </>
          )}
        </button>
      </form>

      <SuccessModal 
        isOpen={showSuccess} 
        onClose={() => setShowSuccess(false)} 
      />
    </div>
  );
}

