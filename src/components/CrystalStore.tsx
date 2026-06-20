import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Filter, Grid, BadgePercent, Check, X, Moon, Compass, ChevronRight, Search } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  category: 'Healing Towers' | 'Raw Crystals' | 'Mala & Bracelets' | 'Ritual Candles' | 'Astral Pendulums';
  price: number;
  stock: number;
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
  recommendedZodiacs: string[];
}

interface CrystalStoreProps {
  products: Product[];
  onRefreshProducts: () => void;
  cart: { product: Product; quantity: number }[];
  setCart: React.Dispatch<React.SetStateAction<{ product: Product; quantity: number }[]>>;
  wishlist: string[];
  setWishlist: React.Dispatch<React.SetStateAction<string[]>>;
}

const ZODIACS = [
  { name: "Aries", element: "Fire", planet: "Mars", description: "Vibrant drive, courageous action. Requires grounding." },
  { name: "Taurus", element: "Earth", planet: "Venus", description: "Loves luxury, grounding stability. Attracts abundance." },
  { name: "Gemini", element: "Air", planet: "Mercury", description: "Agile mind, communication, deep intellect." },
  { name: "Cancer", element: "Water", planet: "Moon", description: "Highly intuitive, protective, nourishing emotional depths." },
  { name: "Leo", element: "Fire", planet: "Sun", description: "Regal expression, creative charisma, supreme confidence." },
  { name: "Virgo", element: "Earth", planet: "Mercury", description: "Analytic wisdom, detail alignments, absolute clearing." },
  { name: "Libra", element: "Earth", planet: "Venus", description: "Ultimate harmony, beauty sync, peace in relationships." },
  { name: "Scorpio", element: "Water", planet: "Pluto/Mars", description: "Intense shadow integration, mysterious regeneration, power." },
  { name: "Sagittarius", element: "Air", planet: "Jupiter", description: "Philosophical vision, astral projection, endless growth." },
  { name: "Capricorn", element: "Earth", planet: "Saturn", description: "Administrative drive, structured wealth, grounding." },
  { name: "Aquarius", element: "Air", planet: "Uranus", description: "Futurism, psychic networks, cosmic wisdom." },
  { name: "Pisces", element: "Water", planet: "Neptune", description: "Astral dreams, high emotional mediumship, peace." }
];

