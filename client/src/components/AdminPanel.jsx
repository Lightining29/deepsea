import React, { useState, useEffect } from 'react';
import { 
  Anchor, ShieldAlert, Plus, Trash2, Edit3, CheckCircle2, 
  Clock, DollarSign, Users, Compass, Layers, AlertCircle, RefreshCw, X, Save 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPanel({ currentUser, onLogout, theme = 'light' }) {
  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [expeditions, setExpeditions] = useState([]);
  const [loading, setLoading] = useState(false);

  // New Expedition Form Modal State
  const [isAddExpeditionOpen, setIsAddExpeditionOpen] = useState(false);
  const [editingExpedition, setEditingExpedition] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formDepth, setFormDepth] = useState('3,000 meters');
  const [formPrice, setFormPrice] = useState('12000');
  const [formVessel, setFormVessel] = useState('Triton Titanium Class');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80');
  const [formZone, setFormZone] = useState('Bathypelagic (Midnight Zone)');
  const [formDesc, setFormDesc] = useState('');

  // Fetch Bookings & Expeditions
  const loadData = async () => {
    setLoading(true);
    try {
      const [bRes, eRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/expeditions')
      ]);
      const bData = await bRes.json();
      const eData = await eRes.json();
      if (bData.success) setBookings(bData.data);
      if (eData.success) setExpeditions(eData.data);
    } catch (err) {
      console.warn("Using fallback local admin data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateBookingStatus = async (bookingRef, newStatus) => {
    try {
      const res = await fetch(`/api/bookings/${bookingRef}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => b.bookingReference === bookingRef ? { ...b, status: newStatus } : b));
      }
    } catch (err) {
      setBookings(prev => prev.map(b => b.bookingReference === bookingRef ? { ...b, status: newStatus } : b));
    }
  };

  const handleDeleteBooking = async (bookingRef) => {
    if (!confirm(`Are you sure you want to cancel booking ${bookingRef}?`)) return;
    try {
      await fetch(`/api/bookings/${bookingRef}`, { method: 'DELETE' });
      setBookings(prev => prev.filter(b => b.bookingReference !== bookingRef));
    } catch (err) {
      setBookings(prev => prev.filter(b => b.bookingReference !== bookingRef));
    }
  };

  const handleSaveExpedition = async (e) => {
    e.preventDefault();
    const payload = {
      title: formTitle,
      location: formLocation,
      depth: formDepth,
      pricePerPerson: Number(formPrice),
      vessel: formVessel,
      image: formImage,
      zone: formZone,
      description: formDesc || "Deep oceanic submersible mission."
    };

    try {
      if (editingExpedition) {
        const res = await fetch(`/api/expeditions/${editingExpedition.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          setExpeditions(prev => prev.map(exp => exp.id === editingExpedition.id ? { ...exp, ...payload } : exp));
        }
      } else {
        const res = await fetch('/api/expeditions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success && data.data) {
          setExpeditions(prev => [data.data, ...prev]);
        }
      }
    } catch (err) {
      console.warn("Fallback local save", err);
      if (editingExpedition) {
        setExpeditions(prev => prev.map(exp => exp.id === editingExpedition.id ? { ...exp, ...payload } : exp));
      } else {
        setExpeditions(prev => [{ id: `exp-${Date.now()}`, ...payload, rating: 5.0, reviewsCount: 1 }, ...prev]);
      }
    } finally {
      setIsAddExpeditionOpen(false);
      setEditingExpedition(null);
      setFormTitle('');
      setFormLocation('');
      setFormDesc('');
    }
  };

  const handleDeleteExpedition = async (id) => {
    if (!confirm("Are you sure you want to remove this expedition from fleet roster?")) return;
    try {
      await fetch(`/api/expeditions/${id}`, { method: 'DELETE' });
      setExpeditions(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      setExpeditions(prev => prev.filter(e => e.id !== id));
    }
  };

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalDivers = bookings.reduce((sum, b) => sum + (b.diverCount || 1), 0);

  return (
    <div className={`min-h-screen pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 ${
      isLight ? 'text-slate-900' : 'text-white'
    }`}>
      
      {/* Header with Admin Badge & Controls */}
      <div className={`p-6 sm:p-8 rounded-3xl backdrop-blur-2xl border shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 slice-cutout-double ${
        isLight ? 'bg-white/90 border-sky-300 shadow-[0_15px_45px_rgba(14,165,233,0.18)]' : 'bg-slate-950/85 border-cyan-500/40 shadow-[0_15px_45px_rgba(0,0,0,0.8)]'
      }`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg">
            <Anchor className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-700 dark:text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider">
                Fleet Command HQ
              </span>
              <span className="text-xs text-slate-400 font-mono">Logged in as {currentUser?.name || 'Administrator'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display mt-0.5">
              Deep Sea Mission Admin Center
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            className="p-3 rounded-2xl border transition-all hover:scale-105 active:scale-95 bg-sky-50 dark:bg-slate-900 border-sky-200 dark:border-white/10"
            title="Refresh Fleet Data"
          >
            <RefreshCw className={`w-4 h-4 text-sky-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
          
          <button
            onClick={() => {
              setEditingExpedition(null);
              setFormTitle('');
              setFormLocation('');
              setFormPrice('12000');
              setIsAddExpeditionOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-400 to-teal-400 text-slate-950 font-bold font-display text-xs sm:text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Launch New Sea Adventure</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className={`p-5 rounded-3xl border ${isLight ? 'bg-white/80 border-sky-200 shadow-sm' : 'bg-slate-900/60 border-white/10'}`}>
          <div className="text-xs font-mono text-slate-400 uppercase">Gross Booking Volume</div>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-sky-600 mt-1">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-500 font-mono mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% telemetry cleared</span>
          </div>
        </div>

        <div className={`p-5 rounded-3xl border ${isLight ? 'bg-white/80 border-sky-200 shadow-sm' : 'bg-slate-900/60 border-white/10'}`}>
          <div className="text-xs font-mono text-slate-400 uppercase">Total Active Bookings</div>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-teal-600 mt-1">
            {bookings.length}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">Across 6 sub trenches</div>
        </div>

        <div className={`p-5 rounded-3xl border ${isLight ? 'bg-white/80 border-sky-200 shadow-sm' : 'bg-slate-900/60 border-white/10'}`}>
          <div className="text-xs font-mono text-slate-400 uppercase">Explorers Registered</div>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-indigo-600 mt-1">
            {totalDivers}
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">Certified for Hadal</div>
        </div>

        <div className={`p-5 rounded-3xl border ${isLight ? 'bg-white/80 border-sky-200 shadow-sm' : 'bg-slate-900/60 border-white/10'}`}>
          <div className="text-xs font-mono text-slate-400 uppercase">Active Fleet Roster</div>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-600 mt-1">
            {expeditions.length} Missions
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">All Submersibles Ready</div>
        </div>

      </div>

      {/* Tabs Switcher: Bookings Management vs Expeditions Inventory */}
      <div className="flex items-center gap-3 border-b border-sky-200 dark:border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'bookings'
              ? 'bg-sky-500 text-white shadow-md'
              : isLight ? 'bg-white text-slate-600 hover:bg-sky-50' : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          Diver Bookings & Clearances ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('expeditions')}
          className={`px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'expeditions'
              ? 'bg-sky-500 text-white shadow-md'
              : isLight ? 'bg-white text-slate-600 hover:bg-sky-50' : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          Manage Sea Expeditions Catalog ({expeditions.length})
        </button>
      </div>

      {/* 1. Bookings Management Table */}
      {activeTab === 'bookings' && (
        <div className={`rounded-3xl border overflow-hidden shadow-xl ${
          isLight ? 'bg-white border-sky-200' : 'bg-slate-950/80 border-white/10'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className={`border-b ${isLight ? 'bg-sky-50 text-sky-900 border-sky-200' : 'bg-slate-900 text-cyan-300 border-white/10'}`}>
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Explorer</th>
                  <th className="p-4">Expedition</th>
                  <th className="p-4">Date / Party</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100 dark:divide-white/5">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-400">No booking requests found.</td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b.bookingReference} className="hover:bg-sky-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-sky-600 dark:text-cyan-400">{b.bookingReference}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white font-sans">{b.customerName}</div>
                        <div className="text-slate-400 text-[10px]">{b.customerEmail}</div>
                      </td>
                      <td className="p-4 max-w-[200px] truncate font-semibold">{b.expeditionTitle}</td>
                      <td className="p-4">
                        <div>{b.diveDate}</div>
                        <div className="text-slate-400 text-[10px]">{b.diverCount} Diver(s)</div>
                      </td>
                      <td className="p-4 font-bold font-mono text-emerald-600">
                        ${(b.totalAmount || 0).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <select
                          value={b.status || 'Confirmed'}
                          onChange={(e) => handleUpdateBookingStatus(b.bookingReference, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase focus:outline-none cursor-pointer ${
                            b.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                              : b.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                              : 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300'
                          }`}
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="In Preparation">In Preparation</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteBooking(b.bookingReference)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                          title="Delete Booking Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Sea Expeditions Inventory Management */}
      {activeTab === 'expeditions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {expeditions.map((exp) => (
            <div
              key={exp.id}
              className={`rounded-3xl border overflow-hidden flex flex-col justify-between ${
                isLight ? 'bg-white border-sky-200 shadow-md' : 'bg-slate-900/80 border-white/10'
              }`}
            >
              <div className="relative h-48">
                <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 text-white text-xs font-mono font-bold">
                  {exp.depth}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-[10px] font-mono text-sky-600 font-bold uppercase">{exp.location}</div>
                  <h3 className="text-lg font-bold font-display mt-0.5">{exp.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{exp.description}</p>
                </div>

                <div className="pt-3 border-t border-sky-100 dark:border-white/10 flex items-center justify-between">
                  <div className="text-base font-extrabold font-mono text-sky-600">
                    ${exp.pricePerPerson.toLocaleString()}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingExpedition(exp);
                        setFormTitle(exp.title);
                        setFormLocation(exp.location);
                        setFormDepth(exp.depth);
                        setFormPrice(String(exp.pricePerPerson));
                        setFormVessel(exp.vessel);
                        setFormImage(exp.image);
                        setFormZone(exp.zone);
                        setFormDesc(exp.description);
                        setIsAddExpeditionOpen(true);
                      }}
                      className="p-2 rounded-xl bg-sky-50 dark:bg-white/5 text-sky-600 hover:scale-105 active:scale-95 transition-all"
                      title="Edit Adventure Details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteExpedition(exp.id)}
                      className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-500 hover:scale-105 active:scale-95 transition-all"
                      title="Delete Expedition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Expedition Modal */}
      {isAddExpeditionOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
          <div className={`relative w-full max-w-lg rounded-3xl border shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto ${
            isLight ? 'bg-white border-sky-300 text-slate-900' : 'bg-slate-900 border-cyan-400 text-white'
          }`}>
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-display font-bold text-lg">
                {editingExpedition ? "Edit Sea Adventure" : "Launch New Sea Adventure Mission"}
              </h3>
              <button onClick={() => setIsAddExpeditionOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpedition} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono font-bold uppercase mb-1">Adventure Title *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Kermadec Trench Megafauna Safari"
                  required
                  className="w-full p-2.5 rounded-xl border bg-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-bold uppercase mb-1">Location *</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. South Pacific Ocean"
                    required
                    className="w-full p-2.5 rounded-xl border bg-transparent"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold uppercase mb-1">Max Depth *</label>
                  <input
                    type="text"
                    value={formDepth}
                    onChange={(e) => setFormDepth(e.target.value)}
                    placeholder="e.g. 8,500 meters"
                    required
                    className="w-full p-2.5 rounded-xl border bg-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-bold uppercase mb-1">Price per Diver ($ USD) *</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border bg-transparent"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold uppercase mb-1">Submersible Vessel</label>
                  <input
                    type="text"
                    value={formVessel}
                    onChange={(e) => setFormVessel(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono font-bold uppercase mb-1">Adventure Photo URL</label>
                <input
                  type="url"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-transparent"
                />
              </div>

              <div>
                <label className="block font-mono font-bold uppercase mb-1">Mission Description</label>
                <textarea
                  rows="3"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Details of the descent, marine life, and telemetry..."
                  className="w-full p-2.5 rounded-xl border bg-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 text-slate-950 font-bold font-display shadow-md hover:scale-105 active:scale-95 transition-all mt-2"
              >
                {editingExpedition ? "Save Adventure Changes" : "Deploy Adventure to Catalog"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
