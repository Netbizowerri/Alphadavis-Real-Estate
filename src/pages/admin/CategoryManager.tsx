import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Tags, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ArrowLeft,
  Loader2,
  CheckCircle2,
  X,
  Palette,
  Layout,
  ChevronRight
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

export default function CategoryManager() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    color: '#DCC188',
    description: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "categories"), orderBy("name", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenModal = (cat: any = null) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({
        name: cat.name,
        slug: cat.slug,
        color: cat.color || '#DCC188',
        description: cat.description || ''
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        color: '#DCC188',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        updatedAt: serverTimestamp()
      };

      if (editingCategory) {
        await updateDoc(doc(db, "categories", editingCategory.id), data);
      } else {
        await addDoc(collection(db, "categories"), {
          ...data,
          createdAt: serverTimestamp()
        });
      }
      handleCloseModal();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Error saving category.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Archiving this segment might orphan linked assets. Proceed?")) {
      try {
        await deleteDoc(doc(db, "categories", id));
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  return (
    <AdminLayout>
      {/* Header View */}
      <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40 hidden lg:flex">
        <div className="flex items-center gap-4">
           <h2 className="text-sm font-black uppercase tracking-[0.2em] italic text-slate-400">Segment Taxonomy</h2>
           <span className="w-1 h-1 rounded-full bg-slate-300" />
           <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Tags size={12} className="text-brand-accent" /> {categories.length} Structures Defined
           </div>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={() => handleOpenModal()}
             className="bg-brand-accent text-white font-black uppercase tracking-widest text-[10px] px-8 py-3 rounded-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-accent/20"
           >
             <Plus size={16} /> New Segment
           </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="p-6 md:p-10">
        <div className="mb-10 lg:hidden flex items-center justify-between">
           <div>
              <h1 className="text-xl font-black uppercase tracking-tighter text-slate-800 italic">Segments</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{categories.length} Taxonomy Keys</p>
           </div>
           <button 
             onClick={() => handleOpenModal()}
             className="p-3 bg-brand-accent text-white rounded-xl"
           >
              <Plus size={20} />
           </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
             <Loader2 className="animate-spin text-brand-accent" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group italic"
              >
                <div className="flex items-start justify-between mb-8">
                   <div 
                     className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-brand-accent/10"
                     style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                   >
                      <Tags size={32} />
                   </div>
                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(cat)}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:bg-brand-accent hover:text-white transition-all shadow-sm"
                      >
                         <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat.id)}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                         <Trash2 size={14} />
                      </button>
                   </div>
                </div>

                <div className="space-y-2">
                   <h3 className="text-xl font-black uppercase tracking-tight text-slate-800">{cat.name}</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                      {cat.description || 'No architectural definition provided for this market segment.'}
                   </p>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Inventory Anchor</span>
                   </div>
                   <div className="text-[9px] font-black uppercase tracking-widest italic text-brand-accent">
                      Active Asset Key
                   </div>
                </div>
              </div>
            ))}

            <button 
              onClick={() => handleOpenModal()}
              className="rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center min-h-[300px] p-12 text-slate-300 hover:border-brand-accent/30 hover:bg-slate-50 transition-all group"
            >
               <Plus size={48} className="group-hover:scale-110 transition-transform" />
               <span className="text-[10px] font-black uppercase tracking-widest italic mt-4">Expand Taxonomy</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={handleCloseModal}
               className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-md"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl relative z-10 overflow-hidden border border-slate-100 italic"
             >
                <div className="p-10">
                   <div className="flex items-center justify-between mb-10">
                      <div>
                         <h2 className="text-xl font-black uppercase tracking-tight text-slate-800">
                            {editingCategory ? 'Edit Segment' : 'New Segment Identity'}
                         </h2>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Classification Intelligence</p>
                      </div>
                      <button onClick={handleCloseModal} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-slate-600 transition-colors">
                         <X size={20} />
                      </button>
                   </div>

                   <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="space-y-2.5">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Segment Name</label>
                         <input 
                           type="text" 
                           value={formData.name}
                           onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                           required
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all"
                           placeholder="e.g. Waterfront Penthouse"
                         />
                      </div>

                      <div className="space-y-2.5">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Brand Anchor Color</label>
                         <div className="flex gap-4 items-center">
                            <input 
                              type="color" 
                              value={formData.color}
                              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                              className="w-16 h-16 rounded-2xl bg-white border border-slate-100 cursor-pointer overflow-hidden p-1 shadow-sm"
                            />
                            <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-5 text-xs font-black uppercase tracking-widest text-slate-400">
                               Digital ID: <span className="text-slate-800">{formData.color}</span>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-2.5">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Architectural Narrative</label>
                         <textarea 
                           value={formData.description}
                           onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                           rows={4}
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all resize-none"
                           placeholder="How does this segment define the market?"
                         />
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-5 bg-brand-accent text-white font-black uppercase tracking-widest text-[11px] rounded-[1.5rem] shadow-xl shadow-brand-accent/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                         {editingCategory ? 'Update Taxonomy' : 'Sync New Segment'} <ChevronRight size={18} />
                      </button>
                   </form>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
