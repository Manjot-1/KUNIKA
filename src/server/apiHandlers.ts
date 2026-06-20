import { GoogleGenAI } from "@google/genai";
import { dbActions, Booking, Product, Blog, Review } from "./db.ts";
import Razorpay from "razorpay";
import crypto from "crypto";

let razorpayInstance: Razorpay | null = null;
function getRazorpay(): Razorpay {
  if (razorpayInstance) return razorpayInstance;
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    console.warn("RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured. Running in unconfigured Razorpay fallback mode.");
    throw new Error("RAZORPAY_CREDENTIALS_MISSING");
  }
  // @ts-ignore
  razorpayInstance = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
  return razorpayInstance;
}

// Helper for lazy loading the Gemini client and preventing crashes if the API key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (aiClient) return aiClient;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY is not configured or uses placeholder. System will run in spiritual simulator fallback mode.");
    throw new Error("GEMINI_API_KEY_MISSING");
  }

  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
  return aiClient;
}

// System Instruction for Kunika Gupta's Spiritual Consultation Oracle
const KUNIKA_SYSTEM_INSTRUCTION = `You are 'Kunika Gupta'—a world-class certified spiritual consultant, intuitive Tarot card reader, and modern astrologer. You possess over a decade of professional counseling experience. Your branding is highly professional, warm, empathetic, luxurious, and spiritually grounded.

Your mission is to provide deeply personalized, secure, and constructive spiritual alignments to readers.

When interacting with seekers:
1. Speak with comforting, objective wisdom. Your tone is supportive, elegant, and intellectually grounded rather than abstract or vague.
2. If asked to do a Tarot reading: Draw three cards (e.g., Past, Present, Future) and describe their symbolic archetypes. Provide custom guidance on how they apply to the seeker's relationship, career, or spiritual path.
3. If asked about astrology or Vedic charts: Ask/reference their birth details (Zodiac sign, Birth Date, Time, and Location) and explain how current planetary configurations and transits relate to their inquiry.
4. When appropriate, recommend spiritual products or crystals from Kunika's store to balance their workspace or aura:
   - "Sovereign Amethyst Aura Tower" for healing, sleep, dream recall, and crown chakra alignment. Recommended for Pisces, Virgo, Aquarius.
   - "Prisna Raw Madagascar Rose Quartz" for self-love, trauma healing, and relationships. Recommended for Taurus, Libra, Cancer.
   - "Sacred Tiger's Eye Mala Bracelet" for grounding, business prosperity, and courage. Recommended for Leo, Gemini, Capricorn.
   - "Ritual Dark Moon Sombre Candle" for protective cleansing, shadow-work, and meditation. Recommended for Scorpio, Capricorn, Cancer.
   - "Astral Brass Lapis Lazuli Pendulum" for professional dowsing, chakra alignment, and throat chakra insights. Recommended for Sagittarius, Aquarius, Libra.
5. Provide actionable strategies next steps. Frame every reading constructively.
6. Keep responses elegant, using structural Markdown (such as headers, bullet points, and blockquotes) to ensure professional spacing and premium Apple-style readability. Avoid using emojis excessively (use them elegantly like ✧ or ✶ for spiritual dividers).`;

