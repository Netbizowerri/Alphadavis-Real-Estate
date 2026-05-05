import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, Building2, Tags, MessageSquare, Plus, Search,
  Activity, Edit2, Trash2, Eye, CheckCircle2, Loader2, ChevronRight,
  Users, Phone, Mail, Clock, AlertCircle, Download, RefreshCw
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { auth, db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { seedAllProperties, listenToConsultationRequests, listenToPropertyRequests, listenToContactMessages } from '../../lib/services';
import { formatNaira, getPropertyImage, getPropertyLocation } from '../../lib/propertyFormat';
import { SEED_PROPERTIES } from '../../constants';

type TabType = 'overview' | 'inquiries';

export default function AdminDashboard() {
  const [properties, setProperties] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [propertyRequests, setPropertyRequests] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<{ added: number; updated: number; skipped: number } | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [inquiryTab, setInquiryTab] = useState<'consultations' | 'requests' | 'messages'>('consultations');
  const navigate = useNavigate();

  useEffect(() => {
    const qProps = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
    const unsubProps = onSnapshot(qProps, (snapshot) => {
      setProperties(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));

    const qCats = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const unsubCats = onSnapshot(qCats, (snapshot) => {
      setCategories(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, () => {});

    const unsubConsult = listenToConsultationRequests(setConsultations);
    const unsubReqs = listenToPropertyRequests(setPropertyRequests);
    const unsubMsgs = listenToContactMessages(setContactMessages);

    return () => { unsubProps(); unsubCats(); unsubConsult(); unsubReqs(); unsubMsgs(); };
  }, []);

  const handleSeedAll = async () => {
    if (!confirm(`This will sync ${SEED_PROPERTIES.length} default properties from constants.ts into Firestore. Existing listings with the same slug will be updated. Continue?`)) return;
    setSeeding(true);
    setSeedResult(null);
    const result = await seedAllProperties(SEED_PROPERTIES);
    setSeeding(false);
    if (result.success) setSeedResult({ added: result.added, updated: result.updated, skipped: result.skipped });
    else alert('Property sync failed. Check Firestore permissions.');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently remove this property from the registry?')) return;
    await deleteDoc(doc(db, 'properties', id));
  };

  const totalInquiries = consultations.length + propertyRequests.length + contactMessages.length;
  const stats = {
    total: properties.length,
    active: properties.filter((p) => p.isPublished).length,
    featured: properties.filter((p) => p.isFeatured).length,
    inquiries: totalInquiries,
  };

  const pieData = categories.length > 0
    ? categories.map((cat, i) => ({
        name: cat.name,
        value: properties.filter((p) => p.propertyType === cat.name).length || 1,
        color: cat.color || `hsl(${i * 137.5 % 360}, 70%, 50%)`
      })).slice(0, 5)
    : [{ name: 'No Data', value: 1, color: '#f1f5f9' }];

  return (
    <AdminLayout>
      <header className="h-20 bg-white border-b border-slate-200 px-8 items-center justify-between sticky top-0 z-40 hidden lg:flex">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] italic text-slate-400">Control Center</h2>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Activity size={12} className="text-brand-accent" /> System Operational
          </div>
        </div>
        <div className="flex items-center gap-3">
          {totalInquiries > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-[10px] font-black uppercase tracking-widest">
              <MessageSquare size={14} /> {totalInquiries} New Inquiries
            </div>
          )}
          <button
            onClick={() => navigate('/admin/properties/add')}
            className="bg-brand-accent text-slate-900 font-black uppercase tracking-widest text-[10px] px-6 py-2.5 rounded-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-accent/20"
          >
            <Plus size={16} /> New Property
          </button>
        </div>
      </header>

      <div className="lg:hidden p-6 pb-0">
        <button
          onClick={() => navigate('/admin/properties/add')}
          className="w-full bg-brand-accent text-slate-900 font-black uppercase tracking-widest text-xs px-6 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-brand-accent/20"
        >
          <Plus size={20} /> Register New Property
        </button>
      </div>

      <div className="px-6 md:px-10 pt-8">
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
          {([['overview', 'Overview'], ['inquiries', `Inquiries (${totalInquiries})`]] as [TabType, string][]).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-10 space-y-10">
        {activeTab === 'overview' && (
          <>
            {properties.length === 0 && !loading && (
              <div className="bg-[#0f172a] rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 max-w-2xl">
                  <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic mb-4 leading-none">
                    System <span className="text-brand-accent">Ready</span> for Init
                  </h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-8 italic">
                    Your property registry is empty. Sync the seeded properties from constants.ts or add listings manually.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => navigate('/admin/properties/add')}
                      className="bg-white text-slate-900 font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-xl flex items-center justify-center gap-3 hover:scale-105 transition-all"
                    >
                      <Plus size={18} /> Add Manually
                    </button>
                    <button
                      onClick={handleSeedAll}
                      disabled={seeding}
                      className="bg-brand-accent text-slate-900 font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-xl flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-lg shadow-brand-accent/30 disabled:opacity-60"
                    >
                      {seeding ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                      Sync {SEED_PROPERTIES.length} Seed Properties
                    </button>
                  </div>
                  {seedResult && (
                    <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                      Sync complete: {seedResult.added} added / {seedResult.updated} updated / {seedResult.skipped} skipped
                    </div>
                  )}
                </div>
                <div className="absolute -right-20 -bottom-20 opacity-10"><Building2 size={400} /></div>
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Properties', value: stats.total, icon: <Building2 className="text-brand-accent" />, color: 'gold' },
                { label: 'Active Listings', value: stats.active, icon: <Eye className="text-emerald-500" />, color: 'emerald' },
                { label: 'Featured Picks', value: stats.featured, icon: <CheckCircle2 className="text-amber-500" />, color: 'amber' },
                { label: 'Total Inquiries', value: stats.inquiries, icon: <MessageSquare className="text-rose-500" />, color: 'rose' },
              ].map((s) => (
                <div key={s.label} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:scale-[1.02] transition-all flex flex-col justify-between gap-4">
                  <div className={`p-3 rounded-xl w-fit ${s.color === 'gold' ? 'bg-brand-accent/10' : s.color === 'emerald' ? 'bg-emerald-50' : s.color === 'amber' ? 'bg-amber-50' : 'bg-rose-50'}`}>
                    {s.icon}
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-800 tracking-tighter italic">{s.value}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] italic">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-base font-black uppercase tracking-tighter text-slate-800 italic">Recent Properties</h3>
                  <button onClick={() => navigate('/admin/properties')} className="text-[10px] font-bold uppercase tracking-widest text-brand-accent hover:underline flex items-center gap-1">
                    View all <ChevronRight size={12} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Property</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Price</th>
                        <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                        <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading ? (
                        Array(3).fill(0).map((_, i) => (
                          <tr key={i} className="animate-pulse">
                            <td className="px-6 py-5"><div className="h-4 bg-slate-100 rounded w-3/4" /></td>
                            <td className="px-6 py-5"><div className="h-4 bg-slate-100 rounded w-1/2" /></td>
                            <td className="px-6 py-5"><div className="h-4 bg-slate-100 rounded w-1/3" /></td>
                            <td className="px-6 py-5"><div className="h-4 bg-slate-100 rounded w-1/4 ml-auto" /></td>
                          </tr>
                        ))
                      ) : properties.slice(0, 6).map((prop) => (
                        <tr key={prop.id} className="hover:bg-slate-50/50 transition-colors group italic">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl border border-slate-200 overflow-hidden flex-shrink-0 bg-slate-100">
                                <img src={getPropertyImage(prop)} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <div>
                                <div className="text-xs font-black uppercase text-slate-800">{prop.title}</div>
                                <div className="text-[9px] font-bold text-slate-400">{getPropertyLocation(prop)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-black text-brand-accent">{formatNaira(prop.price, prop.priceLabel)}</td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase ${prop.isPublished ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${prop.isPublished ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                              {prop.isPublished ? 'Live' : 'Draft'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => navigate(`/admin/properties/edit/${prop.id}`)} className="p-2 rounded-xl bg-slate-100 border border-slate-200 hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-all">
                                <Edit2 size={13} />
                              </button>
                              <button onClick={() => handleDelete(prop.id)} className="p-2 rounded-xl bg-slate-100 border border-slate-200 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-black uppercase text-slate-800 italic mb-4">Category Split</h3>
                  <div className="h-[180px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={6} dataKey="value">
                          {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-black text-slate-800">{properties.length}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Assets</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-black uppercase text-slate-800 italic mb-4">Data Tools</h3>
                  <button onClick={handleSeedAll} disabled={seeding} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-brand-accent/10 border border-slate-100 hover:border-brand-accent/20 rounded-2xl transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm text-brand-accent">
                        {seeding ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] font-black uppercase text-slate-800">Sync Seed Properties</div>
                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Creates missing listings and updates matching slugs</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300" />
                  </button>
                  {seedResult && (
                    <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-[9px] font-black uppercase tracking-widest">
                      Sync complete: {seedResult.added} added / {seedResult.updated} updated / {seedResult.skipped} skipped
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="flex gap-2 flex-wrap">
              {([
                ['consultations', `Consultations (${consultations.length})`],
                ['requests', `Property Requests (${propertyRequests.length})`],
                ['messages', `Messages (${contactMessages.length})`],
              ] as const).map(([tab, label]) => (
                <button
                  key={tab}
                  onClick={() => setInquiryTab(tab)}
                  className={`px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] border transition-all ${inquiryTab === tab ? 'bg-brand-accent text-slate-900 border-brand-accent shadow-lg shadow-brand-accent/20' : 'bg-white text-slate-500 border-slate-200 hover:border-brand-accent/30'}`}
                >
                  {label}
                </button>
              ))}
            </div>

            {inquiryTab === 'consultations' && (
              <InquiryTable data={consultations} type="consultation" emptyMsg="No consultation requests yet" />
            )}

            {inquiryTab === 'requests' && (
              <InquiryTable data={propertyRequests} type="request" emptyMsg="No property requests yet" />
            )}

            {inquiryTab === 'messages' && (
              <InquiryTable data={contactMessages} type="message" emptyMsg="No contact messages yet" />
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function InquiryTable({ data, type, emptyMsg }: { data: any[]; type: string; emptyMsg: string }) {
  const formatDate = (ts: any) => {
    if (!ts) return '-';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 border-dashed p-16 text-center">
        <MessageSquare className="mx-auto text-slate-200 mb-4" size={40} />
        <p className="text-xs font-black uppercase tracking-widest text-slate-300 italic">{emptyMsg}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Name</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact</th>
              {type === 'consultation' && <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interest</th>}
              {type === 'request' && <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget</th>}
              {type === 'message' && <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject</th>}
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors italic">
                <td className="px-6 py-4">
                  <div className="text-xs font-black text-slate-800 uppercase">{item.fullName || item.name || '-'}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
                      <Mail size={10} className="text-brand-accent" /> {item.email || '-'}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
                      <Phone size={10} className="text-brand-accent" /> {item.phone || '-'}
                    </div>
                  </div>
                </td>
                {type === 'consultation' && (
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-600 uppercase max-w-[160px] truncate">{item.interest || item.message?.slice(0, 40) || '-'}</td>
                )}
                {type === 'request' && (
                  <td className="px-6 py-4 text-[10px] font-bold text-brand-accent uppercase">
                    {item.budgetMin ? `${formatNaira(item.budgetMin)} - ${formatNaira(item.budgetMax)}` : item.currency || '-'}
                  </td>
                )}
                {type === 'message' && (
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-600 max-w-[160px] truncate">{item.subject || item.message?.slice(0, 40) || '-'}</td>
                )}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border ${
                    item.status === 'pending' || item.status === 'new' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                    item.status === 'contacted' || item.status === 'confirmed' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                    'bg-slate-100 border-slate-200 text-slate-500'
                  }`}>{item.status || 'new'}</span>
                </td>
                <td className="px-6 py-4 text-[10px] font-bold text-slate-400">{formatDate(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
