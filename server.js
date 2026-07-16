import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import helmet from 'helmet';
import expressLayouts from 'express-ejs-layouts';

import { pool } from './models/db.js';
import authRoutes from './routes/authRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import userRoutes from './routes/userRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import {
  notFound,
  errorHandler
} from './middleware/errorMiddleware.js';

const app = express();
const PgSession = pgSession(session);

// Trust the reverse proxy so secure cookies work correctly when the app runs behind one.
app.set('trust proxy', 1);

// Security middleware: adds common HTTP headers to reduce exposure to common web vulnerabilities.
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

// Body parser middleware: allows the app to read form data and JSON payloads from incoming requests.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static file middleware: serves assets from the public folder directly to the browser.
app.use(express.static('public'));

// View engine middleware: configure EJS as the template engine and use a shared layout for pages.
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
app.use(expressLayouts);

// Session middleware: stores session data in PostgreSQL and attaches the session object to each request.
app.use(
  session({
    store: new PgSession({
      pool,
      tableName: 'session',
      createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

// Local view middleware: exposes user and flash-style message values to templates on every request.
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.success = req.session.success || null;
  res.locals.error = req.session.error || null;

  delete req.session.success;
  delete req.session.error;

  next();
});

// Route middleware: routes are mounted in order so requests are matched by the appropriate controller.
app.use('/', vehicleRoutes);
app.use('/', authRoutes);
app.use('/account', userRoutes);
app.use('/employee', employeeRoutes);
app.use('/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Used car dealership app running on port ${port}`);
});