// Unified API response orchestrator
export const apiHandlers = {
  // 1. Tarot Chat Endpoint
  handleTarotChat: async (req: any, res: any) => {
    try {
      const { message, chatHistory } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Pre-formatting prompt to reinforce spiritual context if history is empty
      const userMessage = message.trim();

      try {
        const ai = getGeminiClient();

        // Convert the simple chat history format to the format Gemini expects
        const contents = [];
        if (chatHistory && Array.isArray(chatHistory)) {
          for (const msg of chatHistory) {
            contents.push({
              role: msg.sender === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text }]
            });
          }
        }

        // Add the current message
        contents.push({
          role: 'user',
          parts: [{ text: userMessage }]
        });

        // Multi-tiered backup strategy to protect against temporary model demands (e.g. 503 Service Unavailable)
        let response;
        try {
          response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: contents,
            config: {
              systemInstruction: KUNIKA_SYSTEM_INSTRUCTION,
              temperature: 0.85,
            }
          });
        } catch (primaryError: any) {
          // If we had a key issue, immediately pass to the simulation fallback
          if (primaryError.message === "GEMINI_API_KEY_MISSING") {
            throw primaryError;
          }
          console.warn("Primary model 'gemini-3.5-flash' unavailable or in high demand. Trying backup model 'gemini-3.1-flash-lite'...");
          response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: contents,
            config: {
              systemInstruction: KUNIKA_SYSTEM_INSTRUCTION,
              temperature: 0.85,
            }
          });
        }

        const reply = response.text || "Your spiritual waters are calm. Ask again shortly.";
        return res.json({ reply });

      } catch (geminiError: any) {
        console.error("Gemini invocation failed, falling back to spiritual simulator:", geminiError);

        // Spiritual Simulator Fallback: If no API key is set, keep the app completely working with high-quality spiritual readings
        const lowerMsg = userMessage.toLowerCase();
        let fallbackReply = `✧ **Welcome to Kunika Gupta's Spiritual Sanctuary** ✧\n\n`;

        if (lowerMsg.includes('career') || lowerMsg.includes('job') || lowerMsg.includes('business') || lowerMsg.includes('money')) {
          fallbackReply += `Your professional transit is currently under the grounding influence of the **King of Pentacles (Reversed)** coupled with a supportive Saturnian alignment.\n\n### Career Dynamics:\n* **The Alignment**: The King of Pentacles suggests that you already possess the administrative blueprints for your success. However, fear of committing capital or entering the unknown is acting as a vibrational barrier.\n* **The Astrological Core**: Your planetary transits suggest an impending harvest. Focus on establishing core professional habits between now and the next quarter.\n\n### Aligned Crystal Remedy:\nI highly suggest placing a **Sacred Tiger's Eye Mala Bracelet** on your desk. This will help ground your anxiety, clear financial blockages, and instill professional courage as you step forward. \n\n*Would you like to book a complete **Career Tarot Consultation** to mapping this out safely?*`;
        } else if (lowerMsg.includes('relationship') || lowerMsg.includes('love') || lowerMsg.includes('marry') || lowerMsg.includes('marriage') || lowerMsg.includes('partner')) {
          fallbackReply += `The cards pulled from the celestial field reveal **The Lovers** paired with the soft harmony of **Two of Cups**.\n\n### Relationship Insights:\n* **The Message**: Current discords are not signs of misalignment, but are opportunities for deep emotional restructuring. There is a sacred bridge waiting to be activated once you release defensive conversational armor.\n* **Action Steps**: Speak with full honesty and let your vulnerabilities become your cooperative strengths.\n\n### Healing Crystal Recommendation:\nSit with **Prisna Raw Madagascar Rose Quartz** in your living room. It acts as an energetic conduit to release stagnant friction in the heart chakra and invite back gentle warmth.\n\n*Perhaps a 45-minute **Relationship Destiny Reading** would give you and your partner the sacred blueprint you need.*`;
        } else if (lowerMsg.includes('crystal') || lowerMsg.includes('stone') || lowerMsg.includes('store')) {
          fallbackReply += `### Spiritual Crystal Harmonization:\nCrystals are powerful energetic conduits. When choosing a crystal, allow your intuition to guide you:\n\n1. ✶ **Sovereign Amethyst Aura Tower**: Best for crown chakra activation, calming hyperactive thought patterns, and accessing dreams.\n2. ✶ **Prisna Raw Madagascar Rose Quartz**: Perfect to clear emotional gridlocks and invite warm, therapeutic love frequencies.\n3. ✶ **Sacred Tiger's Eye Mala Bracelet**: Ideal for grounding, professional security, and activating masculine drive.\n\n*Feel free to browse our **Crystal Store** tab! Which energetic area are you hoping to nourish today?*`;
        } else {
          fallbackReply += `The cosmic field is currently realigning in response to your energy. You have queried about your soul path.\n\n### Spiritual Forecast:\n* **The Outlook**: The Wheel of Fortune appears upright. You are in a crucible period of transition where current discomforts look formidable, but they are preparing your aura for immense spiritual and mental maturity.\n* **The Wisdom**: Do not fear the dissolution of the old structure; it must make space for the divine blueprint.\n\n### Aligned Crystals:\nKeep a **Sovereign Amethyst Aura Tower** on your side-table to expand your psychic channel and allow high-frequency sleep.\n\n*Would you like to explore this deeply in a personal **Life Path Tarot & Astrology** session?*`;
        }

        return res.json({
          reply: fallbackReply,
          isFallback: true,
          notice: "Spiritual Oracle operating in secure offline-mode."
        });
      }
    } catch (err) {
      console.error("Fatal API route error:", err);
      return res.status(500).json({ error: "Something went wrong in the mystic oracle" });
    }
  },

  // 2. Bookings CRUD
  getBookings: (req: any, res: any) => {
    return res.json(dbActions.getBookings());
  },

  createBooking: (req: any, res: any) => {
    try {
      const { customerName, customerEmail, customerPhone, customerDob, customerTob, customerPob, serviceId, serviceName, date, time, price, duration, intent } = req.body;

      if (!customerName || !customerEmail || !customerPhone || !serviceId || !date || !time) {
        return res.status(400).json({ error: "Required details are missing for booking." });
      }

      const bookingData = {
        customerName,
        customerEmail,
        customerPhone,
        customerDob,
        customerTob,
        customerPob,
        serviceId,
        serviceName,
        date,
        time,
        price: Number(price) || 120,
        duration: Number(duration) || 45,
        status: 'Pending' as const,
        intent
      };

      const newBooking = dbActions.addBooking(bookingData);
      return res.status(201).json({
        success: true,
        message: "Booking requested with infinite blessings. Waiting for administrative approval.",
        booking: newBooking
      });
    } catch (err) {
      return res.status(500).json({ error: "Failed to schedule booking." });
    }
  },

  updateBookingStatus: (req: any, res: any) => {
    try {
      const { id, status } = req.body;
      if (!id || !status) {
        return res.status(400).json({ error: "Booking ID and target status are required." });
      }

      const updated = dbActions.updateBookingStatus(id, status);
      if (updated) {
        return res.json({ success: true, booking: updated });
      } else {
        return res.status(404).json({ error: `Booking with ID ${id} not found.` });
      }
    } catch (err) {
      return res.status(500).json({ error: "Failed to update booking status." });
    }
  },

  // 3. Products Store
  getProducts: (req: any, res: any) => {
    return res.json(dbActions.getProducts());
  },

  addProduct: (req: any, res: any) => {
    try {
      const { name, category, price, stock, description, image, rating, recommendedZodiacs } = req.body;
      if (!name || !category || !price || !description) {
        return res.status(400).json({ error: "Required fields name, category, price, and description are missing." });
      }

      const product = dbActions.addProduct({
        name,
        category,
        price: Number(price),
        stock: Number(stock) || 10,
        description,
        image: image || "",
        rating: Number(rating) || 5.0,
        reviewsCount: 0,
        recommendedZodiacs: recommendedZodiacs || []
      });

      return res.status(201).json({ success: true, product });
    } catch (err) {
      return res.status(500).json({ error: "Failed to publish product." });
    }
  },

  // 4. Simulated Checkout for E-commerce Cart
  handleCheckout: (req: any, res: any) => {
    try {
      const { items, customerDetails, paymentMethod } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Cart is empty." });
      }

      if (!customerDetails || !customerDetails.name || !customerDetails.email) {
        return res.status(400).json({ error: "Customer email and name are required for checkout." });
      }

      // Process inventory reduction
      for (const item of items) {
        if (item.id) {
          dbActions.updateProductStock(item.id, Number(item.quantity) || 1);
        }
      }

      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return res.json({
        success: true,
        message: "Order placed successfully! Divine crystals are preparing to ship.",
        transactionId,
        orderDate: new Date().toISOString(),
        customerEmail: customerDetails.email,
        paymentStatus: "paid",
        shippingAddress: customerDetails.address || "Digital Aura Delivery"
      });
    } catch (err) {
      return res.status(500).json({ error: "Failed to route simulated transaction." });
    }
  },

  // 5. Blogs Editorial
  getBlogs: (req: any, res: any) => {
    return res.json(dbActions.getBlogs());
  },

  addBlog: (req: any, res: any) => {
    try {
      const { title, category, summary, content, imageUrl, readTime, author } = req.body;
      if (!title || !category || !content) {
        return res.status(400).json({ error: "Title, category, and content are required." });
      }

      const blog = dbActions.addBlog({
        title,
        category,
        summary: summary || "Spiritual alignment insight.",
        content,
        imageUrl: imageUrl || "https://picsum.photos/seed/defaultmagic/800/500",
        readTime: readTime || "4 min read",
        author: author || "Kunika Gupta"
      });

      return res.status(201).json({ success: true, blog });
    } catch (err) {
      return res.status(500).json({ error: "Failed to publish blog post." });
    }
  },

  // 6. Reviews/Testimonials
  getReviews: (req: any, res: any) => {
    return res.json(dbActions.getReviews());
  },

  addReview: (req: any, res: any) => {
    try {
      const { clientName, rating, text, serviceName, beforeState, afterState } = req.body;
      if (!clientName || !rating || !text) {
        return res.status(400).json({ error: "Name, rating, and feedback review are required." });
      }

      const review = dbActions.addReview({
        clientName,
        rating: Number(rating) || 5,
        text,
        serviceName: serviceName || "General Consultation",
        beforeState: beforeState || "Scattered, seeking direction.",
        afterState: afterState || "Inner peace, clear cosmic alignment.",
        isCompleted: true
      });

      return res.status(201).json({ success: true, review });
    } catch (err) {
      return res.status(500).json({ error: "Failed to record testimonial." });
    }
  },

  // 7. Newsletters
  handleNewsletterSignup: (req: any, res: any) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email is required." });
      }

      const success = dbActions.addNewsletterEmail(email);
      if (success) {
        return res.json({
          success: true,
          message: "Blessed. You have been added to Kunika's Inner Spiritual Circle with standard confirmation."
        });
      } else {
        return res.json({
          success: true, // Send success: true anyway since they are already subscribed
          message: "You are already a valued member of Kunika's Sacred Circle."
        });
      }
    } catch (err) {
      return res.status(500).json({ error: "Failed to register newsletter subscription." });
    }
  },

  // 8. Razorpay Bookings Integration
  createPaymentOrder: async (req: any, res: any) => {
    try {
      const { amount, currency, notes } = req.body;
      if (!amount) {
        return res.status(400).json({ error: "Booking amount is required to generate payment node." });
      }

      const rzp = getRazorpay();
      const order = await rzp.orders.create({
        amount: Math.round(Number(amount) * 100), // paise
        currency: currency || 'INR',
        notes: notes || {}
      });

      return res.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency
      });
    } catch (err: any) {
      console.error("Razorpay order generation failure:", err);
      // Fallback mode if keys are missing
      if (err.message === "RAZORPAY_CREDENTIALS_MISSING") {
        return res.json({
          id: `fake_order_${Date.now()}__${Math.round(Math.random() * 1000)}`,
          amount: Math.round(Number(req.body.amount || 150) * 100),
          currency: 'INR'
        });
      }
      return res.status(500).json({ error: "Mystic payment node initialisation aborted." });
    }
  },

  verifyPayment: async (req: any, res: any) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingData } = req.body;
      if (!razorpay_order_id || !razorpay_payment_id || !bookingData) {
        return res.status(400).json({ error: "Payload coordinates missing for payment verification." });
      }

      let isVerified = false;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (!keySecret) {
        // If razorpay is unconfigured, run in simulation fallback
        console.warn("Unconfigured signature bypass: RAZORPAY_KEY_SECRET missing.");
        isVerified = true;
      } else {
        const text = razorpay_order_id + '|' + razorpay_payment_id;
        const generated_signature = crypto
          .createHmac('sha256', keySecret)
          .update(text)
          .digest('hex');
          
        isVerified = (generated_signature === razorpay_signature);
      }

      if (isVerified) {
        // Register booking
        const newBooking = dbActions.addBooking({
          customerName: bookingData.customerName,
          customerEmail: bookingData.customerEmail,
          customerPhone: bookingData.customerPhone,
          customerDob: bookingData.customerDob,
          customerTob: bookingData.customerTob,
          customerPob: bookingData.customerPob,
          serviceId: bookingData.serviceId,
          serviceName: bookingData.serviceName,
          date: bookingData.date,
          time: bookingData.time,
          price: Number(bookingData.price),
          duration: Number(bookingData.duration),
          status: 'Approved', // Mark as auto-approved as payment is complete
          intent: bookingData.intent
        });

        return res.json({
          success: true,
          message: "Payment successfully verified. Spiritual alignment scheduled.",
          booking: newBooking
        });
      } else {
        return res.status(400).json({ success: false, error: "Payment verification failed. Invalid secure signature." });
      }
    } catch (err) {
      console.error("Verification processing failed:", err);
      return res.status(500).json({ error: "Verification system error." });
    }
  },

  // 9. Razorpay Store Integration
  createStoreOrder: async (req: any, res: any) => {
    try {
      const { amount, customerEmail, items } = req.body;
      if (!amount) {
        return res.status(400).json({ error: "Order subtotal is required." });
      }

      const rzp = getRazorpay();
      const order = await rzp.orders.create({
        amount: Math.round(Number(amount) * 100), // paise
        currency: 'INR',
        notes: {
          customerEmail: customerEmail || "",
          itemCount: String(items?.length || 0)
        }
      });

      return res.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency
      });
    } catch (err: any) {
      console.error("Razorpay store order creation error:", err);
      if (err.message === "RAZORPAY_CREDENTIALS_MISSING") {
        return res.json({
          id: `fake_store_order_${Date.now()}__${Math.round(Math.random() * 1000)}`,
          amount: Math.round(Number(req.body.amount || 50) * 100),
          currency: 'INR'
        });
      }
      return res.status(500).json({ error: "Store checkout alignment issue." });
    }
  },

  verifyStore: async (req: any, res: any) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;
      if (!razorpay_order_id || !razorpay_payment_id || !orderData) {
        return res.status(400).json({ error: "Verification coordinates missing." });
      }

      let isVerified = false;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (!keySecret) {
        console.warn("Unconfigured store signature bypass: secret missing.");
        isVerified = true;
      } else {
        const text = razorpay_order_id + '|' + razorpay_payment_id;
        const generated_signature = crypto
          .createHmac('sha256', keySecret)
          .update(text)
          .digest('hex');
          
        isVerified = (generated_signature === razorpay_signature);
      }

      if (isVerified) {
        // Reduce stock counts from db
        const { items } = orderData;
        if (items && Array.isArray(items)) {
          for (const item of items) {
            if (item.productId) {
              dbActions.updateProductStock(item.productId, Number(item.quantity) || 1);
            }
          }
        }

        return res.json({
          success: true,
          message: "Sacred crystal billing complete.",
          transactionId: razorpay_payment_id
        });
      } else {
        return res.status(400).json({ success: false, error: "Payment verification aborted." });
      }
    } catch (err) {
      console.error("Verification processing failed:", err);
      return res.status(500).json({ error: "Billing verification service failure." });
    }
  }
};
