import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export default function SuccessModal({ 
  isOpen, 
  onClose, 
  title = "Thank You!", 
  message = "Your submission was successful. Our team will get back to you shortly." 
}: SuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-brand-deep w-full max-w-md p-8 rounded-[3rem] border-white/10 text-center shadow-2xl overflow-hidden text-white mb-20 md:mb-0"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-brand-accent/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-brand-accent/10 rounded-full blur-3xl" />

            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-accent/10 text-brand-accent">
              <CheckCircle2 size={40} />
            </div>

            <h3 className="text-3xl font-black uppercase tracking-tight mb-4 font-display italic">
              {title}
            </h3>
            <p className="text-white/60 font-medium leading-relaxed mb-8">
              {message}
            </p>

            <button
              onClick={onClose}
              className="w-full py-4 bg-brand-accent text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] transition-all"
            >
              Close Message
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
