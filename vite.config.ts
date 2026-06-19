import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { apiHandlers } from './src/server/apiHandlers.ts';

function apiPlugin() {
  return {
    name: 'api-plugin',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (req.url?.startsWith('/api/')) {
          res.setHeader('Content-Type', 'application/json');
          
          // Body reader helper
          const getRequestBody = () => new Promise((resolve) => {
            let body = '';
            req.on('data', (chunk: any) => body += chunk);
            req.on('end', () => {
              try { resolve(body ? JSON.parse(body) : {}); }
              catch { resolve({}); }
            });
          });

          const mockRes = {
            status(code: number) {
              res.statusCode = code;
              return this;
            },
            json(data: any) {
              res.end(JSON.stringify(data));
              return this;
            }
          };

          const matchedUrl = req.url.split('?')[0];
          const queryParams = new URL(req.url, 'http://localhost').searchParams;
          const mockReq = {
            query: Object.fromEntries(queryParams.entries()),
            body: {} as any
          };

          if (req.method === 'POST') {
            mockReq.body = await getRequestBody();
          }

          try {
            if (matchedUrl === '/api/tarot/chat') {
              await apiHandlers.handleTarotChat(mockReq, mockRes);
            } else if (matchedUrl === '/api/bookings') {
              if (req.method === 'GET') {
                await apiHandlers.getBookings(mockReq, mockRes);
              } else if (req.method === 'POST') {
                await apiHandlers.createBooking(mockReq, mockRes);
              }
            } else if (matchedUrl === '/api/bookings/update-status') {
              await apiHandlers.updateBookingStatus(mockReq, mockRes);
            } else if (matchedUrl === '/api/products') {
              if (req.method === 'GET') {
                await apiHandlers.getProducts(mockReq, mockRes);
              } else if (req.method === 'POST') {
                await apiHandlers.addProduct(mockReq, mockRes);
              }
            } else if (matchedUrl === '/api/checkout') {
              await apiHandlers.handleCheckout(mockReq, mockRes);
            } else if (matchedUrl === '/api/blogs') {
              if (req.method === 'GET') {
                await apiHandlers.getBlogs(mockReq, mockRes);
              } else if (req.method === 'POST') {
                await apiHandlers.addBlog(mockReq, mockRes);
              }
            } else if (matchedUrl === '/api/reviews') {
              if (req.method === 'GET') {
                await apiHandlers.getReviews(mockReq, mockRes);
              } else if (req.method === 'POST') {
                await apiHandlers.addReview(mockReq, mockRes);
              }
            } else if (matchedUrl === '/api/newsletter') {
              await apiHandlers.handleNewsletterSignup(mockReq, mockRes);
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: `Route ${matchedUrl} not found` }));
            }
          } catch (err) {
            console.error("API Plugin router crashed", err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Server-side routing issue occurred" }));
          }
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
