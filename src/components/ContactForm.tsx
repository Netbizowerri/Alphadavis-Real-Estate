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
    <div className="glass p-8 md:p-12 rounded-[3.5rem] border-brand-accent/5 shadow-2xl">
      <h4 className="font-display text-2xl md:text-3xl font-black uppercase tracking-tight mb-10 border-b-4 border-brand-accent pb-4 italic text-brand-deep leading-none">
        Request Consultation
      </h4>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="font-display text-[10px] font-black uppercase tracking-widest text-brand-deep ml-1">Full Name</label>
          <input 
            name="name"
            type="text" 
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="ENTER YOUR FULL NAME" 
            className="font-display w-full bg-white border border-brand-accent/30 rounded-xl px-6 py-4 focus:border-brand-accent outline-none transition-all font-bold text-[10px] tracking-widest uppercase placeholder:text-brand-deep/30 text-black shadow-sm" 
          />
        </div>

        <div className="space-y-2">
          <label className="font-display text-[10px] font-black uppercase tracking-widest text-brand-deep ml-1">Email Address</label>
          <input 
            name="email"
            type="email" 
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="ENTER YOUR EMAIL ADDRESS" 
            className="font-display w-full bg-white border border-brand-accent/30 rounded-xl px-6 py-4 focus:border-brand-accent outline-none transition-all font-bold text-[10px] tracking-widest uppercase placeholder:text-brand-deep/30 text-black shadow-sm" 
          />
        </div>

        <div className="space-y-2">
          <label className="font-display text-[10px] font-black uppercase tracking-widest text-brand-deep ml-1">Service Interest</label>
          <div className="relative">
            <select 
              name="interest"
              value={formData.interest}
              onChange={(e) => setFormData({...formData, interest: e.target.value})}
              className="font-display w-full bg-white border border-brand-accent/30 rounded-xl px-6 py-4 focus:border-brand-accent outline-none transition-all font-bold text-[10px] tracking-widest uppercase text-black appearance-none cursor-pointer shadow-sm"
            >
              <option className="text-black bg-white">LAND ACQUISITION</option>
              <option className="text-black bg-white">PROPERTY DEVELOPMENT</option>
              <option className="text-black bg-white">DIASPORA SERVICES</option>
              <option className="text-black bg-white">INVESTMENT ADVISORY</option>
              <option className="text-black bg-white">GENERAL INQUIRY</option>
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown size={14} className="text-brand-accent" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-display text-[10px] font-black uppercase tracking-widest text-brand-deep ml-1">Your Requirements</label>
          <textarea 
            name="message"
            rows={4} 
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            placeholder="HOW CAN WE ASSIST YOU?" 
            className="font-display w-full bg-white border border-brand-accent/30 rounded-xl px-6 py-4 focus:border-brand-accent outline-none transition-all font-bold text-[10px] tracking-widest uppercase placeholder:text-brand-deep/30 text-black resize-none h-32 shadow-sm" 
          />
        </div>

        <button 
          type="submit"
          disabled={isPending}
          className="font-display w-full bg-brand-accent text-brand-deep py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-3 hover:bg-brand-accent/90 transition-all shadow-xl shadow-brand-accent/20 disabled:opacity-70 mt-8"
        >
          {isPending ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              SEND REQUEST <Send size={14} />
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

