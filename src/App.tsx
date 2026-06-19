import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, ShoppingCart, Users, FileText, Mail, Phone, Moon, Sun, Compass, Menu, X, Star, Heart, MessageSquare, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Subcomponents
import TarotOracle from './components/TarotOracle.tsx';
import BookingSystem, { AVAILABLE_SERVICES } from './components/BookingSystem.tsx';
import CrystalStore, { Product } from './components/CrystalStore.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import { AboutPage, TestimonialsPage, BlogPage, ResourcesPage, ContactPage } from './components/Pages.tsx';

// Static assets generated via image-generation tool
import profileImg from './assets/images/kunika_profile_1781863729813.jpg';
import heroBgImg from './assets/images/mystical_hero_bg_1781863745548.jpg';
import crystalImg from './assets/images/store_crystal_quartz_1781863762484.jpg';

export default function App() {
  const [activePage, setActivePage] = useState<string>("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  // Global fetched lists
  const [bookings, setBookings] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newslettersCount, setNewslettersCount] = useState(0);

  // Cart & Wishlist persistence
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Preselected Booking states
  const [preselectedSrv, setPreselectedSrv] = useState<string | undefined>(undefined);

  // Floating Chatbot State
  const [isFloatChatOpen, setIsFloatChatOpen] = useState(false);

  // Hero section loading states for premium visual experience
  const [isHeroLoading, setIsHeroLoading] = useState(true);
  const [heroLoadingStep, setHeroLoadingStep] = useState(0);

  // Services section loading state
  const [isServicesLoading, setIsServicesLoading] = useState(false);

  useEffect(() => {
    if (activePage === "home") {
      setIsHeroLoading(true);
      setHeroLoadingStep(0);
      const t1 = setTimeout(() => setHeroLoadingStep(1), 500);
      const t2 = setTimeout(() => setHeroLoadingStep(2), 1000);
      const t3 = setTimeout(() => setIsHeroLoading(false), 1500);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else if (activePage === "services") {
      setIsServicesLoading(true);
      const timer = setTimeout(() => {
        setIsServicesLoading(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [activePage]);

  // Dynamic Client-side SEO update for pristine in-app experience
  useEffect(() => {
    let title = "Kunika Gupta — Premium Spiritual Consultant & Crystal Store";
    let desc = "Step into a sacred space of cosmic guidance, astrological alignment, custom tarot reading, and high-frequency healing crystals curated by Kunika.";
    let pageKey = "home";

    switch (activePage) {
      case "services":
        title = "Spiritual Consultations & Astrology Services — Kunika Gupta";
        desc = "Explore a sanctuary of personalized Tarot card reading, astrology forecasting, crystal guidance, and divine alignment consultations.";
        pageKey = "services";
        break;
      case "store":
        title = "Celestial Crystals & Sacred Store — Kunika Gupta";
        desc = "Sustain your vibration. Acquire certified celestial crystals, charged spiritual jewelry, and premium energetic tools curated for ascension.";
        pageKey = "store";
        break;
      case "testimonials":
        title = "Seekers' Success & Testimonials — Kunika Gupta";
        desc = "Read divine testimonials from seekers around the globe whose paths have been illuminated by Kunika's spiritual consultancy.";
        pageKey = "testimonials";
        break;
      case "about":
        title = "Meet Kunika Gupta — Premium Spiritual Consultant";
        desc = "Learn about Kunika's spiritual path, sacred masteries, and her mission to hold space as an intuitive guide for seekers entering ascension.";
        pageKey = "about";
        break;
      case "oracle":
        title = "Ascended Oracle AI — Guided Cosmic Chat";
        desc = "Engage with our Ascended Oracle. Ask questions about your astrological alignments, tarot insights, or crystal curation needs.";
        pageKey = "oracle";
        break;
      case "blog":
        title = "Celestial Insights & Spiritual Blog — Kunika Gupta";
        desc = "Peruse celestial articles, moon cycles forecasting, astrological updates, and step-by-step masterclasses on keeping high vibrations.";
        pageKey = "blog";
        break;
      case "resources":
        title = "Divine Ascension Resources & Tools — Kunika Gupta";
        desc = "Download complimentary sacred templates, crystal alignment guides, daily spiritual organizers, and planetary tracking lists.";
        pageKey = "resources";
        break;
      case "contact":
        title = "Connect in Sacred Light — Contact Kunika Gupta";
        desc = "Schedule your next divine session, send inquiries, or join our community of celestial searchers with Kunika today.";
        pageKey = "contact";
        break;
      case "admin":
        title = "Oracle Sanctuary Administration Portal";
        desc = "Administrative panel for booking management, blog postings, and crystal sanctuary cataloguing.";
        pageKey = "admin";
        break;
    }

    document.title = title;

    // Helper functions to safely update or create meta tags
    const updateOrCreateMeta = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateOrCreateMeta('name', 'description', desc);
    updateOrCreateMeta('property', 'og:title', title);
    updateOrCreateMeta('property', 'og:description', desc);
    
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    if (origin) {
      updateOrCreateMeta('property', 'og:image', `${origin}/api/og?page=${pageKey}`);
      updateOrCreateMeta('name', 'twitter:image', `${origin}/api/og?page=${pageKey}`);
    }
    updateOrCreateMeta('name', 'twitter:title', title);
    updateOrCreateMeta('name', 'twitter:description', desc);
  }, [activePage]);

  // Initial Sync fetching handler
  const refreshAllData = async () => {
    try {
      // 1. Bookings
      const bookRes = await fetch('/api/bookings');
      if (bookRes.ok) {
        const data = await bookRes.json();
        setBookings(data);
      }

      // 2. Products
      const prodRes = await fetch('/api/products');
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        // Override the seed quartz crystal image with our gorgeous generated asset
        const enriched = prodData.map((p: any) => p.id === 'p-1' ? { ...p, image: crystalImg } : p);
        setProducts(enriched);
      }

      // 3. Blogs
      const blogRes = await fetch('/api/blogs');
      if (blogRes.ok) {
        setBlogs(await blogRes.json());
      }

      // 4. Testimonials
      const revRes = await fetch('/api/reviews');
      if (revRes.ok) {
        setReviews(await revRes.json());
      }
    } catch (err) {
      console.error("Critical full-stack initial database synchronisation warning:", err);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Submit Review proxy
  const handleAddNewReview = async (newReview: any) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      const data = await res.json();
      if (data.success) {
        refreshAllData();
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Submit Newsletter Signup proxy
  const handleNewsletterSignup = async (email: string) => {
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setNewslettersCount(prev => prev + 1);
        alert(data.message);
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  // Trigger Booking wizard from standard links
  const handleRouteToBooking = (serviceId?: string) => {
    setPreselectedSrv(serviceId);
    setActivePage("booking");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#060608] text-gray-200 font-sans antialiased flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      
      {/* 1. STICKY CELESTIAL HEADER */}
      <header className="sticky top-0 z-40 border-b border-amber-500/10 bg-[#060608]/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo initials */}
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActivePage("home")}>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-500/30 bg-[#121215] text-amber-400">
                <span className="font-serif-lux font-bold text-sm tracking-widest">K</span>
              </div>
              <div>
                <span className="font-serif-lux text-base font-bold tracking-widest text-amber-200">KUNIKA GUPTA</span>
                <span className="block text-[8px] tracking-widest text-amber-500/80 font-serif-lux">ASTRAL SYNC</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-widest font-semibold text-gray-400">
              {[
                { name: "Home", tab: "home" },
                { name: "Services", tab: "services" },
                { name: "Crystal Store", tab: "store" },
                { name: "Testimonials", tab: "testimonials" },
                { name: "About", tab: "about" },
                { name: "Oracle Chat", tab: "oracle" },
                { name: "Blog", tab: "blog" },
                { name: "Resources", tab: "resources" },
                { name: "Contact", tab: "contact" }
              ].map((link) => (
                <button
                  key={link.tab}
                  onClick={() => { setActivePage(link.tab); setIsMobileMenuOpen(false); }}
                  className={`transition-colors hover:text-amber-400 focus:outline-none ${
                    activePage === link.tab ? 'text-amber-400 font-bold' : ''
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* Admin trigger button client */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
                className="flex items-center justify-center px-3.5 py-2.5 rounded-xl border border-amber-500/30 bg-[#121215] text-amber-400 hover:bg-amber-500 hover:text-[#060608] transition-all cursor-pointer"
                title={`Switch to ${theme === 'light' ? 'Mystic Dark' : 'Serene Light'} Theme`}
                id="desktop-theme-toggle"
              >
                {theme === 'light' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                <span className="ml-2 text-[10px] font-bold uppercase tracking-widest">
                  {theme === 'light' ? 'Mystic Dark' : 'Serene Light'}
                </span>
              </button>
              <button
                onClick={() => setActivePage("admin")}
                className="rounded-xl border border-amber-500/30 bg-[#121215] px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-amber-400 hover:bg-amber-500 hover:text-[#060608] transition-all"
                id="header-admin-portal-link"
              >
                Admin Panel
              </button>
            </div>

            {/* Mobile Menu & Theme Trigger */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
                className="flex items-center justify-center p-2.5 rounded-xl border border-amber-500/30 bg-[#121215] text-amber-400 focus:outline-none"
                title={`Switch to ${theme === 'light' ? 'Mystic Dark' : 'Serene Light'} Theme`}
                id="mobile-theme-toggle"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-xl border border-gray-800 p-2 text-gray-400 hover:text-white focus:outline-none"
                id="mobile-menu-trigger-btn"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown slider */}
        {isMobileMenuOpen && (
          <div className="border-t border-gray-950 bg-[#09090b] px-4 py-4 md:hidden animate-fade-in">
            <div className="flex flex-col gap-3 text-xs uppercase tracking-widest font-semibold text-gray-400">
              {[
                { name: "Home", tab: "home" },
                { name: "Services", tab: "services" },
                { name: "Crystal Store", tab: "store" },
                { name: "Testimonials", tab: "testimonials" },
                { name: "About", tab: "about" },
                { name: "Oracle Chat", tab: "oracle" },
                { name: "Blog", tab: "blog" },
                { name: "Resources", tab: "resources" },
                { name: "Contact", tab: "contact" },
                { name: "Admin Dashboard", tab: "admin" }
              ].map((link) => (
                <button
                  key={link.tab}
                  onClick={() => { setActivePage(link.tab); setIsMobileMenuOpen(false); }}
                  className={`text-left py-2 border-b border-gray-900 pb-2 focus:outline-none ${
                    activePage === link.tab ? 'text-amber-400 font-bold' : ''
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* 2. CORE VIEW AREA CONTAINER */}
      <main className="flex-grow mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        
        {/* VIEW: HOME */}
        {activePage === "home" && (
          <div className="space-y-20 animate-fade-in">
            
            {/* HERO MODULE */}
            <section className="relative rounded-3xl border border-amber-500/10 overflow-hidden bg-[#09090C] py-16 px-6 md:py-24 md:px-12 shadow-2xl min-h-[460px] flex items-center justify-center">
              {/* Cinematic Constellation Background generation */}
              <div className="absolute inset-0 -z-10 opacity-30">
                <img 
                  src={heroBgImg} 
                  alt="Cosmic Backdrop" 
                  className="h-full w-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[#09090C]/80 to-[#060608]/40 -z-10" />

              <AnimatePresence mode="wait">
                {isHeroLoading ? (
                  <motion.div
                    key="hero-alignment-loader"
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="mx-auto max-w-3xl text-center space-y-8 flex flex-col items-center justify-center w-full py-4"
                  >
                    {/* Pulsing concentric sacred geometric loaders */}
                    <div className="relative flex items-center justify-center h-44 w-44">
                      {/* Outer star dust particle container text */}
                      <span className="absolute text-[8px] tracking-[0.3em] text-amber-500/20 font-serif-lux uppercase animate-pulse">ASTRO</span>
                      
                      {/* Outer dashed compass circle */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                        className="absolute h-36 w-36 rounded-full border border-dashed border-amber-500/25"
                      />
                      {/* Middle delicate circle with cardinal notches */}
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                        className="absolute h-28 w-28 rounded-full border border-double border-amber-400/20"
                      />
                      {/* Inner glowing orbit element */}
                      <motion.div
                        animate={{ rotate: 180 }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="absolute h-20 w-20 rounded-full border border-amber-500/10 flex items-center justify-center"
                      >
                        <Compass className="h-10 w-10 text-amber-400/50" />
                      </motion.div>
                      
                      {/* Shining center core */}
                      <motion.div
                        animate={{ 
                          scale: [1, 1.25, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                        className="absolute"
                      >
                        <Sparkles className="h-8 w-8 text-amber-400 filter drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
                      </motion.div>
                    </div>

                    {/* Step indicator texts with staggered subtle transitions */}
                    <div className="space-y-3 w-full">
                      <div className="h-6 overflow-hidden relative">
                        <AnimatePresence mode="popLayout">
                          <motion.p
                            key={heroLoadingStep}
                            initial={{ y: 15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -15, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="font-serif-lux text-[10px] font-bold tracking-[0.3em] text-amber-500 uppercase h-full"
                          >
                            {heroLoadingStep === 0 && "✧ SYNCING CONSTELLATION MATRICES ✧"}
                            {heroLoadingStep === 1 && "✧ CHANNELING CELESTIAL PORTALS ✧"}
                            {heroLoadingStep === 2 && "✧ UNLOCKING SPIRITUAL ABUNDANCE ✧"}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                      
                      {/* Subtle elegant luxury bar indicator */}
                      <div className="w-48 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mx-auto relative overflow-hidden rounded-full">
                        <motion.div
                          className="absolute h-full bg-gradient-to-r from-transparent via-amber-400 to-transparent w-16"
                          animate={{ left: ["-33%", "100%"] }}
                          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="hero-content"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mx-auto max-w-3xl text-center space-y-6 w-full"
                  >
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-[#121215]/80 px-3 py-1 text-[10px] tracking-widest uppercase font-bold text-amber-400">
                      <Moon className="h-3 w-3 animate-spin [animation-duration:8s]" /> Pure Cosmic Alignment Unlocked
                    </div>

                    <h1 className="font-serif-lux text-3.5xl font-extrabold tracking-wider text-amber-100 sm:text-4xl md:text-5xl leading-tight">
                      Gain Clarity.<br />
                      Make Better Decisions.<br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Transform Your Life.</span>
                    </h1>

                    <p className="mx-auto max-w-xl text-xs sm:text-sm leading-relaxed text-gray-400 py-2 font-light">
                      Professional Vedic Astrological alignment and intuitive Tarot consultations mapping career pathways, emotional trauma reconciliations, and spiritual abundance.
                    </p>

                    {/* CTA Links */}
                    <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3">
                      <button
                        onClick={() => handleRouteToBooking()}
                        className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3.5 text-xs uppercase tracking-widest font-black text-black hover:brightness-105 shadow-[0_4px_15px_rgba(212,175,55,0.3)] cursor-pointer"
                        id="hero-book-cta"
                      >
                        Book Consultation
                      </button>
                      <a
                        href="https://wa.me/919123456789?text=Greetings%20Kunika.%20I%20am%20seeking%20spiritual%23counseling."
                        target="_blank"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-800 bg-[#121215]/80 px-6 py-3.5 text-xs uppercase tracking-widest font-bold text-gray-300 hover:border-amber-400/40 cursor-pointer"
                        id="hero-wa-cta"
                      >
                        <MessageSquare className="h-4 w-4 text-[#25d366]" />
                        Talk on WhatsApp
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* TRUST INDICATORS BAR */}
            <section className="grid grid-cols-2 gap-4 md:grid-cols-4 md:items-stretch" id="trustbar-module">
              {[
                { label: "Consultations Completed", val: "12,000+", desc: "Globally registered sessions" },
                { label: "Verified Client Reviews", val: "5 ★ Stars", desc: "Aura-centered feedback logs" },
                { label: "Professional Credentials", val: "Certified", desc: "Monastic & academic legacy" },
                { label: "Consultation Form", val: "100% Secure", desc: "Absolute practitioner privacy" }
              ].map((t, idx) => (
                <div key={idx} className="rounded-2xl border border-gray-900 bg-[#09090b] p-5 text-center flex flex-col justify-between">
                  <div>
                    <span className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider block">{t.label}</span>
                    <span className="font-serif-lux text-xl font-bold text-amber-400 mt-2 block">{t.val}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">{t.desc}</p>
                </div>
              ))}
            </section>

            {/* EXTRA FEATURE: QUICK EMBED DECK ORACLE */}
            <section className="space-y-6">
              <div className="text-center">
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">✧ Interactive Portal ✧</span>
                <h3 className="font-serif-lux mt-1 text-xl font-bold tracking-wider text-amber-200">Daily Tarot Shuffler</h3>
              </div>
              <TarotOracle />
            </section>

          </div>
        )}

        {/* VIEW: SERVICES & BOOKINGS LISTINGS */}
        {activePage === "services" && (
          <div className="space-y-12">
            <div className="text-center space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">✧ Specialized Formats ✧</span>
              <h2 className="font-serif-lux text-2xl font-bold tracking-brand text-amber-100 md:text-3xl">Counsel Formats & Fees</h2>
              <p className="mx-auto max-w-lg text-xs text-gray-400 leading-relaxed font-light">
                Secure one-on-one virtual or in-person sessions using Vedic birth charts and astrological arrays. Select a layout formats to book.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {isServicesLoading ? (
                <motion.div
                  key="services-sacred-loader"
                  initial={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="flex flex-col items-center justify-center py-20 min-h-[300px] text-center space-y-6"
                >
                  <div className="relative flex items-center justify-center w-40 h-44">
                    {/* Pulsing sacred geometry background rings */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.15, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                      className="absolute w-36 h-36 rounded-full border border-amber-500/20"
                    />
                    
                    {/* Fully interactive gold-colored sacred geometry shape */}
                    <motion.svg 
                      className="w-32 h-32 text-amber-500/80 filter drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" 
                      viewBox="0 0 100 100" 
                      fill="none"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                    >
                      {/* Outer boundary circle with dashing */}
                      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                      <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="0.5" />
                      
                      {/* Triangulated vector network matrix representing sacred geometry */}
                      {/* Triangle facing up */}
                      <motion.polygon 
                        points="50,16 80,68 20,68" 
                        stroke="currentColor" 
                        strokeWidth="1"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      />
                      {/* Triangle facing down */}
                      <motion.polygon 
                        points="50,84 80,32 20,32" 
                        stroke="currentColor" 
                        strokeWidth="1"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 1 }}
                      />
                      
                      {/* Concentric internal circles */}
                      <circle cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="0.75" />
                      <circle cx="50" cy="50" r="14" stroke="currentColor" strokeWidth="1.5" />
                      
                      {/* Star of David axis alignments */}
                      <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                      <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                      <line x1="21.7" y1="21.7" x2="78.3" y2="78.3" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                      <line x1="21.7" y1="78.3" x2="78.3" y2="21.7" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                    </motion.svg>
                  </div>

                  <div className="space-y-2">
                    <p className="font-serif-lux text-xs tracking-[0.2em] uppercase font-bold text-amber-400">✧ Channeling Astral Pathways ✧</p>
                    <p className="text-[11px] text-gray-500 font-light uppercase tracking-widest animate-pulse">Consulting Vedic alignment guides...</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="services-grid"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3"
                >
                  {AVAILABLE_SERVICES.map((srv) => (
                    <div 
                      key={srv.id}
                      className="rounded-xl border border-gray-850 bg-[#09090b] p-5 flex flex-col justify-between group hover:border-amber-400/30 transition-all shadow-md"
                    >
                      <div className="space-y-3">
                        <span className="rounded bg-amber-400/10 px-2 py-0.5 text-[9px] font-bold text-amber-400 uppercase tracking-widest">
                          {srv.category}
                        </span>
                        <h3 className="font-serif-lux text-base font-bold text-amber-200 group-hover:text-amber-300 transition-colors">
                          {srv.name}
                        </h3>
                        <p className="text-xs leading-normal text-gray-400 line-clamp-3 font-light">
                          {srv.shortDesc}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-gray-900 pt-4 flex items-center justify-between">
                        <div className="text-xs">
                          <span className="text-gray-500">Fee Paid:</span>
                          <p className="font-serif-lux text-base font-bold text-amber-400">${srv.price}</p>
                        </div>
                        <button
                          onClick={() => handleRouteToBooking(srv.id)}
                          className="rounded-lg bg-[#141417] hover:bg-amber-500 hover:text-black border border-amber-500/20 text-xs font-bold text-amber-400 px-3.5 py-2 transition-all cursor-pointer"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* VIEW: INTERACTIVE STEPS SCHEDULER WIZARD */}
        {activePage === "booking" && (
          <div className="animate-fade-in">
            <BookingSystem 
              preselectedServiceId={preselectedSrv} 
              onSuccess={() => { setPreselectedSrv(undefined); refreshAllData(); }}
            />
          </div>
        )}

        {/* VIEW: CRYSTALS e-COMMERCE STORE */}
        {activePage === "store" && (
          <div className="animate-fade-in">
            <CrystalStore 
              products={products}
              onRefreshProducts={refreshAllData}
              cart={cart}
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={setWishlist}
            />
          </div>
        )}

        {/* VIEW: CUSTOMER SUBMISSIONS & TESTIMONIAL GRID */}
        {activePage === "testimonials" && (
          <div className="animate-fade-in">
            <TestimonialsPage 
              reviews={reviews}
              onAddReview={handleAddNewReview}
            />
          </div>
        )}

        {/* VIEW: ABOUT BIO PORTRAIT & HISTORY */}
        {activePage === "about" && (
          <div className="animate-fade-in">
            <AboutPage portraitImg={profileImg} />
          </div>
        )}

        {/* VIEW: INTERACTIVE tarot AI CHAT ORACLE */}
        {activePage === "oracle" && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="text-center space-y-2 mb-8">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">✧ Spiritual Assistant ✧</span>
              <h2 className="font-serif-lux text-2xl font-bold text-amber-100">Consult with the Mystic Oracle</h2>
              <p className="max-w-md mx-auto text-xs text-gray-500 leading-relaxed font-light">Ask any metaphysical query, request card readings, or zodiac coordinate evaluations securely on-screen.</p>
            </div>
            <TarotOracle />
          </div>
        )}

        {/* VIEW: BLOG NEWPOSTS COLUMN */}
        {activePage === "blog" && (
          <div className="animate-fade-in">
            <BlogPage blogs={blogs} />
          </div>
        )}

        {/* VIEW: DOWNLOAD RESOUCES & NEWSLETTER */}
        {activePage === "resources" && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <ResourcesPage onNewsletterSubmit={handleNewsletterSignup} />
          </div>
        )}

        {/* VIEW: CONTACT INFO BOX & FORMS */}
        {activePage === "contact" && (
          <div className="animate-fade-in">
            <ContactPage />
          </div>
        )}

        {/* VIEW: ADMINISTRATIVE BUSINESS CRM HUB */}
        {activePage === "admin" && (
          <div className="animate-fade-in">
            <AdminDashboard 
              bookings={bookings}
              products={products}
              blogs={blogs}
              newslettersCount={newslettersCount}
              onRefreshAllData={refreshAllData}
            />
          </div>
        )}

      </main>

      {/* 3. PORTAL FOOTER DETAILS */}
      <footer className="border-t border-gray-950 bg-[#09090b] py-12 text-xs text-gray-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-900 pb-8 gap-6">
            <div className="space-y-2 max-w-md">
              <span className="font-serif-lux tracking-widest text-base font-bold text-amber-300">KUNIKA GUPTA</span>
              <p className="font-light leading-relaxed text-gray-400">
                Premium modern metaphysical consultancy, balancing astrological transits and tarot analytics to secure emotional alignments and career abundance.
              </p>
            </div>

            {/* Compact Newsletter Capture */}
            <div className="space-y-2">
              <p className="font-serif-lux font-semibold text-amber-400 uppercase tracking-widest">Subscribe to Inner Astral Circle</p>
              <form 
                onSubmit={(e) => { 
                  e.preventDefault(); 
                  const email = (e.currentTarget.elements.namedItem('footerEmail') as HTMLInputElement).value;
                  handleNewsletterSignup(email); 
                  e.currentTarget.reset();
                }} 
                className="flex max-w-sm gap-1"
              >
                <input
                  type="email"
                  required
                  name="footerEmail"
                  placeholder="seeker@coordinate.com"
                  className="rounded bg-black border border-gray-850 px-3 py-1.5 focus:border-amber-400/40 outline-none text-gray-200"
                />
                <button type="submit" className="rounded bg-amber-500 hover:brightness-105 px-4 font-bold text-black uppercase text-[10px] tracking-widest">
                  Seek
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between text-gray-600">
            <p>© {new Date().getFullYear()} Kunika Gupta. Administered under elite spiritual guidelines. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0 font-medium">
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Safe data protection protocols active."); }} className="hover:text-gray-400">Privacy Protocols</a>
              <span>•</span>
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Vedic consultation terms & refund parameters are locked securely."); }} className="hover:text-gray-400">Consultation terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* 4. SEAMLESS FLOATING CHAT BUTTON */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isFloatChatOpen ? (
          <button
            onClick={() => setIsFloatChatOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-black shadow-2xl hover:brightness-105 transition-transform hover:scale-110 focus:outline-none"
            id="floating-chat-trigger-btn"
          >
            <MessageSquare className="h-5 w-5 animate-pulse" />
          </button>
        ) : (
          <div className="h-[430px] w-80 rounded-2xl border border-gray-800 bg-[#0d0d0f] shadow-2xl overflow-hidden flex flex-col justify-between animate-scale-up" id="floating-chat-box">
            <div className="bg-[#121215] border-b border-gray-900 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4 text-amber-400" />
                <span className="font-serif-lux font-bold text-xs tracking-widest text-amber-200">Oracle Assistant</span>
              </div>
              <button onClick={() => setIsFloatChatOpen(false)} className="text-gray-500 hover:text-white focus:outline-none">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 flex-grow overflow-y-auto">
              <TarotOracle />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
