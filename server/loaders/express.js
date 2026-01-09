// server/loader/express.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimitPkg from 'express-rate-limit';
import csurf from 'csurf';
import session from 'express-session';
import config from '../config/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Route-ok
import userRoutes from '../routes/userRoutes.js';
import productRoutes from '../routes/productRoutes.js';
import cartRoutes from '../routes/cartRoutes.js';
import cartItemRoutes from '../routes/cartItemRoutes.js';
import orderRoutes from '../routes/orderRoutes.js';
import paymentRoutes from '../routes/paymentRoutes.js';

// Swagger
import setupSwagger from './swagger.js';

// Error middleware
import errorMiddleware from '../middlewares/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const expressLoader = () => {
  const app = express();

  console.log('SESSION_SECRET loaded:', config.sessionSecret);

  // Security headers
  app.use(helmet());

  // CORS
  app.use(cors({ origin: config.clientUrl, credentials: true }));

  // Logger
  app.use(morgan('dev'));

  // JSON parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Static files
  app.use(
    '/storage',
    (req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', config.clientUrl || 'http://localhost:3001');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      next();
    },
    express.static(path.join(__dirname, '../storage'))
  );

  // Cookies
  app.use(cookieParser());

  // Session
  app.use(
    session({
      secret: config.sessionSecret || 'dev_secret_for_testing',
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: config.nodeEnv === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 nap
      },
    })
  );

  // Rate limiting
  app.use(rateLimitPkg({ windowMs: 15 * 60 * 1000, max: 100 }));

  // Health-check route
  app.get('/', (req, res) => res.send('Backend is running ✅'));

  // ✅ CSRF NÉLKÜL: cart + payments (cross-origin miatt)
  app.use('/api/cart', cartRoutes);
  app.use('/api/cart/items', cartItemRoutes);
  app.use('/api/payments', paymentRoutes);

  // ✅ CSRF VÉDELEM: minden másra
  const csrfProtection = csurf({ cookie: true });
  app.use(csrfProtection);

  // CSRF token endpoint (CSRF mögött értelmes)
  app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
  });

  // API Route-ok (CSRF mögött)
  app.use('/api/users', userRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);

  // Swagger UI
  setupSwagger(app);

  // Error Middleware (minden route után)
  app.use(errorMiddleware);

  return app;
};

export default expressLoader;