export default function CrystalStore({ products = [], onRefreshProducts, cart, setCart, wishlist, setWishlist }: CrystalStoreProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedZodiac, setSelectedZodiac] = useState<string>("Pisces");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Cart open slide state
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Checkout Order placement states
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderReceipt, setOrderReceipt] = useState<any>(null);

  // Filter Categories list
  const categories = ["All", "Healing Towers", "Raw Crystals", "Mala & Bracelets", "Ritual Candles", "Astral Pendulums"];

  // Toggle Wishlist item
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Add Item to Cart
  const addToCart = (product: Product) => {
    setCart(prev => {
      const exists = prev.find(item => item.product.id === product.id);
      if (exists) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: Math.min(product.stock, item.quantity + 1) } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    // Shake or open cart for quick action
    setIsCartOpen(true);
  };

  // Edit quantity
  const updateQuantity = (productId: string, amount: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + amount;
        return newQty > 0 ? { ...item, quantity: Math.min(item.product.stock, newQty) } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  // Remove Item
  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Subtotal calculation
  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  // Handle Cart Checkout submit
  const handleCartCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsCheckingOut(true);

    try {
      // Create Razorpay order
      const orderRes = await fetch('/api/store/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: getSubtotal(),
          customerEmail,
          items: cart.map(i => ({ productId: i.product.id, quantity: i.quantity }))
        })
      });
      const orderData = await orderRes.json();
      if (!orderData.id) throw new Error('Failed to create order');

      const options = {
        key: (window as any).__RAZORPAY_KEY_ID__ || '',
        amount: orderData.amount,
        currency: 'INR',
        name: 'Kunika Gupta Crystal Store',
        description: `${cart.length} item(s)`,
        order_id: orderData.id,
        prefill: { name: customerName, email: customerEmail },
        theme: { color: '#C9A84C' },
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/store/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: {
                customerName,
                customerEmail,
                shippingAddress,
                items: cart.map(i => ({ productId: i.product.id, quantity: i.quantity, price: i.product.price }))
              }
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            setOrderReceipt({ transactionId: response.razorpay_payment_id, customerEmail });
            setOrderPlaced(true);
            setCart([]);
            if (onRefreshProducts) onRefreshProducts();
          } else {
            alert('Payment verification failed. Contact support.');
          }
        },
        modal: { ondismiss: () => setIsCheckingOut(false) }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Store checkout error:', err);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Horoscope recommender lookup helper
  const recommendedCrystals = products.filter(p => 
    p.recommendedZodiacs.some(z => z.toLowerCase() === selectedZodiac.toLowerCase())
  );

  // Filter listings based on categories & queries
  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-12">
      {/* 1. Astrology / Zodiac Crystal Recommendation Engine */}
      <section className="relative overflow-hidden rounded-2xl border border-amber-500/10 bg-gradient-to-r from-[#0d0d10] to-[#060608] p-6 shadow-2xl" id="horoscope-crystals">
        <div className="absolute -top-12 -left-12 -z-10 h-44 w-44 rounded-full bg-purple-500/5 blur-3xl animate-pulse" />
        
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left md:justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-500 flex items-center gap-1">
              <Compass className="h-3 w-3" /> Intuitive Alignment
            </span>
            <h3 className="font-serif-lux mt-1 text-xl font-bold tracking-wider text-amber-100 md:text-2xl">Zodiac Astral Recommendation</h3>
            <p className="mt-1 text-xs text-gray-400 max-w-lg">
              Each zodiac operates on a specific cosmic wavelength. Select your birth rashi (sign) to see which crystals align with your aura today.
            </p>
          </div>

          {/* Sign Picker Dropdown */}
          <div className="relative">
            <select
              value={selectedZodiac}
              onChange={(e) => setSelectedZodiac(e.target.value)}
              className="rounded-xl border border-amber-500/20 bg-[#141418] px-4 py-2.5 text-xs text-amber-300 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20"
              id="horoscope-sign-dropdown"
            >
              {ZODIACS.map(z => (
                <option key={z.name} value={z.name}>{z.name} ({z.element})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Zodiac Summary & Resulting Crystals */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-stretch">
          
          <div className="md:col-span-4 rounded-xl border border-amber-400/10 bg-[#121215]/60 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-serif-lux text-xl font-bold tracking-widest text-amber-200">{selectedZodiac}</span>
                <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[9px] uppercase font-semibold text-amber-400">
                  {ZODIACS.find(z => z.name === selectedZodiac)?.element} Element
                </span>
              </div>
              <p className="mt-3 text-xs text-amber-400/80 italic font-serif-lux">
                Ruling Planet: {ZODIACS.find(z => z.name === selectedZodiac)?.planet}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">
                {ZODIACS.find(z => z.name === selectedZodiac)?.description}
              </p>
            </div>
            
            <div className="mt-6 border-t border-gray-800/60 pt-3 text-[10px] text-gray-500 font-serif-lux uppercase tracking-wider">
              ✦ Certified High Vibration Selection ✦
            </div>
          </div>

          {/* Recommended Products Display */}
          <div className="md:col-span-8 flex flex-col justify-center">
            {recommendedCrystals.length === 0 ? (
              <p className="text-xs text-gray-500 italic text-center py-6">Loading recommended high-frequency clusters...</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {recommendedCrystals.map(crystal => (
                  <div key={crystal.id} className="flex gap-3 rounded-xl border border-gray-800 bg-[#09090c] p-3 hover:border-amber-400/30 transition-colors">
                    {/* Tiny crystal image placeholder/reference */}
                    <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-[#141416] border border-gray-800/40 flex items-center justify-center overflow-hidden">
                      {crystal.image ? (
                        <img src={crystal.image} alt={crystal.name} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <Moon className="h-6 w-6 text-amber-500/20" />
                      )}
                    </div>
                    
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <h4 className="text-xs font-semibold text-amber-100 line-clamp-1">{crystal.name}</h4>
                        <p className="mt-1 text-[10px] text-gray-400 line-clamp-2 leading-normal">{crystal.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-gray-800/30 pt-1.5 mt-1.5">
                        <span className="text-xs font-bold text-amber-300 font-serif-lux">₹{crystal.price}</span>
                        <button
                          onClick={() => addToCart(crystal)}
                          disabled={crystal.stock === 0}
                          className="rounded-lg bg-amber-500 px-2.5 py-1 text-[10px] font-bold text-black hover:brightness-105 disabled:opacity-50"
                        >
                          {crystal.stock > 0 ? 'Anchor' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 2. Shop Catalog Header, Category Filters & Active listings */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-900 pb-5">
          <div>
            <h3 className="font-serif-lux text-xl font-bold text-amber-100">Kunika's Crystal Store</h3>
            <p className="text-xs text-gray-400">Hand-selected, high-grade cleansing tools and ritual stones.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crystals..."
                className="w-full sm:w-64 rounded-xl border border-amber-500/30 bg-[#FAF9F6] dark:bg-[#121215] pl-9 pr-8 py-2 text-xs text-[#333333] dark:text-gray-200 placeholder-gray-500 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 shadow-md font-medium"
                id="crystal-search-input"
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-amber-600/70" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            {/* Cart trigger button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center rounded-xl bg-amber-500 p-2.5 text-black hover:brightness-105 focus:outline-none focus:ring-1 focus:ring-amber-400"
              id="header-cart-btn"
            >
              <ShoppingCart className="h-4 w-4" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-600 text-[9px] font-black text-white ring-2 ring-black">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categoric filters slider */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-900/40">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors focus:outline-none ${
                selectedCategory === c
                  ? 'bg-amber-500 text-black'
                  : 'bg-[#141417] text-gray-400 border border-gray-800 hover:border-gray-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 space-y-3" id="no-products-results">
            <Moon className="mx-auto h-8 w-8 text-amber-500/30 animate-pulse" />
            <p className="text-xs text-gray-500 uppercase tracking-widest">No sacred crystals match your criteria</p>
            <button 
              onClick={() => setSearchQuery("")}
              className="text-xs text-amber-400 hover:underline"
            >
              Clear Search Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="group relative rounded-xl border border-gray-800/80 bg-[#09090b] p-4 flex flex-col justify-between hover:border-amber-400/40 transition-all duration-300 hover:shadow-[0_4px_25px_rgba(212,175,55,0.03)]"
                id={`crystal-catalog-item-${prod.id}`}
              >
                {/* Image box */}
                <div className="relative h-44 w-full rounded-lg bg-[#141416] border border-gray-800/40 flex items-center justify-center overflow-hidden">
                  {prod.image ? (
                    <img src={prod.image} alt={prod.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                  ) : (
                    <Moon className="h-10 w-10 text-amber-500/10 transition-transform duration-700 group-hover:rotate-12" />
                  )}
                  
                  {/* Wishlist Heart overlay */}
                  <button
                    onClick={() => toggleWishlist(prod.id)}
                    className="absolute right-2.5 top-2.5 rounded-full bg-black/60 p-1.5 border border-gray-800/80 hover:bg-black text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
                  >
                    <Heart className={`h-3.5 w-3.5 ${wishlist.includes(prod.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                {/* Text content */}
                <div className="mt-4 flex-1">
                  <span className="text-[9px] uppercase font-semibold text-gray-500">{prod.category}</span>
                  <h4 className="font-serif-lux mt-1 text-sm font-semibold text-amber-200 line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {prod.name}
                  </h4>
                  <p className="mt-2 text-[11px] leading-relaxed text-gray-400 line-clamp-2 font-light">
                    {prod.description}
                  </p>
                  
                  {/* Stock count */}
                  <div className="mt-2 text-[10px]">
                    {prod.stock > 0 ? (
                      <span className="text-[#34d399]/80 font-medium">{prod.stock} crystals left</span>
                    ) : (
                      <span className="text-red-500/85 font-medium">Out of stock</span>
                    )}
                  </div>
                </div>

                {/* Price & action block */}
                <div className="mt-4 flex items-center justify-between border-t border-gray-800/40 pt-3">
                  <span className="font-serif-lux text-base font-bold text-amber-400">₹{prod.price}</span>
                  <button
                    type="button"
                    onClick={() => addToCart(prod)}
                    disabled={prod.stock === 0}
                    className="rounded-lg bg-[#141416] border border-gray-850 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:bg-amber-500 hover:text-black transition-all flex items-center gap-1.5 disabled:opacity-50"
                    id={`inventory-add-cart-${prod.id}`}
                  >
                    <ShoppingCart className="h-3 w-3" />
                    Anchor
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. DYNAMIC CART DRAWER STATE */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="shopping-cart-drawer">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md border-l border-gray-800 bg-[#0d0d10] p-6 shadow-2xl flex flex-col justify-between">
              
              {/* Drawer Top */}
              <div>
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-amber-500" />
                    <h3 className="font-serif-lux text-lg font-bold text-amber-100">Sacred Shopping Cart</h3>
                  </div>
                  <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Items container */}
                {!orderPlaced && (
                  <div className="mt-6 space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {cart.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-10 italic">Cart is empty. Select healing crystals above.</p>
                    ) : (
                      cart.map((item) => (
                        <div key={item.product.id} className="flex gap-3 rounded-lg border border-gray-800 bg-[#09090b] p-3 text-xs justify-between items-center relative">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-[#121215] rounded border border-gray-800/40 flex items-center justify-center">
                              <Moon className="h-4 w-4 text-amber-400/30" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-amber-200 line-clamp-1">{item.product.name}</h4>
                              <p className="text-[10px] text-amber-400 font-bold">₹{item.product.price} each</p>
                            </div>
                          </div>

                          {/* Quantities edit */}
                          <div className="flex items-center gap-2 border border-gray-800 rounded bg-black py-0.5 px-1.5">
                            <button onClick={() => updateQuantity(item.product.id, -1)} type="button" className="text-gray-400 hover:text-white">-</button>
                            <span className="text-xs text-gray-200 font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, 1)} type="button" className="text-gray-400 hover:text-white" disabled={item.quantity >= item.product.stock}>+</button>
                          </div>

                          {/* Delete */}
                          <button onClick={() => removeFromCart(item.product.id)} className="text-gray-500 hover:text-red-500 focus:outline-none">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Checkout Form & Total panel */}
              {cart.length > 0 && !orderPlaced && (
                <div className="border-t border-gray-800 pt-6 mt-6">
                  {/* Total summary */}
                  <div className="flex justify-between font-bold text-sm text-gray-300 mb-4 font-serif-lux">
                    <span>Cart Subtotal:</span>
                    <span className="text-amber-400 text-base font-bold">₹{getSubtotal()}</span>
                  </div>

                  {/* Customer order form */}
                  <form onSubmit={handleCartCheckout} className="space-y-3">
                    <p className="text-[10px] text-amber-400 uppercase font-semibold border-b border-gray-800 pb-1 font-serif-lux">Delivery Details</p>
                    
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Receiver Name"
                      className="w-full rounded bg-[#09090b] border border-gray-800 p-2 text-xs text-gray-200 outline-none"
                    />
                    
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Email Coordinate"
                      className="w-full rounded bg-[#09090b] border border-gray-800 p-2 text-xs text-gray-200 outline-none"
                    />

                    <input
                      type="text"
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Full Shipping Address"
                      className="w-full rounded bg-[#09090b] border border-gray-800 p-2 text-xs text-gray-200 outline-none"
                    />

                    <button
                      type="submit"
                      disabled={isCheckingOut}
                      className="w-full rounded bg-amber-500 py-3 text-xs font-bold text-black uppercase tracking-widest hover:brightness-105 disabled:opacity-50 mt-4 transition-all"
                      id="cart-submit-checkout-btn"
                    >
                      {isCheckingOut ? 'Routing payment node...' : `Transact ₹${getSubtotal()}`}
                    </button>
                  </form>
                </div>
              )}

              {/* SUCCESS MODAL REPLACEMENT IN DRAWER */}
              {orderPlaced && (
                <div className="text-center py-10 space-y-4 flex flex-col items-center justify-center h-full animate-fade-in">
                  <div className="h-10 w-10 bg-green-500/10 rounded-full border border-green-500/30 text-green-500 flex items-center justify-center">
                    <Check className="h-6 w-6" />
                  </div>
                  <h4 className="font-serif-lux text-base font-bold text-amber-200">Transaction Complete</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Thank you. Order coordinates registered under receipt code <span className="text-amber-400 font-semibold">{orderReceipt?.transactionId}</span>.
                  </p>
                  <p className="text-[10px] text-gray-500 max-w-xs leading-normal">
                    We've fired a receipt to {orderReceipt?.customerEmail}. Raw crystal items will be dispatched within 48 hours with standard purification rituals.
                  </p>
                  <button
                    onClick={() => { setOrderPlaced(false); setIsCartOpen(false); }}
                    className="rounded bg-[#141417]/80 border border-amber-500/30 px-4 py-2 mt-4 text-[10px] font-bold tracking-wider text-amber-400 uppercase"
                  >
                    Done
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
