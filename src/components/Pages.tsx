import React, { useState } from 'react';
import { Mail, Phone, MapPin, Youtube, Instagram, ExternalLink, Send, ArrowRight, ShieldCheck, Download, Award, Star, Moon, Heart, ChevronRight, Sparkles, BookOpen, X, Search } from 'lucide-react';
import { Blog, Review } from '../server/db.ts';

// 1. ABOUT PAGE COMPONENT
interface AboutPageProps {
  portraitImg?: string;
}

export function AboutPage({ portraitImg }: AboutPageProps) {
  const certifications = [
    { title: "Grand Master Tarot Guild", institute: "International Tarot Guild, London", year: "2018" },
    { title: "Jyotish Acharya (Vedic Astrologer)", institute: "All India Council of Astrological Sciences", year: "2017" },
    { title: "Licensed Life & Emotional Coach", institute: "International Federation of Coaches", year: "2020" },
    { title: "Master Crystal Therapist", institute: "Geminological Institute of Healing, Jaipur", year: "2019" }
  ];

  return (
    <div className="space-y-16 py-4">
      {/* Narrative grid */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-center">
        {/* Profile Image card */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-1000" />
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-[#121215] p-3 shadow-2xl max-w-sm">
              <img 
                src={portraitImg || "https://picsum.photos/seed/kunikagupta/500/600"} 
                alt="Kunika Gupta" 
                className="h-96 w-full rounded-xl object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-3 bottom-3 rounded-xl bg-black/85 backdrop-blur-md p-4 border border-gray-800 text-center text-xs">
                <span className="font-serif-lux font-bold tracking-widest text-amber-400 text-sm">Kunika Gupta</span>
                <p className="text-gray-400 mt-1 uppercase text-[10px] tracking-widest">Founder & Spiritual Director</p>
              </div>
            </div>
          </div>
        </div>

        {/* Story details */}
        <div className="md:col-span-7 space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">✧ The Founder's Journey ✧</span>
            <h2 className="font-serif-lux mt-2 text-3xl font-bold tracking-wider text-amber-100">Kunika Gupta</h2>
            <p className="mt-2 text-sm text-gray-400 italic font-serif-lux">Bridging Vedic Calculations, Tarot Metaphysics, and Emotional Coaching.</p>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed font-light">
            My spiritual awakening began deep within the holy cities of northern India, where ancient cosmic blueprints were taught to me through years of monastic mentoring and astrological validation. I realised that stars do not constrain us; they provide the administrative guidelines to master our own destinies.
          </p>

          <p className="text-sm text-gray-300 leading-relaxed font-light">
            For over a decade, I have acted as an intuitive guide to a global roster of leaders, professionals, and seekers. By aligning the rigorous structures of Vedic chart transits with the emotional resonance of modern Tarot archetypes, I help you release mental blocks, find clarity during friction, and construct beautiful pathways of career abundance and relationship harmony.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-900">
            <div>
              <span className="font-serif-lux text-2xl font-bold text-amber-400">12K+</span>
              <p className="text-gray-500 text-[10px] uppercase font-semibold mt-1">Souls Activated</p>
            </div>
            <div>
              <span className="font-serif-lux text-2xl font-bold text-amber-400">12+ Yrs</span>
              <p className="text-gray-500 text-[10px] uppercase font-semibold mt-1">Concentric Mastery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Callout */}
      <div className="rounded-2xl border border-amber-500/10 bg-gradient-to-r from-amber-500/[0.02] to-transparent p-6 text-center max-w-2xl mx-auto space-y-3">
        <Sparkles className="mx-auto h-6 w-6 text-amber-400 animate-pulse" />
        <h3 className="font-serif-lux text-lg font-bold text-amber-200">Our Spiritual Directive</h3>
        <p className="text-xs text-gray-400 leading-relaxed max-w-lg mx-auto font-light">
          "Spiritual healing is not about predicting a rigid, uncontrollable future. True craft is enabling you to dissolve doubt, make aligned decisions, and master your soul path with absolute confidence."
        </p>
      </div>

      {/* Certifications and credentials list */}
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="font-serif-lux text-xl font-bold text-amber-100 uppercase tracking-widest">Academic & Spiritual Credentials</h3>
          <p className="text-xs text-gray-500 mt-1">Verified global affiliations in astrological sciences and metadata therapy.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {certifications.map((c, i) => (
            <div key={i} className="rounded-xl border border-gray-850 bg-[#09090b] p-5 flex flex-col justify-between group hover:border-amber-400/40 transition-colors">
              <div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-400 w-fit">
                <Award className="h-5 w-5" />
              </div>
              <div className="mt-4">
                <h4 className="font-serif-lux text-sm font-bold text-amber-200">{c.title}</h4>
                <p className="text-[10px] text-gray-400 mt-1">{c.institute}</p>
              </div>
              <div className="mt-3 border-t border-gray-900 pt-2 text-[10px] text-gray-500 font-semibold font-serif-lux text-right">
                AD {c.year}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// 2. TESTIMONIALS PAGE COMPONENT
interface TestimonialsPageProps {
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'isCompleted'>) => Promise<boolean>;
}

export function TestimonialsPage({ reviews = [], onAddReview }: TestimonialsPageProps) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [service, setService] = useState("Tarot Career Reading");
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;
    setIsSubmitting(true);

    const success = await onAddReview({
      clientName: name,
      rating,
      text,
      serviceName: service,
      beforeState: before || "Uncertain, cloudy coordinates.",
      afterState: after || "Aura centered with deep energetic direction."
    });

    if (success) {
      alert("Thank you. Testimonial registered and published to the global ledger!");
      setName("");
      setText("");
      setBefore("");
      setAfter("");
    } else {
      alert("Failed to sync testimonial. Attempt again shortly.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-12 py-4">
      {/* Narrative Header */}
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">✧ The Aligned Ledger ✧</span>
        <h2 className="font-serif-lux mt-2 text-2xl font-bold tracking-wider text-amber-100 md:text-3xl">Success & Healing Chronologies</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-gray-400">
          True spiritual work is mapped purely through the real-world transformations of human lives. Read verified transits of seekers who achieved alignment.
        </p>
      </div>

      {/* Success story Before & After blocks */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {reviews.map((rev) => (
          <div key={rev.id} className="rounded-xl border border-gray-800 bg-[#09090b] p-6 space-y-4 hover:border-amber-400/25 transition-all">
            <div className="flex items-start justify-between border-b border-gray-900 pb-3">
              <div>
                <h4 className="font-serif-lux text-sm font-bold text-amber-150">{rev.clientName}</h4>
                <p className="text-[10px] text-amber-400">{rev.serviceName}</p>
              </div>
              
              {/* Star Rating */}
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>

            <p className="text-xs leading-relaxed text-gray-300 font-light italic">
              "{rev.text}"
            </p>

            {/* Before / After Blocks */}
            <div className="grid grid-cols-2 gap-3 border-t border-gray-900 pt-3 text-[10px]">
              <div className="rounded bg-red-950/25 border border-red-900/10 p-2.5">
                <span className="font-semibold uppercase tracking-wider text-red-400 block mb-1">Before Seeker State</span>
                <p className="text-gray-400 line-clamp-3 font-light leading-normal">{rev.beforeState}</p>
              </div>

              <div className="rounded bg-green-950/25 border border-green-900/10 p-2.5">
                <span className="font-semibold uppercase tracking-wider text-[#34d399] block mb-1">Aligned After State</span>
                <p className="text-gray-400 line-clamp-3 font-light leading-normal">{rev.afterState}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonial Form drawer */}
      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-800 bg-[#0c0c0e] p-6 max-w-xl mx-auto space-y-4 shadow-xl">
        <h3 className="font-serif-lux text-base font-bold text-amber-250 border-b border-gray-900 pb-2">Log your spiritual testimonial</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-amber-400 uppercase font-semibold">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded bg-black border border-gray-850 p-2 text-xs text-gray-200 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-amber-400 uppercase font-semibold">Service Received</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full rounded bg-black border border-gray-850 p-2.5 text-xs text-gray-200 outline-none"
            >
              <option>Career Tarot Alignment</option>
              <option>Relationship Destiny Reading</option>
              <option>Marriage Vedic Consultation</option>
              <option>Astrology General Reading</option>
              <option>Commercial Brand Audit</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] text-amber-400 uppercase font-semibold">Prior State (Before)</label>
            <input
              type="text"
              value={before}
              onChange={(e) => setBefore(e.target.value)}
              placeholder="e.g. Anxiety on career bottleneck"
              className="w-full rounded bg-black border border-gray-850 p-2 text-xs text-gray-200 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-amber-400 uppercase font-semibold">Aligned State (After)</label>
            <input
              type="text"
              value={after}
              onChange={(e) => setAfter(e.target.value)}
              placeholder="e.g. Absolute focus and secured promotion"
              className="w-full rounded bg-black border border-gray-850 p-2 text-xs text-gray-200 outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-amber-400 uppercase font-semibold flex justify-between">
            <span>Detailed Review Description</span>
            <span className="text-amber-500">Rating: {rating} ★</span>
          </label>
          <textarea
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Share your experience mapping alignments with Kunika, crystal therapies received, etc..."
            className="w-full rounded bg-black border border-gray-850 p-2 text-xs text-gray-200 outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-amber-500 py-3 text-xs font-bold text-black uppercase tracking-widest hover:brightness-105 transition-all"
        >
          {isSubmitting ? 'Registering coordinates...' : 'Publish Testimonial Log'}
        </button>
      </form>
    </div>
  );
}


// 3. CELESTIAL BLOG COMPONENT
interface BlogPageProps {
  blogs: Blog[];
}

export function BlogPage({ blogs = [] }: BlogPageProps) {
  const [selectedPost, setSelectedPost] = useState<Blog | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (blog.content && blog.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-12 py-4">
      <div className="text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">✧ The Astral Chronicle ✧</span>
        <h2 className="font-serif-lux mt-2 text-2xl font-bold tracking-wider text-amber-100 md:text-3xl">Celestial Insights & Forecasts</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-gray-400">
          Discover advanced astrological planetary cycles, lunar calendar transits, tarot reading guides, and grounding crystal rituals.
        </p>
      </div>

      {/* Blog Search Bar styled with high-contrast charcoal grey text and subtle gold border */}
      <div className="flex justify-center" id="blog-search-section">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search celestial insights & forecasts..."
            className="w-full rounded-xl border border-amber-500/30 bg-[#FAF9F6] dark:bg-[#121215] pl-10 pr-9 py-2.5 text-xs text-[#333333] dark:text-gray-200 placeholder-gray-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 shadow-lg font-medium"
            id="blog-search-input"
          />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-amber-600/70" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Blogs listings */}
      {filteredBlogs.length === 0 ? (
        <div className="text-center py-16 space-y-3" id="no-blog-results">
          <Moon className="mx-auto h-8 w-8 text-amber-500/30 animate-pulse" />
          <p className="text-xs text-gray-500 uppercase tracking-widest">No cosmic insights match your criteria</p>
          <button 
            onClick={() => setSearchQuery("")}
            className="text-xs text-amber-400 hover:underline"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              onClick={() => setSelectedPost(blog)}
              className="group rounded-xl border border-gray-850 bg-[#09090b] overflow-hidden flex flex-col justify-between hover:border-amber-400/40 cursor-pointer transition-all duration-300"
              id={`celestial-blog-card-${blog.id}`}
            >
              <div>
                {/* Image Header */}
                <div className="h-44 w-full bg-[#141417] overflow-hidden border-b border-gray-950 relative">
                  <img 
                    src={blog.imageUrl || "https://picsum.photos/seed/defaultmagic/800/500"} 
                    alt={blog.title} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute left-3 top-3 rounded bg-black/80 backdrop-blur px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-amber-400 border border-gray-800">
                    {blog.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[10px] text-gray-500 font-serif-lux">{blog.publishedAt} • {blog.readTime}</span>
                  <h3 className="font-serif-lux text-sm font-semibold text-amber-200 group-hover:text-amber-300 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-[11px] leading-relaxed text-gray-400 line-clamp-3 font-light">
                    {blog.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 border-t border-gray-900 pt-3 flex items-center justify-between text-[11px] text-amber-400 font-semibold font-serif-lux">
                <span>Read Insight</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Specific post detail viewer drawer overlay */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 md:p-10" id="blog-reading-modal">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setSelectedPost(null)} />
          
          <div className="relative w-full max-w-3xl rounded-2xl border border-amber-500/10 bg-[#0d0d10] overflow-hidden shadow-2xl animate-scale-up max-h-[85vh] flex flex-col">
            
            {/* Header image */}
            <div className="h-64 w-full relative overflow-hidden flex-shrink-0">
              <img src={selectedPost.imageUrl} alt={selectedPost.title} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d10] to-transparent" />
              <button 
                onClick={() => setSelectedPost(null)} 
                className="absolute right-4 top-4 rounded-full bg-black/60 p-1.5 border border-gray-850 hover:bg-black text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content scroller */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-4">
              <div>
                <span className="rounded bg-amber-400/10 px-2.5 py-0.5 text-[9px] font-bold tracking-widest text-amber-400 uppercase">
                  {selectedPost.category}
                </span>
                <h3 className="font-serif-lux text-2xl font-bold tracking-wide text-amber-100 mt-2">
                  {selectedPost.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Written by {selectedPost.author} on {selectedPost.publishedAt} • {selectedPost.readTime}</p>
              </div>

              <div className="prose prose-invert prose-amber max-w-none text-xs leading-relaxed text-gray-300 space-y-3.5 border-t border-gray-850 pt-4 font-light">
                {selectedPost.content.split('\n\n').map((para, i) => {
                  if (para.startsWith('###') || para.startsWith('##')) {
                    const clean = para.replace(/^#+\s+/, '');
                    return <h4 key={i} className="font-serif-lux mt-5 mb-2 font-bold text-amber-400 text-sm">{clean}</h4>;
                  }
                  return <p key={i} className="leading-relaxed">{para}</p>;
                })}
              </div>
            </div>

            <div className="border-t border-gray-850 p-4 bg-black/45 text-right flex-shrink-0">
              <button
                onClick={() => setSelectedPost(null)}
                className="rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-black hover:brightness-105"
              >
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}


// 4. FREE RESOURCES / LANDING CAPTURES
export function ResourcesPage({ onNewsletterSubmit }: { onNewsletterSubmit: (email: string) => Promise<boolean> }) {
  const [emailInput, setEmailInput] = useState("");
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isReadingBook, setIsReadingBook] = useState(false);

  // Digital Book Pages
  const [activeBookPage, setActiveBookPage] = useState(0);
  const bookPages = [
    { title: "Introduction", text: "Welcome to the Tarot Matrix. Tarot is a cosmic language of numbers and elements aligning with human destiny..." },
    { title: "Major Arcana Dynamics", text: "The Emperor represents structural command. The High Priestess handles intuitive receptor portals. Wheel of fortune represents transits..." },
    { title: "Gemstones & Crystals", text: "Amethyst heals hyperactive frequencies. Rose quartz cleans heart chakras. Tiger's eye grounds finances and drive..." },
    { title: "Vedic Coordination", text: "Aligning birth time, birth date, and planetary houses. Your soul chooses these vectors to seed spiritual lessons." }
  ];

  const handleLeadCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;
    setIsCapturing(true);

    const success = await onNewsletterSubmit(emailInput);
    if (success) {
      setDownloadSuccess(true);
      setEmailInput("");
    } else {
      alert("Error logging coordinate. Please retry.");
    }
    setIsCapturing(false);
  };

  return (
    <div className="space-y-12 py-4">
      {/* 3D Lead Magnet Hero */}
      <section className="rounded-2xl border border-amber-500/10 bg-gradient-to-r from-[#0e0e11] to-[#070709] p-6 shadow-2xl grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
        
        {/* visual book */}
        <div className="md:col-span-5 flex justify-center">
          <div className="relative h-64 w-48 rounded-r-xl border border-amber-400/30 bg-[#141417] p-4 text-center text-xs flex flex-col justify-between shadow-2xl relative select-none">
            {/* Spine */}
            <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black to-transparent" />
            <div className="text-[9px] tracking-widest text-amber-500/70 uppercase">Kunika Gupta</div>
            <div className="my-auto py-2">
              <BookOpen className="mx-auto h-8 w-8 text-amber-400 animate-pulse" />
              <h4 className="font-serif-lux mt-3 text-sm font-bold tracking-widest text-amber-100">THE TAROT MATRIX</h4>
              <p className="text-[8px] text-gray-500 tracking-wider">Metaphysical coordinate mapping guide</p>
            </div>
            <span className="text-[8px] text-amber-500 border border-amber-500/30 w-fit mx-auto px-1.5 py-0.5 rounded">PDF EDITION</span>
          </div>
        </div>

        {/* Capturing Copy text */}
        <div className="md:col-span-7 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-500 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> High-conversion gift
          </span>
          <h3 className="font-serif-lux text-2xl font-bold tracking-wider text-amber-100">Free Spiritual Matrix Handbook</h3>
          <p className="text-xs text-gray-400 leading-relaxed font-light">
            Unlock the foundational matrices of Tarot cards, gemstone frequency alignments, and lunar zodiac charts. This 45-page premium guide maps practical spiritual tools to master doubt.
          </p>

          {!downloadSuccess ? (
            <form onSubmit={handleLeadCapture} className="flex flex-col sm:flex-row gap-2 max-w-md pt-2">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="seeker@coordinate.com"
                className="flex-1 rounded-xl bg-black border border-gray-850 px-3.5 py-2.5 text-xs text-gray-200 outline-none placeholder:text-gray-500 focus:border-amber-400/40"
              />
              <button
                type="submit"
                disabled={isCapturing}
                className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-black uppercase tracking-wider hover:brightness-105 flex items-center justify-center gap-1 disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" />
                Unlock Matrix
              </button>
            </form>
          ) : (
            <div className="space-y-3 pt-2">
              <p className="text-xs text-green-400 font-semibold font-serif-lux uppercase flex items-center gap-1.5">
                ✦ Matrix unlocked! Feel free to view or download directly.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsReadingBook(true)}
                  className="rounded-xl bg-[#141416] border border-gray-800 px-4 py-2 text-xs font-bold text-amber-400 flex items-center gap-1.5 hover:bg-black"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Read E-Book Now
                </button>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert("PDF download started with divine alignment!"); }}
                  className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black flex items-center gap-1.5 hover:brightness-105"
                >
                  <Download className="h-3.5 w-3.5" />
                  Get PDF Copy
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3D Interactive Flip-Book Reader simulation overlays */}
      {isReadingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="digital-handbook-reader">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsReadingBook(false)} />
          
          <div className="relative w-full max-w-2xl rounded-2xl border border-amber-500/15 bg-[#101013] p-6 shadow-2xl flex flex-col justify-between max-h-[80vh] overflow-y-auto animate-scale-up">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-850 pb-3">
              <span className="font-serif-lux text-sm font-bold tracking-widest text-amber-400">THE TAROT MATRIX BOOKLET</span>
              <button onClick={() => setIsReadingBook(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Read area */}
            <div className="py-8 px-4 flex flex-col justify-between flex-1 min-h-[200px]">
              <div className="space-y-3">
                <span className="text-[10px] text-amber-500/80 font-bold uppercase tracking-wider font-serif-lux">
                  Section 0{activeBookPage + 1}: {bookPages[activeBookPage].title}
                </span>
                <p className="font-serif-lux text-base font-semibold text-gray-200">{bookPages[activeBookPage].title}</p>
                <p className="text-xs leading-relaxed text-gray-400 font-light max-w-lg italic">{bookPages[activeBookPage].text}</p>
              </div>

              {/* Page selectors */}
              <div className="flex justify-between items-center border-t border-gray-850 pt-5 mt-6">
                <button
                  disabled={activeBookPage === 0}
                  onClick={() => setActiveBookPage(p => p - 1)}
                  className="text-xs font-semibold text-gray-400 hover:text-white disabled:opacity-30 focus:outline-none"
                >
                  Back Column
                </button>
                <span className="text-[10px] text-gray-600">Page {activeBookPage + 1} of {bookPages.length}</span>
                <button
                  disabled={activeBookPage === bookPages.length - 1}
                  onClick={() => setActiveBookPage(p => p + 1)}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 disabled:opacity-30 focus:outline-none"
                >
                  Next Page &gt;
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}


// 5. CONTACT PAGE COMPONENT
export function ContactPage() {
  const [fName, setFName] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fSubject, setFSubject] = useState("");
  const [fMsg, setFMsg] = useState("");
  const [ticketSubmit, setTicketSubmit] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fName || !fEmail) return;
    setTicketSubmit(true);
    setFName("");
    setFEmail("");
    setFSubject("");
    setFMsg("");
  };

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-12 py-4">
      {/* Coordinates / Map details */}
      <div className="md:col-span-5 space-y-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">✧ Coordinates ✧</span>
          <h2 className="font-serif-lux mt-2 text-2xl font-bold tracking-wider text-amber-100">Spiritual Sanctuaries</h2>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">Bookings are conducted globally via digital conferencing or by physical invitation at Kunika’s private Delhi Studio resort.</p>
        </div>

        {/* Info Rows */}
        <div className="space-y-4 text-xs font-light">
          <div className="flex gap-3 rounded-lg border border-gray-850/60 bg-[#09090b] p-4">
            <MapPin className="h-5 w-5 text-amber-400" />
            <div>
              <p className="font-semibold text-gray-300">New Delhi Sanctuary</p>
              <p className="text-gray-500 mt-0.5">Vasant Vihar, Block-C, 2nd Floor, New Delhi, India 110057</p>
            </div>
          </div>

          <div className="flex gap-3 rounded-lg border border-gray-850/60 bg-[#09090b] p-4">
            <Mail className="h-5 w-5 text-amber-400" />
            <div>
              <p className="font-semibold text-gray-300">Electronic Mailbox</p>
              <p className="text-gray-500 mt-0.5">divinity@kunikagupta.com</p>
            </div>
          </div>

          <div className="flex gap-3 rounded-lg border border-gray-850/60 bg-[#09090b] p-4">
            <Phone className="h-5 w-5 text-amber-400" />
            <div>
              <p className="font-semibold text-gray-300">WhatsApp Hotlines</p>
              <p className="text-gray-500 mt-0.5">+91 91234 56789 (Support Coordinator)</p>
            </div>
          </div>
        </div>

        {/* Native WhatsApp Float Prompt */}
        <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.01] p-5 space-y-3">
          <p className="font-serif-lux text-xs font-semibold text-amber-400 uppercase tracking-widest">Talk on WhatsApp Instant</p>
          <p className="text-[11px] leading-relaxed text-gray-400">
            Need urgent guidance? Directly speak with Kunika's support team to reserve next-day openings.
          </p>
          <a
            href="https://wa.me/919123456789?text=Greetings%20Kunika.%20I%2520am%2520seeking%2520a%2520Tarot%2520and%2520Vedic%2520Astrology%2520alignment%252520appointment."
            target="_blank"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#25d366] px-4 py-2 text-xs font-bold text-black"
          >
            Launch WhatsApp Direct
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Support ticket Form */}
      <div className="md:col-span-7">
        {!ticketSubmit ? (
          <form onSubmit={handleContactSubmit} className="rounded-xl border border-gray-800 bg-[#09090b] p-6 space-y-4 shadow-xl">
            <h3 className="font-serif-lux text-base font-bold text-amber-200 border-b border-gray-950 pb-2">Send Seeker Message</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-amber-400 uppercase font-semibold">Your Name</label>
                <input
                  type="text"
                  required
                  value={fName}
                  onChange={(e) => setFName(e.target.value)}
                  placeholder="Visitor Name"
                  className="w-full rounded bg-black border border-gray-850 p-2 text-xs text-gray-255 outline-none focus:border-amber-400/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-amber-400 uppercase font-semibold">Your Email</label>
                <input
                  type="email"
                  required
                  value={fEmail}
                  onChange={(e) => setFEmail(e.target.value)}
                  placeholder="seeker@coordinate.com"
                  className="w-full rounded bg-black border border-gray-850 p-2 text-xs text-gray-255 outline-none focus:border-amber-400/40"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-amber-400 uppercase font-semibold">Subject Coordinates</label>
              <input
                type="text"
                value={fSubject}
                onChange={(e) => setFSubject(e.target.value)}
                placeholder="e.g. Schedule inquiries or corporate partnership"
                className="w-full rounded bg-black border border-gray-850 p-2 text-xs text-gray-255 outline-none focus:border-amber-400/40"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-amber-400 uppercase font-semibold">Your coordinates or questions</label>
              <textarea
                value={fMsg}
                onChange={(e) => setFMsg(e.target.value)}
                rows={4}
                placeholder="Describe your goals, queries, or coordinate dates..."
                className="w-full rounded bg-black border border-gray-850 p-2 text-xs text-gray-255 outline-none focus:border-amber-400/40 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded bg-amber-500 py-3 text-xs font-bold text-black uppercase tracking-widest hover:brightness-105 transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              Send Aligned Ticket
            </button>
          </form>
        ) : (
          <div className="rounded-xl border border-gray-800 bg-[#09090b] p-8 text-center space-y-4 shadow-xl animate-fade-in">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-500 border border-green-500/30">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="font-serif-lux text-base font-bold text-amber-200">Ticket Dispatched!</h4>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
              Blessed. Your coordinate details have been integrated into our support list. A communications counselor will connect back via email within 24 hours.
            </p>
            <button
              onClick={() => setTicketSubmit(false)}
              className="rounded border border-amber-500/30 bg-[#141416] hover:bg-[#1c1c1f] px-4 py-2 text-[10px] font-bold tracking-wider text-amber-400 uppercase"
            >
              Done
            </button>
          </div>
        )}
      </div>

      {/* Social Media Footer Section */}
      <div className="col-span-full border-t border-amber-500/10 pt-10 mt-4 text-center space-y-5" id="spiritual-social-footer">
        <div className="max-w-md mx-auto space-y-2">
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block">✦ Divine Sanctuary Online ✦</span>
          <h3 className="font-serif-lux text-base font-bold text-amber-100">Kunika's Spiritual Journey</h3>
          <p className="text-[11px] text-gray-400 max-w-sm mx-auto leading-relaxed">
            Follow our daily sacred updates, celestial alignment forecasts, and live interactive Tarot gatherings on our official social channel.
          </p>
        </div>

        <div className="flex justify-center items-center gap-4">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.01] hover:border-amber-500/40 hover:bg-amber-500/[0.04] hover:shadow-[0_4px_25px_rgba(212,175,55,0.03)] transition-all duration-300 w-32 justify-center text-center select-none"
            id="social-instagram-link"
          >
            <Instagram className="h-6 w-6 text-amber-400 group-hover:scale-115 transition-transform duration-350" />
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Instagram</span>
          </a>
        </div>
      </div>
    </div>
  );
}
