import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiHandlers } from './src/server/apiHandlers.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000; // As required by platform constraints

app.use(express.json());

// API Endpoints
app.post('/api/tarot/chat', apiHandlers.handleTarotChat);

app.get('/api/bookings', apiHandlers.getBookings);
app.post('/api/bookings', apiHandlers.createBooking);
app.post('/api/bookings/update-status', apiHandlers.updateBookingStatus);

app.get('/api/products', apiHandlers.getProducts);
app.post('/api/products', apiHandlers.addProduct);
app.post('/api/checkout', apiHandlers.handleCheckout);

app.get('/api/blogs', apiHandlers.getBlogs);
app.post('/api/blogs', apiHandlers.addBlog);

app.get('/api/reviews', apiHandlers.getReviews);
app.post('/api/reviews', apiHandlers.addReview);

app.post('/api/newsletter', apiHandlers.handleNewsletterSignup);

// Razorpay Payment Endpoints
app.post('/api/payments/create-order', apiHandlers.createPaymentOrder);
app.post('/api/payments/verify', apiHandlers.verifyPayment);
app.post('/api/store/create-order', apiHandlers.createStoreOrder);
app.post('/api/store/verify', apiHandlers.verifyStore);

import fs from 'fs';

// Dynamic Open Graph Image Generator SVG API
app.get('/api/og', (req, res) => {
  const page = String(req.query.page || 'home').toLowerCase();
  
  let title = "CELESTIAL SANCTUARY";
  let tagline = "Premium Spiritual Consultancy & High-Frequency Healing Tools";
  
  if (page === 'services') {
    title = "SPIRITUAL CONSULTATIONS";
    tagline = "Astrology Forecasts, Divine Guidance & Tarot Alignments";
  } else if (page === 'store') {
    title = "CELESTIAL CRYSTAL STORE";
    tagline = "High-Vibrational Crystals & Charged Ascension Tools";
  } else if (page === 'testimonials') {
    title = "SEEKERS' TESTIMONIALS";
    tagline = "Illuminated Paths & Sacred Success Stories of Seekers";
  } else if (page === 'about') {
    title = "MEET KUNIKA GUPTA";
    tagline = "Hold Space as an Intuitive Guide Into Your Ascension";
  } else if (page === 'oracle') {
    title = "ASCENDED ORACLE AI";
    tagline = "Engage in Guided Cosmic Dialogues & Alignment Advice";
  } else if (page === 'blog') {
    title = "CELESTIAL BLOG & INSPIRATION";
    tagline = "Sacred Wisdom, Planetary Configurations, & Daily Ascension Tips";
  } else if (page === 'resources') {
    title = "DIVINE RESOURCES & TOOLS";
    tagline = "Complimentary Alignment Guides, Daily Organizers & Astro Tools";
  } else if (page === 'contact') {
    title = "CONNECT IN SACRED LIGHT";
    tagline = "Initiate Bookings, Divine Custom Sessions & Communal Inquiries";
  } else if (page === 'admin') {
    title = "ORACLE EXECUTIVE PORTAL";
    tagline = "Sanctuary Booking Management & Sacred Database Portal";
  }

  // Generate a beautiful luxury-gold themed SVG
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
    <!-- Starry Night Background -->
    <rect width="1200" height="630" fill="#09090C" />
    <radialGradient id="bg-glow" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#1A1813" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#09090C" stop-opacity="1"/>
    </radialGradient>
    <rect width="1200" height="630" fill="url(#bg-glow)" />

    <!-- Subtle Astrological Ring Orbits -->
    <circle cx="600" cy="315" r="450" fill="none" stroke="#C9A84C" stroke-width="1" stroke-opacity="0.05" />
    <circle cx="600" cy="315" r="300" fill="none" stroke="#C9A84C" stroke-width="1" stroke-opacity="0.08" stroke-dasharray="10 15" />
    <circle cx="600" cy="315" r="180" fill="none" stroke="#C9A84C" stroke-width="1" stroke-opacity="0.1" />

    <!-- Sparkles and Ambient Stars -->
    <g opacity="0.4">
      <!-- Top Left -->
      <circle cx="200" cy="150" r="1.5" fill="#FFF" />
      <circle cx="350" cy="100" r="1" fill="#C9A84C" />
      <circle cx="150" cy="400" r="2" fill="#FFF" />
      <!-- Top Right -->
      <circle cx="1000" cy="120" r="1.5" fill="#C9A84C" />
      <circle cx="850" cy="180" r="2" fill="#FFF" />
      <circle cx="1050" cy="380" r="1" fill="#FFF" />
      <!-- Bottom Left -->
      <circle cx="250" cy="500" r="1.5" fill="#C9A84C" />
      <circle cx="400" cy="530" r="1" fill="#FFF" />
      <!-- Bottom Right -->
      <circle cx="950" cy="520" r="2" fill="#FFF" />
      <circle cx="800" cy="480" r="1.5" fill="#C9A84C" />
    </g>

    <!-- Outer Golden Borders -->
    <rect x="40" y="40" width="1120" height="550" rx="16" fill="none" stroke="#C9A84C" stroke-width="2" stroke-opacity="0.5" />
    <rect x="52" y="52" width="1096" height="526" rx="12" fill="none" stroke="#C9A84C" stroke-width="1" stroke-opacity="0.15" />

    <!-- Four Corner Celestial Accents -->
    <g transform="translate(75, 75)">
      <path d="M-12,0 Q0,0 0,-12 Q0,0 12,0 Q0,0 0,12 Q0,0 -12,0 Z" fill="#C9A84C" />
      <circle cx="0" cy="0" r="2" fill="#FFF" />
    </g>
    <g transform="translate(1125, 75)">
      <path d="M-12,0 Q0,0 0,-12 Q0,0 12,0 Q0,0 0,12 Q0,0 -12,0 Z" fill="#C9A84C" />
      <circle cx="0" cy="0" r="2" fill="#FFF" />
    </g>
    <g transform="translate(75, 555)">
      <path d="M-12,0 Q0,0 0,-12 Q0,0 12,0 Q0,0 0,12 Q0,0 -12,0 Z" fill="#C9A84C" />
      <circle cx="0" cy="0" r="2" fill="#FFF" />
    </g>
    <g transform="translate(1125, 555)">
      <path d="M-12,0 Q0,0 0,-12 Q0,0 12,0 Q0,0 0,12 Q0,0 -12,0 Z" fill="#C9A84C" />
      <circle cx="0" cy="0" r="2" fill="#FFF" />
    </g>

    <!-- Decorative Top Diamond Seal -->
    <g transform="translate(600, 140)">
      <path d="M-20,0 L0,-20 L20,0 L0,20 Z" fill="none" stroke="#C9A84C" stroke-width="1.5" stroke-opacity="0.7" />
      <circle r="6" fill="#C9A84C" />
      <path d="M-50,0 L-30,0" stroke="#C9A84C" stroke-width="1" stroke-opacity="0.5" />
      <path d="M30,0 L50,0" stroke="#C9A84C" stroke-width="1" stroke-opacity="0.5" />
    </g>

    <!-- Typography -->
    <text x="600" y="225" font-family="'Cinzel', 'Georgia', serif" font-size="16" font-weight="600" fill="#EAE4D5" text-anchor="middle" letter-spacing="8" opacity="0.85">✧ KUNIKA GUPTA ✧</text>
    
    <text x="600" y="325" font-family="'Cinzel', 'Georgia', serif" font-size="44" font-weight="700" fill="#C9A84C" text-anchor="middle" letter-spacing="5">
      ${title}
    </text>

    <text x="600" y="415" font-family="'Montserrat', 'Helvetica', sans-serif" font-size="16" fill="#C4B5A0" text-anchor="middle" letter-spacing="2" font-weight="500">
      ${tagline}
    </text>

    <!-- Decorative Bottom Divider Line with Sun Motif -->
    <g transform="translate(600, 485)" opacity="0.6">
      <line x1="-150" y1="0" x2="150" y2="0" stroke="#C9A84C" stroke-width="1" />
      <circle r="14" fill="#09090C" stroke="#C9A84C" stroke-width="1.5" />
      <circle r="8" fill="#C9A84C" />
      <path d="M0,-12 L0,12 M-12,0 L12,0" stroke="#C9A84C" stroke-width="1" />
    </g>

    <!-- Footer Note -->
    <text x="600" y="535" font-family="'Montserrat', sans-serif" font-size="11" fill="#8E8577" text-anchor="middle" letter-spacing="1">PREMIUM ASTROLOGY, TAROT READING &amp; HEALING CRYSTALS SANCTUARY</text>
  </svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.send(svg);
});

