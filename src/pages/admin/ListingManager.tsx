import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Download,
  LayoutGrid,
  List
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

export default function ListingManager() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedProp, setSelectedProp] = useState<string | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "properties"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProperties(docs);
      setLoading(false);
    }, (err) => {
      console.error("Properties listener failed:", err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to decommission this asset from the market?")) {
      try {
        await deleteDoc(doc(db, "properties", id));
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "properties", id), { isPublished: !currentStatus });
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const filteredProperties = properties.filter(p => {
    const title = p.title || '';
    const neighborhood = p.neighborhood || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         neighborhood.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && p.isPublished) || 
                         (statusFilter === 'draft' && !p.isPublished);
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-all text-slate-600"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-sm font-black uppercase tracking-widest text-brand-accent italic">
              Global Asset Inventory
            </h1>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest italic mt-0.5">
              Control Center &bull; {properties.length} Total Registered
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden md:flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-brand-accent shadow-sm' : 'text-slate-400'}`}
              >
                <List size={16} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-brand-accent shadow-sm' : 'text-slate-400'}`}
              >
                <LayoutGrid size={16} />
              </button>
           </div>
           <button 
             onClick={() => navigate('/admin/properties/add')}
             className="bg-brand-accent text-white font-black uppercase tracking-widest text-[10px] px-8 py-3.5 rounded-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-accent/20"
           >
             <Plus size={16} /> New Asset
           </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filters Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 mb-10">
          <div className="flex-1 relative group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-accent transition-colors" size={18} />
             <input 
               type="text" 
               placeholder="Identify asset by name or neighborhood..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent transition-all"
             />
          </div>
          <div className="flex gap-4">
             <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-10 text-xs font-black uppercase tracking-widest italic focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all appearance-none"
                >
                   <option value="all">Global States</option>
                   <option value="published">Market Live</option>
                   <option value="draft">Internal Draft</option>
                </select>
             </div>
             <button className="p-4 bg-slate-100 rounded-2xl text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all">
                <Download size={18} />
             </button>
          </div>
        </div>

        {/* Listings Display */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
             <Loader2 className="animate-spin text-brand-accent" size={48} />
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Accessing Mainframe Vault...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20 md:py-32 bg-white rounded-[3rem] border border-slate-200 border-dashed px-6">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="text-slate-200" size={40} />
             </div>
             <h3 className="text-xl font-black uppercase tracking-tighter text-slate-800 italic mb-2">No Assets Detected</h3>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic mb-8">Try refining your search parameters or add a new asset to the registry</p>
             <button 
                onClick={() => navigate('/admin/properties/add')}
                className="bg-brand-accent text-slate-900 font-black uppercase tracking-widest text-[10px] px-10 py-4 rounded-xl inline-flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-accent/20"
             >
                <Plus size={18} /> Register First Property
             </button>
          </div>
        ) : viewMode === 'table' ? (
          <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm shadow-slate-200/40">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                   <tr className="bg-slate-50/50">
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Identity & Visual</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Valuation</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Location State</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Market Status</th>
                      <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Global Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProperties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-slate-50/50 transition-colors group italic">
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <div className="w-16 h-12 rounded-xl border border-slate-200 overflow-hidden flex-shrink-0 bg-slate-100 shadow-sm">
                               <img src={prop.coverImageUrl || prop.galleryImages?.[0]} className="w-full h-full object-cover" />
                            </div>
                            <div>
                               <div className="text-xs font-black uppercase tracking-tight text-slate-800">{prop.title}</div>
                               <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">{prop.propertyType}</div>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="text-xs font-black text-brand-accent">{prop.priceLabel || `₦${Number(prop.price).toLocaleString()}`}</div>
                         <div className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{prop.listingType}</div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="text-xs font-bold text-slate-700">{prop.neighborhood || 'N/A'}</div>
                         <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-0.5">{prop.state}</div>
                      </td>
                      <td className="px-8 py-6">
                         <button 
                           onClick={() => togglePublish(prop.id, prop.isPublished)}
                           className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${prop.isPublished ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-100 border-slate-200 text-slate-400'}`}
                         >
                            <div className={`w-1.5 h-1.5 rounded-full ${prop.isPublished ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                            <span className="text-[9px] font-black uppercase tracking-widest">{prop.isPublished ? 'Market Live' : 'Vaulted Draft'}</span>
                         </button>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => navigate(`/admin/properties/edit/${prop.id}`)}
                              className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-all duration-300 shadow-sm"
                            >
                               <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => handleDelete(prop.id)}
                              className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 shadow-sm"
                            >
                               <Trash2 size={14} />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
             {filteredProperties.map((prop) => (
                <div key={prop.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all italic group">
                   <div className="relative aspect-video">
                      <img src={prop.coverImageUrl || prop.galleryImages?.[0]} className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4 flex gap-2">
                         <div className={`px-3 py-1.5 rounded-xl border font-black uppercase tracking-widest text-[8px] shadow-lg backdrop-blur-md ${prop.isPublished ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-slate-800/90 text-white border-slate-700'}`}>
                            {prop.isPublished ? 'Live' : 'Draft'}
                         </div>
                      </div>
                   </div>
                   <div className="p-8">
                      <div className="flex justify-between items-start mb-4">
                         <div>
                            <h3 className="text-sm font-black uppercase tracking-tight text-slate-800">{prop.title}</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{prop.neighborhood}, {prop.state}</p>
                         </div>
                         <div className="text-xs font-black text-brand-accent">{prop.priceLabel || `₦${Number(prop.price).toLocaleString()}`}</div>
                      </div>
                      <div className="flex items-center gap-2 pt-6 border-t border-slate-100">
                         <button 
                           onClick={() => navigate(`/admin/properties/edit/${prop.id}`)}
                           className="flex-1 py-3.5 rounded-2xl bg-brand-accent text-white font-black uppercase tracking-widest text-[9px] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-accent/20"
                         >
                            Sync Identity
                         </button>
                         <button 
                           onClick={() => togglePublish(prop.id, prop.isPublished)}
                           className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-accent hover:border-brand-accent transition-all"
                         >
                            <Eye size={18} />
                         </button>
                         <button 
                           onClick={() => handleDelete(prop.id)}
                           className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-500 transition-all"
                         >
                            <Trash2 size={18} />
                         </button>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
