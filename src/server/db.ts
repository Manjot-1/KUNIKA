import fs from 'fs';
import path from 'path';

// Types for our spiritual platform database
export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerDob?: string;
  customerTob?: string;
  customerPob?: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  price: number;
  duration: number;
  status: 'Pending' | 'Approved' | 'Completed' | 'Cancelled';
  intent?: string;
  createdAt: string;
}

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

export interface Blog {
  id: string;
  title: string;
  slug: string;
  category: 'Tarot Insights' | 'Astrology Forecasts' | 'Spiritual Growth' | 'Relationship Advice' | 'Career Guidance';
  summary: string;
  content: string;
  imageUrl: string;
  readTime: string;
  publishedAt: string;
  author: string;
}

export interface Review {
  id: string;
  clientName: string;
  rating: number;
  text: string;
  serviceName: string;
  beforeState: string;
  afterState: string;
  isCompleted: boolean;
}

export interface Newsletter {
  id: string;
  email: string;
  signedUpAt: string;
}

export interface DBStructure {
  bookings: Booking[];
  products: Product[];
  blogs: Blog[];
  reviews: Review[];
  newsletters: Newsletter[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Initial seed data for the premium experience
const INITIAL_DB: DBStructure = {
  bookings: [
    {
      id: "b-101",
      customerName: "Aadhya Sharma",
      customerEmail: "aadhya@example.com",
      customerPhone: "+91 98765 43210",
      customerDob: "1994-11-23",
      customerTob: "08:45 AM",
      customerPob: "New Delhi, India",
      serviceId: "tarot-career",
      serviceName: "Career Tarot Alignment",
      date: "2026-06-22",
      time: "10:30 AM",
      price: 150,
      duration: 45,
      status: "Approved",
      intent: "Seeking clarity on whether to transition from my current corporate job to an independent consulting business next month.",
      createdAt: "2026-06-18T10:00:00Z"
    },
    {
      id: "b-102",
      customerName: "Priyanjali Sen",
      customerEmail: "priyanjali@example.com",
      customerPhone: "+91 91234 56789",
      customerDob: "1991-05-14",
      customerTob: "14:20 PM",
      customerPob: "Kolkata, India",
      serviceId: "relationship-reading",
      serviceName: "Relationship Destiny Reading",
      date: "2026-06-25",
      time: "15:00 PM",
      price: 180,
      duration: 60,
      status: "Pending",
      intent: "Wanting to look into astrological compatibility with my partner as we contemplate a December wedding.",
      createdAt: "2026-06-19T02:30:00Z"
    }
  ],
  products: [
    {
      id: "p-1",
      name: "Sovereign Amethyst Aura Tower",
      category: "Healing Towers",
      price: 85,
      stock: 12,
      description: "Hand-picked, deep violet Uruguayan Amethyst points of exceptional grade. Polished precisely to a hexagonal prism tower to act as an energy conduit. Promotes divine peace, psychic intuition, and clear dream recall.",
      image: "", // We can use the generated asset or a placeholder
      rating: 4.9,
      reviewsCount: 38,
      recommendedZodiacs: ["Pisces", "Virgo", "Aquarius"]
    },
    {
      id: "p-2",
      name: "Prisna Raw Madagascar Rose Quartz",
      category: "Raw Crystals",
      price: 45,
      stock: 24,
      description: "Large, rough, untreated chunks of beautiful translucent Rose Quartz. Unfiltered crystalline energy directly from the soil. Perfect for cultivating self-love, healing emotional wounds, and inviting gentle cosmic harmonies into spaces.",
      image: "",
      rating: 4.8,
      reviewsCount: 52,
      recommendedZodiacs: ["Taurus", "Libra", "Cancer"]
    },
    {
      id: "p-3",
      name: "Sacred Tiger's Eye Mala Bracelet",
      category: "Mala & Bracelets",
      price: 35,
      stock: 18,
      description: "Hand-knotted 108 bead mala made from chatoyant AAA-grade Tiger's Eye stones. Provides grounding energies of professional drive, personal courage, mental sharpness, and structural abundance.",
      image: "",
      rating: 5.0,
      reviewsCount: 20,
      recommendedZodiacs: ["Leo", "Gemini", "Capricorn"]
    },
    {
      id: "p-4",
      name: "Ritual Dark Moon Sombre Candle",
      category: "Ritual Candles",
      price: 29,
      stock: 30,
      description: "Soy-wax ritual candle infused with high-frequency black tourmaline chips, dried Sage, and lavender oils. Crafted on the eclipse night to clear spiritual blockages and assist in deep shadow integration.",
      image: "",
      rating: 4.7,
      reviewsCount: 15,
      recommendedZodiacs: ["Scorpio", "Capricorn", "Cancer"]
    },
    {
      id: "p-5",
      name: "Astral Brass Lapis Lazuli Pendulum",
      category: "Astral Pendulums",
      price: 55,
      stock: 8,
      description: "Perfectly balanced Lapis Lazuli crystal suspended from a gold-plated brass chain with a spiritual mandala bead. Tailored for professional dowsing, chakra diagnosis, and direct energetic responses.",
      image: "",
      rating: 4.9,
      reviewsCount: 9,
      recommendedZodiacs: ["Sagittarius", "Aquarius", "Libra"]
    }
  ],
  blogs: [
    {
      id: "post-1",
      title: "The Golden Oracle: Deciphering the Major Arcana in 2026",
      slug: "golden-oracle-major-arcana-2026",
      category: "Tarot Insights",
      summary: "Explore the cosmic shifts of 2026 under the dual influence of the Wheel of Fortune and the High Priestess. How to read your spiritual coordinates.",
      content: "As we step further into 2026, the global energetic vibration is shifting dramatically. The combination of cosmic Saturnian transits and our card alignments highlights the critical dance between structural ambition (The Emperor) and inward wisdom (The High Priestess).\n\nIn tarot reading, pulling the Empress during career alignments this year suggests a need to fertilize creative seeds slowly rather than forcing sudden actions. Major shifts are anticipated in relationships, prompting seekers to establish rigid energetic boundaries while allowing spiritual channels to remain receptive to pure alignment.",
      imageUrl: "https://picsum.photos/seed/astrology/800/500",
      readTime: "5 min read",
      publishedAt: "2026-06-15",
      author: "Kunika Gupta"
    },
    {
      id: "post-2",
      title: "Saturn Transit in Pisces: Navigating Your Career Anchors",
      slug: "saturn-transit-pisces-career-anchors",
      category: "Astrology Forecasts",
      summary: "An in-depth astrological analysis of Saturn's current voyage. How professional fields can transition from watery chaos to crystalline reality.",
      content: "Saturn's presence in Pisces creates a unique dynamic. Known as the cosmic taskmaster, Saturn demands structure, commitment, and rigid boundaries. Pisces, on the other hand, represents the infinite ocean of creativity, spiritual mysticism, and boundaries dissolved.\n\nFor professionals feeling stuck, this transition highlights a calling to build solid foundations around your creative or artistic skills. It is no longer enough to wait for inspiration; you must create daily structural containers to translate spiritual insights into career currency.",
      imageUrl: "https://picsum.photos/seed/stars/800/500",
      readTime: "7 min read",
      publishedAt: "2026-06-18",
      author: "Kunika Gupta"
    },
    {
      id: "post-3",
      title: "Crystal Alignment: Crystals to Harmonize Relationship Discord",
      slug: "crystal-alignment-relationship-harmonies",
      category: "Spiritual Growth",
      summary: "Struggling to maintain peace with loved ones? Learm how to clean, charge, and position Rose Quartz and Black Tourmaline to heal blockages.",
      content: "Every crystal possesses a native vibrational frequency. When relationships encounter frictional periods, it's often a sign of stagnant energy in the heart chakra. By combining the nurturing embrace of Rose Quartz with the protective, grounding shield of Black Tourmaline, we can create a peaceful energetic shield in the home.\n\nPlace your charged crystals at the cardinal corners of your bedroom, and sit with them for 10 minutes at twilight, visualizing golden light bridging communications between you and your partner.",
      imageUrl: "https://picsum.photos/seed/crystals/800/500",
      readTime: "4 min read",
      publishedAt: "2026-06-19",
      author: "Kunika Gupta"
    }
  ],
  reviews: [
    {
      id: "r-1",
      clientName: "Meera Nair",
      rating: 5,
      text: "Kunika's Career Tarot session provided absolute clarity during my layoff period. She didn't just predict; she gave actionable life strategies that helped me secure safety, alignment, and a 35% higher salary in an industry I love.",
      serviceName: "Career Tarot Alignment",
      beforeState: "Terrified, confused, and feeling highly stagnant in employment.",
      afterState: "Calm, strategically driven, and thriving in a senior product design position.",
      isCompleted: true
    },
    {
      id: "r-2",
      clientName: "Rohan Kapoor",
      rating: 5,
      text: "I was highly skeptical of relationship tarot. But Kunika's reading on compatibility was intensely precise. She outlined hidden communication blockages we had never discussed. It transformed how my partner and I connect.",
      serviceName: "Relationship Destiny Reading",
      beforeState: "Misunderstanding partner and on the verge of separation.",
      afterState: "Empathetic communication patterns and solid collaborative future planning.",
      isCompleted: true
    },
    {
      id: "r-3",
      clientName: "Divya Bajaj",
      rating: 5,
      text: "The customized Horoscope reading and recommended crystals changed everything. I wear the Lapis Lazuli pendant and consult with her before every major product launch. She is truly a gifted soul.",
      serviceName: "Astrology Session",
      beforeState: "Scattered creative energy and constant administrative struggles.",
      afterState: "Grounded focus, aligned workflows, and absolute energetic alignment.",
      isCompleted: true
    }
  ],
  newsletters: []
};

// Ensure the data directory exists and database is initialized
export function initDB(): DBStructure {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf8');
    return INITIAL_DB;
  }

  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(data);
    // Enforce default keys to prevent older versions crashing
    const merged = { ...INITIAL_DB, ...parsed };
    return merged;
  } catch (error) {
    console.error("Error reading database file, resetting to initial seed", error);
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf8');
    return INITIAL_DB;
  }
}

