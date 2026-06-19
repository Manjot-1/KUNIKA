import { createClient } from '@supabase/supabase-js';

// Define unified structures matching the application's types
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

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'Client' | 'Seeker' | 'Host' | 'Admin';
  dob?: string;
  tob?: string;
  pob?: string;
  zodiacSign?: string;
  createdAt: string;
}

// Memory block fallback in case Supabase keys are not set yet
const fallbackDb = {
  bookings: [] as Booking[],
  products: [] as Product[],
  users: [] as User[]
};

let supabaseInstance: any = null;

/**
 * Lazily retrieves the Supabase client safely from client or server environment context.
 */
export function getSupabase() {
  if (supabaseInstance) return supabaseInstance;

  // Retrieve variables with support for both Browser (import.meta.env) and Node (process.env)
  let supabaseUrl = '';
  let supabaseAnonKey = '';

  try {
    if (typeof window !== 'undefined') {
      const metaEnv = (import.meta as any).env || {};
      supabaseUrl = (metaEnv.VITE_SUPABASE_URL || '') as string;
      supabaseAnonKey = (metaEnv.VITE_SUPABASE_ANON_KEY || '') as string;
    } else {
      supabaseUrl = (process.env?.VITE_SUPABASE_URL || process.env?.SUPABASE_URL || '') as string;
      supabaseAnonKey = (process.env?.VITE_SUPABASE_ANON_KEY || process.env?.SUPABASE_ANON_KEY || '') as string;
    }
  } catch (e) {
    // Avoid crashing in strict or isolated compiler environments
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "✧ SUPABASE ALERT: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing. App is defaulting to simulated in-memory storage. Specify them in credentials settings to synchronize securely."
    );
    return null;
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    return supabaseInstance;
  } catch (error) {
    console.error("✧ Failed to initialize Supabase client:", error);
    return null;
  }
}

// Ensure unique string identifier formatting
const generateId = (prefix: string) => `${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;

/**
 * SECURE CRUD SERVICE INTERFACE
 */
export const supabaseDb = {
  // ==========================================
  // BOOKINGS CRUD SERVICES
  // ==========================================
  async getBookings(): Promise<Booking[]> {
    const client = getSupabase();
    if (!client) {
      return [...fallbackDb.bookings];
    }
    const { data, error } = await client
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase getBookings error:", error.message);
      return [...fallbackDb.bookings];
    }
    return data as Booking[];
  },

  async createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
    const client = getSupabase();
    const newBooking: Booking = {
      ...booking,
      id: generateId('b'),
      createdAt: new Date().toISOString()
    };

    if (!client) {
      fallbackDb.bookings.unshift(newBooking);
      return newBooking;
    }

    const { data, error } = await client
      .from('bookings')
      .insert([newBooking])
      .select();

    if (error) {
      console.error("Supabase createBooking error:", error.message);
      fallbackDb.bookings.unshift(newBooking);
      return newBooking;
    }
    return data[0] as Booking;
  },

  async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking | null> {
    const client = getSupabase();
    if (!client) {
      const idx = fallbackDb.bookings.findIndex(b => b.id === id);
      if (idx !== -1) {
        fallbackDb.bookings[idx].status = status;
        return fallbackDb.bookings[idx];
      }
      return null;
    }

    const { data, error } = await client
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) {
      console.error("Supabase updateBookingStatus error:", error.message);
      return null;
    }
    return data[0] as Booking;
  },

  async deleteBooking(id: string): Promise<void> {
    const client = getSupabase();
    if (!client) {
      fallbackDb.bookings = fallbackDb.bookings.filter(b => b.id !== id);
      return;
    }

    const { error } = await client
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase deleteBooking error:", error.message);
    }
  },

  // ==========================================
  // PRODUCTS CRUD SERVICES
  // ==========================================
  async getProducts(): Promise<Product[]> {
    const client = getSupabase();
    if (!client) {
      return [...fallbackDb.products];
    }
    const { data, error } = await client
      .from('products')
      .select('*');

    if (error) {
      console.error("Supabase getProducts error:", error.message);
      return [...fallbackDb.products];
    }
    return data as Product[];
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const client = getSupabase();
    const newProduct: Product = {
      ...product,
      id: generateId('p')
    };

    if (!client) {
      fallbackDb.products.push(newProduct);
      return newProduct;
    }

    const { data, error } = await client
      .from('products')
      .insert([newProduct])
      .select();

    if (error) {
      console.error("Supabase createProduct error:", error.message);
      fallbackDb.products.push(newProduct);
      return newProduct;
    }
    return data[0] as Product;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product | null> {
    const client = getSupabase();
    if (!client) {
      const idx = fallbackDb.products.findIndex(p => p.id === id);
      if (idx !== -1) {
        fallbackDb.products[idx] = { ...fallbackDb.products[idx], ...product };
        return fallbackDb.products[idx];
      }
      return null;
    }

    const { data, error } = await client
      .from('products')
      .update(product)
      .eq('id', id)
      .select();

    if (error) {
      console.error("Supabase updateProduct error:", error.message);
      return null;
    }
    return data[0] as Product;
  },

  async deleteProduct(id: string): Promise<void> {
    const client = getSupabase();
    if (!client) {
      fallbackDb.products = fallbackDb.products.filter(p => p.id !== id);
      return;
    }

    const { error } = await client
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase deleteProduct error:", error.message);
    }
  },

  // ==========================================
  // USERS CRUD SERVICES
  // ==========================================
  async getUsers(): Promise<User[]> {
    const client = getSupabase();
    if (!client) {
      return [...fallbackDb.users];
    }
    const { data, error } = await client
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase getUsers error:", error.message);
      return [...fallbackDb.users];
    }
    return data as User[];
  },

  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const client = getSupabase();
    const newUser: User = {
      ...user,
      id: generateId('u'),
      createdAt: new Date().toISOString()
    };

    if (!client) {
      fallbackDb.users.unshift(newUser);
      return newUser;
    }

    const { data, error } = await client
      .from('users')
      .insert([newUser])
      .select();

    if (error) {
      console.error("Supabase createUser error:", error.message);
      fallbackDb.users.unshift(newUser);
      return newUser;
    }
    return data[0] as User;
  },

  async updateUser(id: string, user: Partial<User>): Promise<User | null> {
    const client = getSupabase();
    if (!client) {
      const idx = fallbackDb.users.findIndex(u => u.id === id);
      if (idx !== -1) {
        fallbackDb.users[idx] = { ...fallbackDb.users[idx], ...user };
        return fallbackDb.users[idx];
      }
      return null;
    }

    const { data, error } = await client
      .from('users')
      .update(user)
      .eq('id', id)
      .select();

    if (error) {
      console.error("Supabase updateUser error:", error.message);
      return null;
    }
    return data[0] as User;
  },

  async deleteUser(id: string): Promise<void> {
    const client = getSupabase();
    if (!client) {
      fallbackDb.users = fallbackDb.users.filter(u => u.id !== id);
      return;
    }

    const { error } = await client
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Supabase deleteUser error:", error.message);
    }
  }
};
