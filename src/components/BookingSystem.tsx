import React, { useState } from 'react';
import { Calendar, Clock, CreditCard, ChevronRight, CheckCircle2, MapPin, Sparkles, User, Mail, Phone, CalendarRange } from 'lucide-react';

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
  shortDesc: string;
  benefits: string[];
}

export const AVAILABLE_SERVICES: Service[] = [
  { id: "tarot-career", name: "Career Tarot Alignment", price: 150, duration: 45, category: "Tarot Reading", shortDesc: "Decipher upcoming career transits, career shifts, or financial bottlenecks under major tarot arcs.", benefits: ["Actionable transition deadlines", "Unlocking monetary blockages", "Professional shadow-work tips"] },
  { id: "relationship-reading", name: "Relationship Destiny Reading", price: 180, duration: 60, category: "Relationship Consultation", shortDesc: "In-depth compatibility analysis mapping communication traps, soul ties, and wedding alignments.", benefits: ["Astrological sync charts", "Identifying communication hurdles", "Karmic partner resolutions"] },
  { id: "marriage-consult", name: "Marriage Vedic Consultation", price: 200, duration: 60, category: "Astrology", shortDesc: "Vedic kundali matching analyzing household harmony, mutual prosperity indices, and ancestral guidelines.", benefits: ["Detailed Kundali alignment score", "Auspicious wedding date ranges", "Remedial energetic rituals"] },
  { id: "lifepath-reading", name: "Life Path & Soul Purpose Alignment", price: 160, duration: 45, category: "Life Guidance", shortDesc: "Map your birth nodes (Rahu & Ketu) to uncover past-life energetic blockages and active timelines.", benefits: ["Spiritual coordinate mapping", "Personal calling discovery", "Chakra block analysis"] },
  { id: "business-forecast", name: "Commercial & Business Forecasts", price: 250, duration: 75, category: "Life Guidance", shortDesc: "Astrological audit of brand names, incorporation dates, launch timelines, and partnership dynamics.", benefits: ["Auspicious launch dates", "Name vibration compliance", "Financial expansion cycles"] },
  { id: "astrology-session", name: "Natal Chart Comprehensive Reading", price: 140, duration: 45, category: "Astrology", shortDesc: "Comprehensive exploration of your birth planetary houses, planetary shifts, and immediate dasha effects.", benefits: ["Sovereign natal house chart map", "Dasha timeline breakdowns", "Practical gemstone alignment"] },
  { id: "emergency-consult", name: "Emergency Crisis Alignment", price: 300, duration: 30, category: "Tarot Reading", shortDesc: "Fast-tracked session scheduled within 24 hours to gain immediate direction during heavy stress/transition.", benefits: ["Priority 24hr slot booking", "Immediate core conflict clarity", "Emergency anchoring routine"] }
];

const TIME_SLOTS = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM", "06:30 PM"];

interface BookingWizardProps {
  onSuccess: () => void;
  preselectedServiceId?: string;
}

