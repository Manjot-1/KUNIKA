import React, { useState, useEffect } from 'react';
import { Send, Sparkles, AlertCircle, RefreshCw, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const AVAILABLE_CARDS = [
  { name: "The Star", arcana: "Major XVII", meaning: "Hope, Divine Alignment, Serenity, Rebirth", desc: "A shining star pouring water of renewals. Signifies that celestial healing is clearing your paths.", strokeColor: "stroke-blue-400" },
  { name: "The Moon", arcana: "Major XVIII", meaning: "Intuition, Astral Secrets, Shadow Integration", desc: "A soft lunar beacon illuminating wild waters. Promotes trusting dreams and integrating shadow anxieties.", strokeColor: "stroke-purple-400" },
  { name: "The Sun", arcana: "Major XIX", meaning: "Vitality, Absolute Success, Authentic Clarity", desc: "A young child riding under a warm glowing solar aura. Signifies triumph, career energy, and confidence.", strokeColor: "stroke-yellow-500" },
  { name: "The Empress", arcana: "Major III", meaning: "Abundance, Creative Genesis, Relationship Harmony", desc: "A crowned queen sitting in a field of harvest. Signifies love flourishing and professional fertility.", strokeColor: "stroke-amber-400" },
  { name: "The Wheel of Fortune", arcana: "Major X", meaning: "Destiny Shifts, Abrupt Transits, Karmic Realigns", desc: "A rotating celestial wheel covered in mystical runes. Signifies that a major positive cosmic shift is underway.", strokeColor: "stroke-gold-500" }
];

export default function TarotOracle() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "✧ Greetings, seeker. I am Kunika Gupta's AI Spiritual Oracle, tuned to your energetic frequency. Ask me about your Tarot charts, career transits, relationship harmonies, or which crystal aligns with your Zodiac sign today.",
      timestamp: new Date()
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Daily Tarot states
  const [hasDrawn, setHasDrawn] = useState(false);
  const [drawnCards, setDrawnCards] = useState<typeof AVAILABLE_CARDS>([]);
  const [tarotReading, setTarotReading] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const [isReadingExpanded, setIsReadingExpanded] = useState(true);

  // Trigger server-side Gemini Tarot assessment for 3-card Past-Present-Future spread
  const handleTarotDraw = async () => {
    setIsDrawing(true);
    setHasDrawn(true);
    setIsReadingExpanded(true);
    setTarotReading("Shuffling and invoking the Oracle...");

    // Get 3 random unique cards
    const shuffled = [...AVAILABLE_CARDS].sort(() => 0.5 - Math.random());
    const selectedCards = shuffled.slice(0, 3);
    setDrawnCards(selectedCards);

    try {
      const prompt = `I have drawn a 3-card Tarot Spread:
1. Past: "${selectedCards[0].name}" (${selectedCards[0].arcana}) - Meaning: ${selectedCards[0].meaning}
2. Present: "${selectedCards[1].name}" (${selectedCards[1].arcana}) - Meaning: ${selectedCards[1].meaning}
3. Future: "${selectedCards[2].name}" (${selectedCards[2].arcana}) - Meaning: ${selectedCards[2].meaning}

Can you do a professional, beautiful, premium spiritual reading based on this 3-card Past-Present-Future spread for my day? Outline the energetic progression of each card and provide a unified daily action in markdown headers and bullet points.`;
      
      const response = await fetch('/api/tarot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt })
      });
      const data = await response.json();
      
      if (data.reply) {
        setTarotReading(data.reply);
      } else {
        setTarotReading(`### Past: ${selectedCards[0].name}\nYour foundation is built upon **${selectedCards[0].meaning}**.\n\n### Present: ${selectedCards[1].name}\nYour current lessons revolve around **${selectedCards[1].meaning}**.\n\n### Future: ${selectedCards[2].name}\nYour celestial trajectory points toward **${selectedCards[2].meaning}**.\n\n### Aligned Action:\nFocus on harmonizing these divine currents today.`);
      }
    } catch (err) {
      setTarotReading(`### Past: ${selectedCards[0].name}\nYour foundation is built upon **${selectedCards[0].meaning}**.\n\n### Present: ${selectedCards[1].name}\nYour current lessons revolve around **${selectedCards[1].meaning}**.\n\n### Future: ${selectedCards[2].name}\nYour celestial trajectory points toward **${selectedCards[2].meaning}**.\n\n### Aligned Action:\nFocus on harmonizing these divine currents today.`);
    } finally {
      setIsDrawing(false);
    }
  };

  // Chat message submit
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: inputVal,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    try {
      // Map history for Gemini backend
      const history = messages.map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch('/api/tarot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          chatHistory: history
        })
      });

      const data = await res.json();
      
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: data.reply || "My mystical channels are resetting. Rephrase your question under calmer waters.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: "The spiritual field is encountering high vibration noise. Query me again in a few moments or inspect the console.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Preset queries
  const askPreset = (text: string) => {
    setInputVal(text);
  };

  return (
    <div className="space-y-12">
      {/* 1. Daily Tarot Card Widget */}
      <section className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#111112] to-[#070708] p-6 shadow-2xl md:p-10" id="daily-tarot-section">
        <div className="absolute top-0 right-0 -z-10 h-64 w-64 rounded-full bg-amber-500/5 blur-3xl" />
        
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">✧ The Astral Portal ✧</span>
          <h2 className="font-serif-lux mt-2 text-2xl font-bold tracking-wider text-amber-100 md:text-3xl">Daily Tarot Guidance</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-gray-400">
            Center your mind, visualise your current intention, and select a card from the deck below to open your daily forecast path.
          </p>
        </div>

        {!hasDrawn ? (
          <div className="mt-8 flex flex-wrap justify-center gap-4 py-4 md:gap-8">
            {[1, 2, 3].map((cardIdx) => (
              <motion.button
                key={cardIdx}
                onClick={() => {
                  handleTarotDraw();
                }}
                className="group relative h-64 w-44 cursor-pointer rounded-xl bg-[#161619] p-2 focus:outline-none focus:ring-1 focus:ring-amber-500/50 overflow-visible"
                id={`tarot-deck-card-${cardIdx}`}
                initial="initial"
                whileHover="hover"
                animate="initial"
                variants={{
                  initial: { scale: 1, y: 0 },
                  hover: { scale: 1.04, y: -10 }
                }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
              >
                {/* Glowing gold outer border shift layer */}
                <motion.div
                  className="absolute rounded-xl pointer-events-none"
                  variants={{
                    initial: {
                      inset: "0px",
                      border: "1px solid rgba(245, 158, 11, 0.25)",
                      boxShadow: "0 0 0px rgba(245, 158, 11, 0)",
                      opacity: 0.7
                    },
                    hover: {
                      inset: "-4px",
                      border: "1.5px solid rgba(245, 158, 11, 0.8)",
                      boxShadow: "0 0 25px rgba(245, 158, 11, 0.45)",
                      opacity: 1
                    }
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                />

                {/* Tactical shrinking inner gold border shift */}
                <motion.div
                  className="absolute rounded-lg pointer-events-none z-10"
                  variants={{
                    initial: {
                      inset: "6px",
                      border: "1px solid rgba(245, 158, 11, 0.1)",
                      opacity: 0.4
                    },
                    hover: {
                      inset: "3px",
                      border: "1px solid rgba(245, 158, 11, 0.55)",
                      boxShadow: "inset 0 0 10px rgba(245, 158, 11, 0.3)",
                      opacity: 1
                    }
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                />

                {/* Spiritual card pattern */}
                <div className="flex h-full w-full flex-col justify-between rounded-lg border border-amber-400/25 bg-gradient-to-b from-[#1e1e24] to-[#141417] p-4 text-center">
                  <div className="text-[10px] font-bold tracking-widest text-amber-400 font-serif-lux">KUNIKA GUPTA</div>
                  <div className="my-auto flex flex-col items-center flex-1 justify-center">
                    <Sparkles className="h-8 w-8 text-amber-300 transition-transform duration-700 group-hover:rotate-180 group-hover:scale-125" />
                    <div className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-amber-200">DRAW CARD</div>
                  </div>
                  <div className="text-[10px] font-bold tracking-widest text-amber-400 font-serif-lux">✧ ORACLE ✧</div>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="mt-8 space-y-10">
            {/* The Drawn Cards staggered layout */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.4,
                  }
                }
              }}
            >
              {drawnCards.map((card, index) => {
                const label = index === 0 ? "PAST" : index === 1 ? "PRESENT" : "FUTURE";
                const labelColor = index === 0 ? "text-blue-400" : index === 1 ? "text-purple-400" : "text-amber-400";
                const borderColor = index === 0 ? "border-blue-500/20" : index === 1 ? "border-purple-500/20" : "border-amber-500/20";
                const bgGlow = index === 0 ? "shadow-[0_0_20px_rgba(59,130,246,0.1)]" : index === 1 ? "shadow-[0_0_20px_rgba(168,85,247,0.1)]" : "shadow-[0_0_20px_rgba(245,158,11,0.1)]";

                return (
                  <motion.div
                    key={card.name}
                    variants={{
                      hidden: { opacity: 0, y: 30, scale: 0.9 },
                      visible: { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1,
                        transition: { type: "spring", stiffness: 100, damping: 15 }
                      }
                    }}
                    className="flex flex-col items-center space-y-3 w-full"
                  >
                    <span className={`text-xs font-black tracking-[0.3em] ${labelColor} bg-black/40 px-3 py-1 rounded-full border ${borderColor} ${bgGlow}`}>
                      ✧ {label} ✧
                    </span>
                    
                    <div 
                      className="h-80 w-52"
                      style={{ perspective: "1000px" }}
                    >
                      <motion.div
                        initial={{ rotateY: 180 }}
                        animate={{ rotateY: 0 }}
                        whileHover="hover"
                        variants={{
                          hover: {
                            scale: 1.05,
                            rotateX: -8,
                            rotateY: 8,
                            z: 15,
                            transition: {
                              scale: { type: "spring", stiffness: 300, damping: 20 },
                              rotateX: { type: "spring", stiffness: 300, damping: 20 },
                              rotateY: { type: "spring", stiffness: 300, damping: 20 },
                              z: { type: "spring", stiffness: 300, damping: 20 }
                            }
                          }
                        }}
                        transition={{ 
                          rotateY: { duration: 0.8, delay: index * 0.3, ease: [0.16, 1, 0.3, 1] } 
                        }}
                        style={{ transformStyle: "preserve-3d" }}
                        className="relative h-full w-full group cursor-pointer"
                      >
                        {/* Card Back */}
                        <div
                          style={{ 
                            backfaceVisibility: "hidden", 
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(180deg)" 
                          }}
                          className="absolute inset-0 rounded-2xl border border-amber-400/35 bg-[#141417] p-3 shadow-[0_0_30px_rgba(212,175,55,0.15)]"
                        >
                          <div className="flex h-full w-full flex-col justify-between rounded-xl border border-amber-400/25 bg-gradient-to-b from-[#1e1e24] to-[#141417] p-4 text-center">
                            <div className="text-[10px] font-bold tracking-widest text-amber-300 font-serif-lux">KUNIKA GUPTA</div>
                            <div className="my-auto flex flex-col items-center">
                              <Sparkles className="h-8 w-8 text-amber-300 animate-pulse" />
                              <div className="mt-4 text-[10px] font-black uppercase tracking-[0.15em] text-amber-200">REVEALING TRUTH</div>
                            </div>
                            <div className="text-[10px] font-bold tracking-widest text-amber-300 font-serif-lux">✧ ORACLE ✧</div>
                          </div>
                        </div>

                        {/* Card Front */}
                        <div
                          style={{ 
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden"
                          }}
                          className="absolute inset-0 rounded-2xl bg-[#FAF9F6] p-3 shadow-[0_10px_35px_rgba(0,0,0,0.6)]"
                        >
                          {/* Glowing gold outer border shift layer */}
                          <motion.div
                            className="absolute inset-0 rounded-2xl pointer-events-none"
                            variants={{
                              initial: {
                                border: "1px solid rgba(245, 158, 11, 0.35)",
                                boxShadow: "0 0 10px rgba(245, 158, 11, 0.1)",
                                opacity: 0.7
                              },
                              animate: {
                                border: "1px solid rgba(245, 158, 11, 0.35)",
                                boxShadow: "0 0 10px rgba(245, 158, 11, 0.1)",
                                opacity: 0.7
                              },
                              hover: {
                                border: "1.5px solid rgba(245, 158, 11, 0.95)",
                                boxShadow: "0 0 35px rgba(245, 158, 11, 0.6)",
                                opacity: 1
                              }
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 22 }}
                          />

                          {/* Shifting inner gold border shift */}
                          <motion.div
                            className="absolute inset-[6px] rounded-xl pointer-events-none z-10"
                            variants={{
                              initial: {
                                border: "1px solid rgba(245, 158, 11, 0.15)",
                                opacity: 0.4
                              },
                              animate: {
                                border: "1px solid rgba(245, 158, 11, 0.15)",
                                opacity: 0.4
                              },
                              hover: {
                                border: "1.5px solid rgba(245, 158, 11, 0.75)",
                                boxShadow: "inset 0 0 12px rgba(245, 158, 11, 0.45)",
                                opacity: 1
                              }
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 22 }}
                          />

                          <div className="flex h-full w-full flex-col justify-between rounded-xl border border-amber-600/30 bg-gradient-to-b from-[#FEFDF9] to-[#F5F2E9] p-4 text-center">
                            <div className="text-[10px] uppercase tracking-widest text-[#333333] font-extrabold font-serif-lux">{card.arcana}</div>
                            
                            <div className="my-auto py-2">
                              {/* Geometric crystal/mystic diagram */}
                              <svg className="mx-auto h-16 w-16 text-[#333333] filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.1)]" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" className="stroke-[#333333]" d="M12 2L2 22h20L12 2zm0 4v12M6 16h12" />
                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1" className="stroke-[#333333]" />
                                <path stroke="currentColor" strokeWidth="1" d="M12 2l10 14M12 2L2 16" />
                              </svg>
                              <h3 className="font-serif-lux mt-3 text-base font-black text-black drop-shadow-sm">{card.name}</h3>
                              <p className="mt-1.5 text-[11px] leading-relaxed text-[#444444] font-bold italic max-w-[170px] mx-auto">"{card.desc}"</p>
                            </div>

                            <div className="text-[10px] font-black uppercase tracking-widest text-[#333333]">{card.name}</div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Reading details */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="w-full"
            >
              <div className="rounded-xl border border-amber-500/10 bg-[#0e0e11] p-6">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
                    <h3 className="font-serif-lux font-semibold tracking-wide text-amber-200">
                      The Divine Reading
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsReadingExpanded(!isReadingExpanded)}
                      className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-xs font-serif-lux font-medium text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/35 transition-all duration-300 cursor-pointer"
                      id="toggle-guidance-btn"
                      aria-expanded={isReadingExpanded}
                    >
                      <span>{isReadingExpanded ? "Collapse Guidance" : "Toggle Guidance"}</span>
                      {isReadingExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => { setHasDrawn(false); setDrawnCards([]); }}
                      className="flex items-center gap-1.5 text-xs text-amber-400/80 hover:text-amber-300 focus:outline-none cursor-pointer"
                      id="reset-tarot-draw"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Draw Again
                    </button>
                  </div>
                </div>
                
                <AnimatePresence initial={false}>
                  {isReadingExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      {isDrawing ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                          <p className="mt-3 text-sm text-amber-400/60 font-serif-lux">TRANSLATING COEFFICIENTS...</p>
                        </div>
                      ) : (
                        <div className="prose prose-invert prose-amber mt-4 max-w-none text-left text-sm leading-relaxed text-gray-300">
                          {/* Render paragraph breaks formatted nicely */}
                          {tarotReading.split('\n\n').map((para, i) => {
                            if (para.startsWith('###') || para.startsWith('##')) {
                              const cleanPara = para.replace(/^#+\s+/, '');
                              return <h4 key={i} className="font-serif-lux mt-4 mb-2 font-bold text-amber-400 text-base">{cleanPara}</h4>;
                            }
                            return <p key={i} className="mb-3">{para}</p>;
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </section>

      {/* 2. Interactive Consultation Chatbot Panel */}
      <section className="rounded-2xl border border-gray-800 bg-[#0d0d0f] p-4 shadow-2xl md:p-6" id="consultation-chatbot">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500"></span>
              </span>
              <h3 className="font-serif-lux text-xl font-bold tracking-wide text-amber-100">Kunika Gupta's Mystic Oracle</h3>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Seeker advisory portal. Complete confidentiality secured.
            </p>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2 md:mt-0">
            <span className="rounded bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-amber-400 uppercase">
              Vedic Astrology
            </span>
            <span className="rounded bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-amber-400 uppercase">
              Intuitive Tarot
            </span>
            <span className="rounded bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-amber-400 uppercase">
              Crystal Healing
            </span>
          </div>
        </div>

        {/* Message Panel */}
        <div className="mt-4 flex h-[350px] flex-col overflow-y-auto rounded-xl bg-[#09090b]/80 p-4 border border-gray-800/40" id="chat-messages-container">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-md leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-black font-medium rounded-tr-none'
                      : 'bg-[#151518] text-gray-200 border border-gray-800/60 rounded-tl-none'
                  }`}
                >
                  {/* Spiritual response formatting */}
                  <div className="whitespace-pre-wrap">
                    {msg.sender === 'bot' ? (
                      msg.text.split('\n\n').map((para, i) => {
                        if (para.startsWith('###') || para.startsWith('##')) {
                          const clean = para.replace(/^#+\s+/, '');
                          return <div key={i} className="font-serif-lux mt-2 mb-1 font-semibold text-amber-400 text-sm">{clean}</div>;
                        }
                        return <p key={i} className="mb-2 leading-relaxed text-gray-200">{para}</p>;
                      })
                    ) : (
                      msg.text
                    )}
                  </div>
                  <span className={`block mt-1 text-[9px] ${msg.sender === 'user' ? 'text-black/60' : 'text-gray-500'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-none bg-[#151518] border border-gray-800/60 px-4 py-3 shadow-md">
                  <div className="flex items-center gap-1.5 py-1">
                    <span className="h-2 w-2 animate-bounce bg-amber-400 rounded-full" />
                    <span className="h-2 w-2 animate-bounce bg-amber-400 rounded-full [animation-delay:0.2s]" />
                    <span className="h-2 w-2 animate-bounce bg-amber-400 rounded-full [animation-delay:0.4s]" />
                    <span className="ml-2 text-[10px] text-amber-400 font-serif-lux tracking-widest animate-pulse">ALIGNING PLATES...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Suggestion tags */}
        <div className="mt-4">
          <p className="text-[10px] uppercase font-semibold tracking-wider text-amber-400/60 mb-2">✦ Suggested questions ✦</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Will my career improve soon?",
              "How can I resolve relationship discord?",
              "Which crystal is right for Pisces or Aries?",
              "Can you do a Past-Present-Future Tarot Reading?"
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => askPreset(preset)}
                className="rounded-full border border-gray-800 bg-[#121215] px-3 py-1 text-xs text-gray-300 hover:border-amber-400/40 hover:text-amber-300 transition-colors focus:outline-none"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Form */}
        <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type your question for Vedic or Tarot alignment here..."
            className="flex-1 rounded-xl border border-gray-800 bg-[#070708] px-4 py-3 text-sm text-gray-200 outline-none placeholder:text-gray-500 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/20"
            id="chat-user-textbox"
          />
          <button
            type="submit"
            disabled={isTyping || !inputVal.trim()}
            className="flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-3 text-black font-semibold hover:brightness-110 disabled:opacity-50 transition-all duration-300 shadow-[0_4px_12px_rgba(212,175,55,0.2)]"
            id="chat-send-btn"
          >
            <Send className="h-4 w-4 mr-1.5" />
            Seek
          </button>
        </form>
      </section>
    </div>
  );
}
