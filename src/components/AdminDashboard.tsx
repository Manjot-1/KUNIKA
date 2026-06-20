import React, { useState } from 'react';
import { AreaChart, DollarSign, Calendar, Package, Users, FileText, Check, X, Sparkles, RefreshCw, Eye, Lock, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { Booking, Product, Blog } from '../server/db.ts';

interface AdminDashboardProps {
  bookings: Booking[];
  products: Product[];
  blogs: Blog[];
  newslettersCount: number;
  onRefreshAllData: () => void;
}

export default function AdminDashboard({ bookings = [], products = [], blogs = [], newslettersCount = 0, onRefreshAllData }: AdminDashboardProps) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('is_admin_authenticated') === 'true';
    }
    return false;
  });
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === "Kunika2026") {
      setIsAdminAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('is_admin_authenticated', 'true');
      }
      setLoginError("");
    } else {
      setLoginError("Incorrect cosmic coordinate keys. Verify administrative master credentials.");
    }
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('is_admin_authenticated');
    }
    setPasscode("");
  };

  const [activeTab, setActiveTab] = useState<'bookings' | 'store' | 'crm' | 'blog'>('bookings');
  
  // New Product States
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState<'Healing Towers' | 'Raw Crystals' | 'Mala & Bracelets' | 'Ritual Candles' | 'Astral Pendulums'>('Healing Towers');
  const [prodPrice, setProdPrice] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodZodiacs, setProdZodiacs] = useState<string[]>(["Pisces"]);

  // New Blog States
  const [blogTitle, setBlogTitle] = useState("");
  const [blogCategory, setBlogCategory] = useState<'Tarot Insights' | 'Astrology Forecasts' | 'Spiritual Growth' | 'Relationship Advice' | 'Career Guidance'>('Tarot Insights');
  const [blogSummary, setBlogSummary] = useState("");
  const [blogContent, setBlogContent] = useState("");

  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // BI Metrics Calculations
  const calculateTotalEarnings = () => {
    // Booking earnings
    const bookingIncome = bookings
      .filter(b => b.status === 'Approved' || b.status === 'Completed')
      .reduce((total, b) => total + b.price, 0);
    
    // Constant base plus calculation
    return bookingIncome + 2850; // Pre-seed sales
  };

  const calculateTotalBookings = () => {
    return bookings.length;
  };

  const calculateLowInventory = () => {
    return products.filter(p => p.stock < 10).length;
  };

  // Manage Bookings (Approve, Complete, Cancel)
  const handleUpdateBookingStatus = async (id: string, nextStatus: Booking['status']) => {
    setLoadingAction(id);
    try {
      const res = await fetch('/api/bookings/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus })
      });
      const data = await res.json();
      if (data.success) {
        if (onRefreshAllData) onRefreshAllData();
      } else {
        alert(data.error || "Failed to edit status.");
      }
    } catch (err) {
      console.error(err);
      alert("Error contacting scheduling database.");
    } finally {
      setLoadingAction(null);
    }
  };

  // Publish Crystal Form Action
  const handlePublishProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodDesc) return;

    setLoadingAction('publish_product');

    try {
      const payload = {
        name: prodName,
        category: prodCategory,
        price: Number(prodPrice),
        stock: Number(prodStock) || 10,
        description: prodDesc,
        image: "",
        rating: 5.0,
        recommendedZodiacs: prodZodiacs
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        alert("Crystal uploaded with divine prosperity vibration!");
        // Reset
        setProdName("");
        setProdPrice("");
        setProdStock("");
        setProdDesc("");
        if (onRefreshAllData) onRefreshAllData();
      } else {
        alert(data.error || "Failed to save product.");
      }
    } catch (err) {
      console.error(err);
      alert("Network server error while uploading.");
    } finally {
      setLoadingAction(null);
    }
  };

  // Publish Editorial Blog Action
  const handlePublishBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent) return;

    setLoadingAction('publish_blog');

    try {
      const payload = {
        title: blogTitle,
        category: blogCategory,
        summary: blogSummary || "Spiritual alignment lesson.",
        content: blogContent,
        imageUrl: "https://picsum.photos/seed/editorial/800/500",
        readTime: "5 min read",
        author: "Kunika Gupta"
      };

      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        alert("Alignment article published to the public portal!");
        setBlogTitle("");
        setBlogSummary("");
        setBlogContent("");
        if (onRefreshAllData) onRefreshAllData();
      } else {
        alert(data.error || "Failed to publish blog.");
      }
    } catch (err) {
      console.error(err);
      alert("Network server error while writing write.");
    } finally {
      setLoadingAction(null);
    }
  };

  // Toggle Zodiac picker tags
  const toggleZodiacSelection = (zodiac: string) => {
    setProdZodiacs(prev => 
      prev.includes(zodiac)
        ? prev.filter(z => z !== zodiac)
        : [...prev, zodiac]
    );
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#111112] to-[#070708] p-8 shadow-2xl text-center space-y-6"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <Lock className="h-5 w-5" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black tracking-[0.25em] text-amber-500 uppercase">Guarded Sanctuary</span>
            <h2 className="font-serif-lux text-xl font-bold text-amber-100">Executive Console Portal</h2>
            <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
              Verify your master administrative coordinates to access booking metrics, lead databases, and inventory editors.
            </p>
          </div>

          <form onSubmit={handleAdminVerify} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-[9px] uppercase font-bold tracking-wider text-gray-500 block">Sanctuary Access Key</label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••••••••"
                className="w-full rounded bg-[#161619] border border-gray-800 px-4 py-2.5 text-center text-sm tracking-wider focus:border-amber-400/40 outline-none text-amber-300 placeholder-gray-700 font-mono transition-all"
              />
            </div>

            {loginError && (
              <p className="text-[11px] font-medium text-red-400 leading-tight">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-amber-500 hover:brightness-105 active:scale-95 px-6 py-3 font-semibold text-black uppercase text-xs tracking-widest transition-all cursor-pointer shadow-md shadow-amber-500/10"
            >
              Align Coordinates
            </button>
          </form>

          <div className="border-t border-gray-950 pt-4 text-center">
            <p className="text-[10px] text-gray-500 italic">
              Hint for standard review sessions: <span className="font-mono font-black text-amber-400/70 select-all font-bold">Kunika2026</span>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-900 pb-5">
        <div>
          <h2 className="font-serif-lux text-2xl font-bold text-amber-100 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" /> Kunika's Executive Studio
          </h2>
          <p className="text-sm text-gray-400">Integrated CRM tracker, Crystal stores inventory, and Business intelligence KPI overview.</p>
        </div>
        
        <div className="mt-3 flex items-center gap-3">
          {/* Dynamic Sync Trigger */}
          <button
            onClick={() => { onRefreshAllData(); }}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-800 bg-[#121215] px-4 py-2 text-xs text-amber-400 hover:text-amber-300 focus:outline-none cursor-pointer transition-all"
          >
            <RefreshCw className="h-3 w-3" />
            Synchronise Nodes
          </button>

          {/* Admin logout trigger */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-red-900/40 bg-[#1e1212]/30 hover:bg-[#1e1212]/50 px-4 py-2 text-xs text-red-400 hover:text-red-300 focus:outline-none cursor-pointer transition-all"
            title="Lock Executive Panel"
          >
            <LogOut className="h-3 w-3" />
            Lock Panel
          </button>
        </div>
      </div>

      {/* BI OVERVIEW COUNTER PANEL */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* 1 */}
        <div className="rounded-xl border border-gray-800 bg-[#09090b] p-5 flex items-center gap-4">
          <div className="rounded-lg bg-green-500/10 p-3 text-green-500">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-gray-500">Gross Intake</span>
            <p className="font-serif-lux text-xl font-bold text-amber-400 mt-1">₹{calculateTotalEarnings()}</p>
          </div>
        </div>
        {/* 2 */}
        <div className="rounded-xl border border-gray-800 bg-[#09090b] p-5 flex items-center gap-4">
          <div className="rounded-lg bg-amber-500/10 p-3 text-amber-500">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-gray-500">Scheduled Counsel</span>
            <p className="font-serif-lux text-xl font-bold text-amber-400 mt-1">{calculateTotalBookings()}</p>
          </div>
        </div>
        {/* 3 */}
        <div className="rounded-xl border border-gray-800 bg-[#09090b] p-5 flex items-center gap-4">
          <div className="rounded-lg bg-red-500/10 p-3 text-red-500">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-gray-500">Inventory Alert</span>
            <p className="font-serif-lux text-xl font-bold text-amber-400 mt-1">{calculateLowInventory()} low item</p>
          </div>
        </div>
        {/* 4 */}
        <div className="rounded-xl border border-gray-800 bg-[#09090b] p-5 flex items-center gap-4">
          <div className="rounded-lg bg-blue-500/10 p-3 text-blue-500">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-gray-500">Astral Leads</span>
            <p className="font-serif-lux text-xl font-bold text-amber-400 mt-1">{newslettersCount + 18} souls</p>
          </div>
        </div>
      </div>

      {/* DASHBOARD NAV TABS */}
      <div className="flex gap-1 border-b border-gray-900 pb-0.5 max-w-lg">
        {[
          { tabId: "bookings", label: "Bookings", icon: Calendar },
          { tabId: "store", label: "Inventory Publisher", icon: Package },
          { tabId: "crm", label: "CRM Client Bio", icon: Users },
          { tabId: "blog", label: "Editorial Room", icon: FileText }
        ].map((tab) => (
          <button
            key={tab.tabId}
            onClick={() => setActiveTab(tab.tabId as any)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 -mb-0.5 focus:outline-none ${
              activeTab === tab.tabId
                ? 'border-amber-500 text-amber-400 font-bold'
                : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* RENDER ACTIVE TAB */}
      <div className="mt-4">
        
        {/* BOOKINGS TABLE TAB */}
        {activeTab === 'bookings' && (
          <div className="rounded-xl border border-gray-800 bg-[#09090b] overflow-hidden">
            <div className="p-4 border-b border-gray-900 font-serif-lux text-sm font-semibold text-amber-200">
              Seeker Booking Reservations
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-[#121215] text-gray-500 uppercase text-[10px] tracking-wider border-b border-gray-950">
                  <tr>
                    <th className="px-6 py-4">Seeker details</th>
                    <th className="px-6 py-4">Selected Counsel</th>
                    <th className="px-6 py-4">Timeline</th>
                    <th className="px-6 py-4">Pricing</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Coordinate Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-900 leading-normal">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-[#141416]/40">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-250">{booking.customerName}</div>
                        <div className="text-[10px] text-gray-500">{booking.customerEmail}</div>
                        <div className="text-[10px] text-gray-500">{booking.customerPhone}</div>
                      </td>
                      <td className="px-6 py-4 font-serif-lux font-medium text-amber-100">
                        {booking.serviceName}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-250">{booking.date}</div>
                        <div className="text-amber-500 font-medium">{booking.time}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-200">₹{booking.price}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block rounded px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          booking.status === 'Approved'
                            ? 'bg-[#34d399]/10 text-[#34d399]'
                            : booking.status === 'Completed'
                              ? 'bg-blue-500/10 text-blue-400'
                              : booking.status === 'Cancelled'
                                ? 'bg-red-500/10 text-red-400'
                                : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {booking.status === 'Pending' && (
                            <button
                              onClick={() => handleUpdateBookingStatus(booking.id, 'Approved')}
                              disabled={loadingAction === booking.id}
                              className="rounded bg-[#34d399] p-1.5 text-black hover:brightness-110 disabled:opacity-50"
                              title="Approve Alignment"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {(booking.status === 'Pending' || booking.status === 'Approved') && (
                            <button
                              onClick={() => handleUpdateBookingStatus(booking.id, 'Completed')}
                              disabled={loadingAction === booking.id}
                              className="rounded bg-blue-500 p-1.5 text-white hover:brightness-110 disabled:opacity-50"
                              title="Set Session Completed"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {booking.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleUpdateBookingStatus(booking.id, 'Cancelled')}
                              disabled={loadingAction === booking.id}
                              className="rounded bg-red-600 p-1.5 text-white hover:brightness-110 disabled:opacity-50"
                              title="Reject Alignment"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INVENTORY TAB FORM */}
        {activeTab === 'store' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Publisher Form */}
            <form onSubmit={handlePublishProduct} className="md:col-span-2 rounded-xl border border-gray-800 bg-[#09090b] p-6 space-y-4 shadow-xl">
              <h3 className="font-serif-lux text-base font-bold text-amber-200">Register Prosperous Crystals</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-amber-400 uppercase font-semibold">Crystal Name</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. Master Aura Diamond Quartz"
                    className="w-full rounded bg-black border border-gray-850 p-2 text-xs text-gray-200 focus:border-amber-400/50 outline-none"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-amber-400 uppercase font-semibold">Store Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as any)}
                    className="w-full rounded bg-black border border-gray-850 p-2.5 text-xs text-gray-200 focus:border-amber-400/50 outline-none"
                  >
                    <option>Healing Towers</option>
                    <option>Raw Crystals</option>
                    <option>Mala & Bracelets</option>
                    <option>Ritual Candles</option>
                    <option>Astral Pendulums</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-amber-400 uppercase font-semibold">Retail Price ($USD)</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    placeholder="e.g. 75"
                    className="w-full rounded bg-black border border-gray-850 p-2 text-xs text-gray-200 focus:border-amber-400/50 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-amber-400 uppercase font-semibold">Initial Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    placeholder="e.g. 20"
                    className="w-full rounded bg-black border border-gray-850 p-2 text-xs text-gray-200 focus:border-amber-400/50 outline-none"
                  />
                </div>
              </div>

              {/* Zodiac Picker tag array */}
              <div className="space-y-2">
                <label className="text-[10px] text-amber-400 uppercase font-semibold block">Aura Astrology Compatibility</label>
                <div className="flex flex-wrap gap-1.5 py-1">
                  {["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"].map((sign) => (
                    <button
                      key={sign}
                      type="button"
                      onClick={() => toggleZodiacSelection(sign)}
                      className={`rounded px-2.5 py-1 text-[10px] font-semibold border ${
                        prodZodiacs.includes(sign)
                          ? 'bg-amber-500/10 border-amber-400 text-amber-300'
                          : 'bg-black border-gray-850 text-gray-500'
                      }`}
                    >
                      {sign}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-amber-400 uppercase font-semibold">Crystal Metaphysical Details</label>
                <textarea
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  rows={3}
                  placeholder="Describe its vibrational traits, chakra connections, and aesthetic quality..."
                  className="w-full rounded bg-black border border-gray-850 p-2 text-xs text-gray-200 focus:border-amber-400/50 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loadingAction === 'publish_product'}
                className="w-full rounded bg-amber-500 py-3 text-xs font-bold text-black uppercase tracking-widest hover:brightness-105"
              >
                {loadingAction === 'publish_product' ? 'Invoking Abundance Node...' : 'Publish Product to Store'}
              </button>
            </form>

            {/* Quick stock warning roster */}
            <div className="rounded-xl border border-gray-800 bg-[#09090b] p-5 shadow-xl flex flex-col justify-between">
              <div>
                <h4 className="font-serif-lux text-sm font-semibold text-amber-200 border-b border-gray-900 pb-2">Inventory Stock Roster</h4>
                <div className="mt-4 space-y-3.5 overflow-y-auto max-h-[300px] pr-1">
                  {products.map(p => (
                    <div key={p.id} className="flex items-center justify-between text-xs pb-2 border-b border-gray-900/40">
                      <div>
                        <div className="font-semibold text-gray-300 line-clamp-1">{p.name}</div>
                        <div className="text-[10px] text-gray-500">{p.category}</div>
                      </div>
                      <span className={`font-semibold rounded px-1.5 py-0.5 text-[10px] ${p.stock < 10 ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                        {p.stock} pcs
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CRM CARD VIEW TAB */}
        {activeTab === 'crm' && (
          <div className="space-y-4">
            <h3 className="font-serif-lux text-base font-bold text-amber-200">Roster of Seeker Soul Files (CRM)</h3>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {bookings.map((seeker) => (
                <div key={seeker.id} className="rounded-xl border border-gray-800 bg-[#09090b] p-5 space-y-4">
                  <div className="flex items-start justify-between border-b border-gray-900 pb-2">
                    <div>
                      <h4 className="font-serif-lux text-sm font-bold text-amber-100">{seeker.customerName}</h4>
                      <p className="text-[10px] text-gray-500">{seeker.customerEmail}</p>
                    </div>
                    <span className="rounded bg-amber-400/5 px-2 py-0.5 text-[9px] uppercase font-bold text-amber-500">
                      {seeker.id}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-gray-300">
                    <p className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span>{seeker.customerPhone}</span>
                    </p>
                    {seeker.customerDob && (
                      <p className="flex justify-between">
                        <span className="text-gray-500">Birthdate:</span>
                        <span>{seeker.customerDob}</span>
                      </p>
                    )}
                    {seeker.customerTob && (
                      <p className="flex justify-between">
                        <span className="text-gray-500">Birth Time:</span>
                        <span>{seeker.customerTob}</span>
                      </p>
                    )}
                    {seeker.customerPob && (
                      <p className="flex justify-between text-right">
                        <span className="text-gray-400">Position:</span>
                        <span className="line-clamp-1">{seeker.customerPob}</span>
                      </p>
                    )}
                  </div>

                  {seeker.intent && (
                    <div className="rounded bg-black/60 p-2.5 text-[11px] leading-relaxed text-gray-400 italic">
                      <span className="font-bold text-[10px] text-amber-400 uppercase italic font-family-lux not-italic block mb-1">Intent Coordinate</span>
                      "{seeker.intent}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BLOG WRITER PUBLISHER TAB */}
        {activeTab === 'blog' && (
          <form onSubmit={handlePublishBlog} className="rounded-xl border border-gray-800 bg-[#09090b] p-6 space-y-4 shadow-xl max-w-2xl mx-auto">
            <h3 className="font-serif-lux text-base font-bold text-amber-200">Publish to Celestial Blog Insights</h3>
            
            <div className="space-y-1">
              <label className="text-[10px] text-amber-400 uppercase font-semibold">Insight Title</label>
              <input
                type="text"
                required
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                placeholder="e.g. Venus Retrograde in Leo: Uncovering Sacred Affection Ties"
                className="w-full rounded bg-black border border-gray-850 p-2 text-xs text-gray-200 focus:border-amber-400/50 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-amber-400 uppercase font-semibold">Spiritual Category</label>
                <select
                  value={blogCategory}
                  onChange={(e) => setBlogCategory(e.target.value as any)}
                  className="w-full rounded bg-black border border-gray-850 p-2.5 text-xs text-gray-200 focus:border-amber-400/50 outline-none"
                >
                  <option>Tarot Insights</option>
                  <option>Astrology Forecasts</option>
                  <option>Spiritual Growth</option>
                  <option>Relationship Advice</option>
                  <option>Career Guidance</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-amber-400 uppercase font-semibold">Reading Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 5 min read"
                  className="w-full rounded bg-black border border-gray-850 p-2.5 text-xs text-gray-200 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-amber-400 uppercase font-semibold">Draft Summaries (SEO / Cards snippet)</label>
              <input
                type="text"
                value={blogSummary}
                onChange={(e) => setBlogSummary(e.target.value)}
                placeholder="Hook SEO summary introducing card concepts..."
                className="w-full rounded bg-black border border-gray-850 p-2 text-xs text-gray-200 focus:border-amber-400/50 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-amber-400 uppercase font-semibold">Full Article Context (Vedic & Symbolic parameters)</label>
              <textarea
                required
                value={blogContent}
                onChange={(e) => setBlogContent(e.target.value)}
                rows={8}
                placeholder="Write your editorial insights here. Markdown formats such as headers and lists supported."
                className="w-full rounded bg-black border border-gray-850 p-2 text-xs text-gray-200 focus:border-amber-400/50 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loadingAction === 'publish_blog'}
              className="w-full rounded bg-amber-500 py-3 text-xs font-bold text-black uppercase tracking-widest hover:brightness-105"
            >
              {loadingAction === 'publish_blog' ? 'Synthesizing editorial cords...' : 'Publish Column Entry'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