// Helper for dynamic SEO tag population
function getSeoMetadata(urlPath: string, host: string) {
  const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const defaultMeta = {
    title: "Kunika Gupta — Premium Spiritual Consultant & Crystal Store",
    description: "Step into a sacred space of cosmic guidance, astrological alignment, custom tarot reading, and high-frequency healing crystals curated by Kunika.",
    ogImage: `${baseUrl}/api/og?page=home`
  };

  const cleanPath = urlPath.split('?')[0].replace(/^\/|\/$/g, '').toLowerCase();

  switch (cleanPath) {
    case '':
    case 'home':
      return defaultMeta;
    case 'services':
      return {
        title: "Spiritual Consultations & Astrology Services — Kunika Gupta",
        description: "Explore a sanctuary of personalized Tarot card reading, astrology forecasting, crystal guidance, and divine alignment consultations.",
        ogImage: `${baseUrl}/api/og?page=services`
      };
    case 'store':
      return {
        title: "Celestial Crystals & Sacred Store — Kunika Gupta",
        description: "Sustain your vibration. Acquire certified celestial crystals, charged spiritual jewelry, and premium energetic tools curated for ascension.",
        ogImage: `${baseUrl}/api/og?page=store`
      };
    case 'testimonials':
      return {
        title: "Seekers' Success & Testimonials — Kunika Gupta",
        description: "Read divine testimonials from seekers around the globe whose paths have been illuminated by Kunika's spiritual consultancy.",
        ogImage: `${baseUrl}/api/og?page=testimonials`
      };
    case 'about':
      return {
        title: "Meet Kunika Gupta — Premium Spiritual Consultant",
        description: "Learn about Kunika's spiritual path, sacred masteries, and her mission to hold space as an intuitive guide for seekers entering ascension.",
        ogImage: `${baseUrl}/api/og?page=about`
      };
    case 'oracle':
      return {
        title: "Ascended Oracle AI — Guided Cosmic Chat",
        description: "Engage with our Ascended Oracle. Ask questions about your astrological alignments, tarot insights, or crystal curation needs.",
        ogImage: `${baseUrl}/api/og?page=oracle`
      };
    case 'blog':
      return {
        title: "Celestial Insights & Spiritual Blog — Kunika Gupta",
        description: "Peruse celestial articles, moon cycles forecasting, astrological updates, and step-by-step masterclasses on keeping high vibrations.",
        ogImage: `${baseUrl}/api/og?page=blog`
      };
    case 'resources':
      return {
        title: "Divine Ascension Resources & Tools — Kunika Gupta",
        description: "Download complimentary sacred templates, crystal alignment guides, daily spiritual organizers, and planetary tracking lists.",
        ogImage: `${baseUrl}/api/og?page=resources`
      };
    case 'contact':
      return {
        title: "Connect in Sacred Light — Contact Kunika Gupta",
        description: "Schedule your next divine session, send inquiries, or join our community of celestial searchers with Kunika today.",
        ogImage: `${baseUrl}/api/og?page=contact`
      };
    case 'admin':
      return {
        title: "Oracle Sanctuary Administration Portal",
        description: "Administrative panel for booking management, blog postings, and crystal sanctuary cataloguing.",
        ogImage: `${baseUrl}/api/og?page=admin`
      };
    default:
      return defaultMeta;
  }
}