export default function BookingSystem({ onSuccess, preselectedServiceId }: BookingWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service>(
    AVAILABLE_SERVICES.find(s => s.id === preselectedServiceId) || AVAILABLE_SERVICES[0]
  );
  
  // Date/Time States
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Customer Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [pob, setPob] = useState("");
  const [intent, setIntent] = useState("");

  // Payment States
  const [isPaying, setIsPaying] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [bookingResult, setBookingResult] = useState<any>(null);

  // Auto-generate next 14 days for scheduling
  const getUpcomingDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      const dayName = nextDay.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = nextDay.getDate();
      const monthName = nextDay.toLocaleDateString('en-US', { month: 'short' });
      const formattedDate = nextDay.toISOString().split('T')[0];
      days.push({ dayName, dayNum, monthName, formattedDate });
    }
    return days;
  };
  const upcomingDays = getUpcomingDays();

  // Handle server booking create
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaying(true);

    try {
      const payload = {
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        customerDob: dob,
        customerTob: tob,
        customerPob: pob,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        date: selectedDate,
        time: selectedTime,
        price: selectedService.price,
        duration: selectedService.duration,
        intent
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        setBookingResult(data.booking);
        setStep(5);
        if (onSuccess) onSuccess();
      } else {
        alert(data.error || "An error occurred during booking sync.");
      }
    } catch (err) {
      console.error(err);
      alert("Spiritual node synchronisation failure. Please retry shortly.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
  };

  return (
    <div className="mx-auto max-w-4xl rounded-2xl border border-amber-500/10 bg-[#0c0c0e]/95 p-6 shadow-2xl md:p-8" id="booking-container-component">
      {/* 1. Header & Progress tracker */}
      <div className="flex flex-col border-b border-gray-800 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-serif-lux text-2xl font-bold tracking-wider text-amber-100">Schedule Spiritual Counsel</h2>
          <p className="mt-1 text-sm text-gray-400">Authentic tarot and planetary charts aligned to your goals.</p>
        </div>
        
        {/* Step dots */}
        <div className="mt-4 flex items-center gap-1.5 md:mt-0">
          {[
            { num: 1, label: "Services" },
            { num: 2, label: "Timeline" },
            { num: 3, label: "Coordinates" },
            { num: 4, label: "Payment" },
            { num: 5, label: "Blessed" }
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-1.5">
              <div 
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  step === s.num
                    ? 'bg-amber-500 text-black font-bold ring-4 ring-amber-500/20'
                    : step > s.num 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-gray-800 text-gray-400 border border-gray-700'
                }`}
              >
                {s.num}
              </div>
              <span className={`text-[10px] uppercase tracking-wider hidden md:inline font-semibold ${step === s.num ? 'text-amber-400' : 'text-gray-500'}`}>
                {s.label}
              </span>
              {s.num < 5 && <ChevronRight className="h-3 w-3 text-gray-700 hidden md:inline" />}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Step Views */}
      <div className="mt-8">
        
        {/* STEP 1: SELECT SERVICE */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-serif-lux text-lg font-bold text-amber-200">Select consultation format</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {AVAILABLE_SERVICES.map((srv) => (
                <div 
                  key={srv.id}
                  className={`group relative flex flex-col justify-between rounded-xl border p-5 transition-all duration-300 hover:border-amber-400/50 hover:bg-[#121215]/80 cursor-pointer ${
                    selectedService.id === srv.id 
                      ? 'border-amber-400 bg-amber-400/[0.02] shadow-[0_0_20px_rgba(212,175,55,0.08)]' 
                      : 'border-gray-800 bg-[#09090b]'
                  }`}
                  onClick={() => setSelectedService(srv)}
                  id={`booking-service-item-${srv.id}`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="rounded bg-amber-400/10 px-2 py-0.5 text-[9px] font-bold tracking-widest text-amber-400 uppercase">
                        {srv.category}
                      </span>
                      <span className="font-serif-lux text-xl font-bold text-amber-400">${srv.price}</span>
                    </div>

                    <h4 className="font-serif-lux mt-2 text-base font-semibold text-amber-100 group-hover:text-amber-300 transition-colors">
                      {srv.name}
                    </h4>
                    
                    <p className="mt-2 text-xs text-gray-400 leading-relaxed font-light">
                      {srv.shortDesc}
                    </p>

                    <ul className="mt-4 space-y-1 text-[11px] text-gray-300">
                      {srv.benefits.map((b, i) => (
                        <li key={i} className="flex items-center gap-1.5 font-light">
                          <span className="text-amber-500">✶</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-gray-800/60 pt-3 text-xs">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Clock className="h-3.5 w-3.5 text-amber-400" />
                      {srv.duration} mins
                    </span>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleServiceSelect(srv); }}
                      className="flex items-center gap-0.5 font-semibold text-amber-400 hover:text-amber-300 focus:outline-none"
                    >
                      Configure Alignment
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-black hover:brightness-105 shadow-md"
                id="booking-step1-next-btn"
              >
                Choose Timeline
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT DATE & TIME */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
              <CalendarRange className="h-5 w-5 text-amber-400" />
              <h3 className="font-serif-lux text-lg font-bold text-amber-200">Specify calendar date & active hour</h3>
            </div>

            {/* Selected Summary */}
            <div className="flex items-center justify-between rounded-xl bg-[#141418] p-4 border border-gray-800">
              <div className="text-sm">
                <span className="text-[10px] uppercase font-semibold text-amber-400 tracking-wider">SELECTED COUNSEL</span>
                <p className="font-serif-lux text-base font-semibold text-amber-100">{selectedService.name}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400">{selectedService.duration} mins</span>
                <p className="font-serif-lux text-base font-bold text-amber-400">${selectedService.price}</p>
              </div>
            </div>

            {/* Date Grid */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-amber-400">1. Available Dates</label>
              <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-800">
                {upcomingDays.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(d.formattedDate)}
                    type="button"
                    className={`flex flex-col items-center justify-center rounded-xl p-3 border min-w-[76px] transition-all duration-300 focus:outline-none ${
                      selectedDate === d.formattedDate
                        ? 'border-amber-400 bg-amber-400/5 text-amber-300 ring-2 ring-amber-400/20 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                        : 'border-gray-800 bg-[#09090b] hover:border-gray-700 text-gray-300'
                    }`}
                    id={`booking-day-${d.formattedDate}`}
                  >
                    <span className="text-[10px] uppercase text-gray-500 font-medium">{d.dayName}</span>
                    <span className="text-lg font-bold font-serif-lux my-1">{d.dayNum}</span>
                    <span className="text-[9px] uppercase tracking-wider text-amber-500/85">{d.monthName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots Grid */}
            {selectedDate && (
              <div className="space-y-3 border-t border-gray-800 pt-5 animate-fade-in">
                <label className="text-xs font-semibold uppercase tracking-wider text-amber-400">2. Available Hours (UTC+05:30 IST)</label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      type="button"
                      className={`rounded-xl border py-2.5 text-xs font-medium text-center transition-all duration-300 focus:outline-none ${
                        selectedTime === t
                          ? 'border-amber-400 bg-amber-400/5 text-amber-300 ring-2 ring-amber-400/20'
                          : 'border-gray-800 bg-[#09090b] hover:border-gray-700 text-gray-300'
                      }`}
                      id={`booking-hour-${t.replace(/\s+/g, '-')}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex items-center justify-between border-t border-gray-800/60 pt-5">
              <button
                onClick={() => setStep(1)}
                className="text-xs text-gray-400 hover:text-white font-medium focus:outline-none"
              >
                Back to Services
              </button>
              
              <button
                onClick={() => setStep(3)}
                disabled={!selectedDate || !selectedTime}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-black hover:brightness-105 disabled:opacity-50 transition-all duration-300 shadow-md"
                id="booking-step2-next-btn"
              >
                Personal Details
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PERSONAL DETAILS & ASTROLOGICAL COORDINATES */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <h3 className="font-serif-lux text-lg font-bold text-amber-200">Enter birth coordinates & details</h3>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-amber-400 tracking-wide uppercase flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> Seeker Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-gray-800 bg-[#08080a] px-4 py-3 text-sm text-gray-200 outline-none placeholder:text-gray-500 focus:border-amber-400/50"
                  id="booking-form-name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-amber-400 tracking-wide uppercase flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full rounded-xl border border-gray-800 bg-[#08080a] px-4 py-3 text-sm text-gray-200 outline-none placeholder:text-gray-500 focus:border-amber-400/50"
                  id="booking-form-email"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-amber-400 tracking-wide uppercase flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> Primary Phone (WhatsApp)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-xl border border-gray-800 bg-[#08080a] px-4 py-3 text-sm text-gray-200 outline-none placeholder:text-gray-500 focus:border-amber-400/50"
                  id="booking-form-phone"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-amber-400 tracking-wide uppercase flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Date of Birth (Vedic calculations)
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full rounded-xl border border-gray-800 bg-[#08080a] px-4 py-3 text-sm text-gray-200 outline-none placeholder:text-gray-500 focus:border-amber-400/50"
                  id="booking-form-dob"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-amber-400 tracking-wide uppercase flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Approximate Time of Birth
                </label>
                <input
                  type="text"
                  value={tob}
                  onChange={(e) => setTob(e.target.value)}
                  placeholder="e.g. 02:30 PM (or Unscheduled)"
                  className="w-full rounded-xl border border-gray-800 bg-[#08080a] px-4 py-3 text-sm text-gray-200 outline-none placeholder:text-gray-500 focus:border-amber-400/50"
                  id="booking-form-tob"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-amber-400 tracking-wide uppercase flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> Place of Birth (City, Country)
                </label>
                <input
                  type="text"
                  value={pob}
                  onChange={(e) => setPob(e.target.value)}
                  placeholder="City, State, Country"
                  className="w-full rounded-xl border border-gray-800 bg-[#08080a] px-4 py-3 text-sm text-gray-200 outline-none placeholder:text-gray-500 focus:border-amber-400/50"
                  id="booking-form-pob"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-amber-400 tracking-wide uppercase font-serif-lux">
                Current query or spiritual focus
              </label>
              <textarea
                value={intent}
                onChange={(e) => setIntent(e.target.value)}
                rows={3}
                placeholder="What career, relationship, or soul pathways are you currently navigating?"
                className="w-full rounded-xl border border-gray-800 bg-[#08080a] px-4 py-3 text-sm text-gray-200 outline-none placeholder:text-gray-500 focus:border-amber-400/50 resize-none"
                id="booking-form-intent"
              />
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center justify-between border-t border-gray-800/60 pt-5">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-gray-400 hover:text-white font-medium focus:outline-none"
              >
                Modify Timeline
              </button>
              
              <button
                type="button"
                onClick={() => setStep(4)}
                disabled={!name || !email || !phone}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-black hover:brightness-105 disabled:opacity-50 transition-all duration-300 shadow-md"
                id="booking-step3-next-btn"
              >
                Simulated Checkout
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: MOCK PAYMENT GATEWAY */}
        {step === 4 && (
          <form onSubmit={handleBookingSubmit} className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
              <CreditCard className="h-5 w-5 text-amber-400" />
              <h3 className="font-serif-lux text-lg font-bold text-amber-200">Secure Online checkout</h3>
            </div>

            {/* Price Detail */}
            <div className="rounded-xl bg-[#141418] p-5 border border-gray-800 space-y-2 text-sm leading-relaxed">
              <div className="flex justify-between">
                <span className="text-gray-400">counsel session:</span>
                <span className="text-gray-200">{selectedService.name} ({selectedService.duration}m)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date & hour:</span>
                <span className="text-amber-400 font-medium">{selectedDate} @ {selectedTime}</span>
              </div>
              <div className="border-t border-gray-800 pt-2 flex justify-between font-bold text-base mt-2">
                <span className="text-gray-200">Total charge:</span>
                <span className="text-amber-400 font-serif-lux">${selectedService.price}.00</span>
              </div>
            </div>

            {/* Mock Credit Card Fields */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-amber-400 uppercase">Cardholder Name</label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Exact name on card"
                  className="w-full rounded-xl border border-gray-800 bg-[#08080a] px-4 py-3 text-sm text-gray-200 outline-none focus:border-amber-400/50"
                  id="checkout-card-name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-amber-400 uppercase">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="w-full rounded-xl border border-gray-800 bg-[#08080a] pl-4 pr-12 py-3 text-sm text-gray-200 outline-none focus:border-amber-400/50"
                    id="checkout-card-number"
                  />
                  <CreditCard className="absolute right-4 top-3.5 h-5 w-5 text-gray-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-amber-400 uppercase">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full rounded-xl border border-gray-800 bg-[#08080a] px-4 py-3 text-sm text-gray-200 outline-none focus:border-amber-400/50 text-center"
                    id="checkout-card-expiry"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-amber-400 uppercase">CVV Code</label>
                  <input
                    type="password"
                    required
                    maxLength={3}
                    placeholder="***"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full rounded-xl border border-gray-800 bg-[#08080a] px-4 py-3 text-sm text-gray-200 outline-none focus:border-amber-400/50 text-center"
                    id="checkout-card-cvv"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex items-center justify-between border-t border-gray-800/60 pt-5">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-xs text-gray-400 hover:text-white font-medium focus:outline-none"
              >
                Exit Coordinates
              </button>
              
              <button
                type="submit"
                disabled={isPaying || !cardNumber || !cardName}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 font-semibold text-black hover:brightness-105 disabled:opacity-50 transition-all duration-300 shadow-[0_4px_12px_rgba(212,175,55,0.25)]"
                id="booking-form-submit-btn"
              >
                {isPaying ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent mr-1" />
                    Completing transaction...
                  </>
                ) : (
                  <>
                    Confirm & Transact ${selectedService.price}
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: SUCCESS ORDER */}
        {step === 5 && (
          <div className="py-8 text-center space-y-6 animate-fade-in" id="booking-success-screen">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 border border-green-500/30 text-green-500">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif-lux text-2xl font-bold tracking-wider text-amber-200">Blessings Received!</h3>
              <p className="mx-auto max-w-md text-sm text-gray-400">
                Your consultation request has been lodged successfully under reservation code <span className="text-amber-400 font-semibold">{bookingResult?.id || "N/A"}</span>.
              </p>
            </div>

            <div className="mx-auto max-w-sm rounded-xl border border-gray-800 bg-[#0e0e11] p-4 text-left text-xs space-y-2">
              <p className="font-serif-lux border-b border-gray-800 pb-2 text-center text-amber-400 font-bold tracking-wider uppercase">Reservation Summary</p>
              <div className="flex justify-between">
                <span className="text-gray-500">Service:</span>
                <span className="text-gray-300 font-medium">{bookingResult?.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Timeline:</span>
                <span className="text-amber-400 font-semibold">{bookingResult?.date} @ {bookingResult?.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Client:</span>
                <span className="text-gray-300">{bookingResult?.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Admin Status:</span>
                <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[9px] font-bold tracking-wide text-amber-300 uppercase">
                  {bookingResult?.status || "Pending Approved"}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              We have dispatched confirmation summaries to your email <span className="text-amber-400/80">{bookingResult?.customerEmail}</span> and WhatsApp coordinate. Our administrator will review and confirm alignment schedules shortly.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setSelectedDate("");
                  setSelectedTime("");
                  setIntent("");
                }}
                className="rounded-xl border border-amber-500/30 bg-[#141418] hover:bg-[#1b1b22] px-6 py-3 text-xs font-semibold text-amber-300 tracking-wider uppercase transition-colors"
                id="booking-success-reset-btn"
              >
                Schedule Another Consultation
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