// Get full database
export function getDB(): DBStructure {
  return initDB();
}

// Save database
export function saveDB(db: DBStructure): void {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

// Core database actions
export const dbActions = {
  // Bookings
  getBookings: (): Booking[] => getDB().bookings,
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>): Booking => {
    const db = getDB();
    const newBooking: Booking = {
      ...booking,
      id: `b-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    db.bookings.unshift(newBooking);
    saveDB(db);
    return newBooking;
  },
  updateBookingStatus: (id: string, status: Booking['status']): Booking | null => {
    const db = getDB();
    const index = db.bookings.findIndex(b => b.id === id);
    if (index !== -1) {
      db.bookings[index].status = status;
      saveDB(db);
      return db.bookings[index];
    }
    return null;
  },

  // Products
  getProducts: (): Product[] => getDB().products,
  addProduct: (product: Omit<Product, 'id'>): Product => {
    const db = getDB();
    const newProduct: Product = {
      ...product,
      id: `p-${Date.now()}`
    };
    db.products.push(newProduct);
    saveDB(db);
    return newProduct;
  },
  updateProductStock: (id: string, quantity: number): Product | null => {
    const db = getDB();
    const index = db.products.findIndex(p => p.id === id);
    if (index !== -1) {
      db.products[index].stock = Math.max(0, db.products[index].stock - quantity);
      saveDB(db);
      return db.products[index];
    }
    return null;
  },

  // Blogs
  getBlogs: (): Blog[] => getDB().blogs,
  addBlog: (blog: Omit<Blog, 'id' | 'slug' | 'publishedAt'>): Blog => {
    const db = getDB();
    const slug = blog.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const newBlog: Blog = {
      ...blog,
      id: `post-${Date.now()}`,
      slug,
      publishedAt: new Date().toISOString().split('T')[0]
    };
    db.blogs.unshift(newBlog);
    saveDB(db);
    return newBlog;
  },

  // Reviews
  getReviews: (): Review[] => getDB().reviews,
  addReview: (review: Omit<Review, 'id'>): Review => {
    const db = getDB();
    const newReview: Review = {
      ...review,
      id: `r-${Date.now()}`
    };
    db.reviews.unshift(newReview);
    saveDB(db);
    return newReview;
  },

  // Newsletters
  getNewsletters: (): Newsletter[] => getDB().newsletters,
  addNewsletterEmail: (email: string): boolean => {
    const db = getDB();
    const trimmed = email.trim().toLowerCase();
    const exists = db.newsletters.some(n => n.email === trimmed);
    if (exists) return false;

    db.newsletters.push({
      id: `n-${Date.now()}`,
      email: trimmed,
      signedUpAt: new Date().toISOString()
    });
    saveDB(db);
    return true;
  }
};