const distPath = path.join(__dirname, 'dist');

async function setupRoutingAndStart() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });

    // Custom middleware to inject Razorpay Key ID in Dev mode
    app.use(async (req, res, next) => {
      if (req.method === 'GET' && (req.path === '/' || req.path === '/index.html')) {
        try {
          const indexPath = path.join(__dirname, 'index.html');
          if (fs.existsSync(indexPath)) {
            let template = fs.readFileSync(indexPath, 'utf-8');
            template = await vite.transformIndexHtml(req.url, template);
            template = template.replace('%RAZORPAY_KEY_ID%', process.env.RAZORPAY_KEY_ID || '');
            res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
            return;
          }
        } catch (err) {
          next(err);
          return;
        }
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));

    // Catch-all to support SPA Router navigation with dynamic META injection
    app.get('*', (req, res) => {
      let indexPath = path.join(distPath, 'index.html');
      if (!fs.existsSync(indexPath)) {
        indexPath = path.join(__dirname, 'index.html');
      }

      fs.readFile(indexPath, 'utf8', (err, html) => {
        if (err) {
          console.error("[SEO Server Error]", err);
          return res.sendFile(indexPath);
        }

        const host = req.get('host') || 'localhost:3000';
        const seo = getSeoMetadata(req.path, host);

        // Replace the default static title
        let transformedHtml = html.replace(
          /<title>.*?<\/title>/i,
          `<title>${seo.title}</title>`
        );

        // Dynamic Meta Tags blocks for SEO & Open Graph (OG) representation
        const metaTags = `
        <!-- Dynamic SEO Optimization -->
        <meta name="description" content="${seo.description}" />
        <meta property="og:title" content="${seo.title}" />
        <meta property="og:description" content="${seo.description}" />
        <meta property="og:image" content="${seo.ogImage}" />
        <meta property="og:image:type" content="image/svg+xml" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${seo.title}" />
        <meta name="twitter:description" content="${seo.description}" />
        <meta name="twitter:image" content="${seo.ogImage}" />
        <link rel="canonical" href="${req.protocol}://${host}${req.path}" />
        `;

        // Inject before the end of the <head> tag
        transformedHtml = transformedHtml.replace('</head>', `${metaTags}\n</head>`);
        
        // Dynamic replacement of %RAZORPAY_KEY_ID% placeholder under production
        transformedHtml = transformedHtml.replace('%RAZORPAY_KEY_ID%', process.env.RAZORPAY_KEY_ID || '');

        res.setHeader('Content-Type', 'text/html');
        res.send(transformedHtml);
      });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Sacred Server] Operating live on port ${PORT}`);
  });
}

setupRoutingAndStart().catch(err => {
  console.error("Failed to start Sacred Server:", err);
});
