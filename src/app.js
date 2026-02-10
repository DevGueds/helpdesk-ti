const path = require('path');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const layouts = require('express-ejs-layouts');

const { attachUserToReq } = require('./middleware/auth');
const { csrfSetup } = require('./middleware/csrf');

const authRoutes = require('./routes/auth.routes');
const ticketRoutes = require('./routes/tickets.routes');
const coordinatorRoutes = require('./routes/coordinator.routes');
const techRoutes = require('./routes/tech.routes');
const adminRoutes = require('./routes/admin.routes');
const reportsRoutes = require('./routes/reports.routes');
const exportRoutes = require('./routes/export.routes');
const hardwareRoutes = require('./routes/hardware.routes');

const viewHelpers = require('./utils/views');
const { attachMonitoringStats } = require('./middleware/monitoring');


function createApp() {
  const app = express();

  // Helmet with CSP configuration to allow Chart.js and Bootstrap CDN
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // Required for inline scripts in EJS templates
          "https://cdn.jsdelivr.net" // Chart.js and Bootstrap
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'", // Required for some inline styles
          "https://cdn.jsdelivr.net",
          "https://fonts.googleapis.com"
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdn.jsdelivr.net"
        ],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"]
      }
    }
  }));
  app.use(express.urlencoded({ extended: true }));

  app.use(session({
    secret: process.env.SESSION_SECRET || 'dev',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: Number(process.env.SESSION_MAX_AGE_MS || 8 * 60 * 60 * 1000)
    }
  }));

  // Flash simples na sessão (substitui connect-flash)
  app.use((req, res, next) => {
    req.flash = (type, msg) => {
      req.session._flash = req.session._flash || { success: [], error: [] };
      req.session._flash[type] = req.session._flash[type] || [];
      req.session._flash[type].push(String(msg));
    };

    res.locals.flash = req.session._flash || { success: [], error: [] };
    req.session._flash = { success: [], error: [] }; // consome
    next();
  });

  // EJS + layout
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.use(layouts);
  app.set('layout', 'layouts/main');

  // Static
  app.use('/public', express.static(path.join(__dirname, '../public')));
  app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));

  // User
  app.use(attachUserToReq);

  // CSRF
  app.use(csrfSetup);

  // Helpers para EJS
  app.use((req, res, next) => {
    res.locals.fmtDateBR = viewHelpers.fmtDateBR;
    res.locals.statusBadgeClass = viewHelpers.statusBadgeClass;
    res.locals.priorityBadgeClass = viewHelpers.priorityBadgeClass;
    res.locals.translateStatus = viewHelpers.translateStatus;
    res.locals.translatePriority = viewHelpers.translatePriority;
    // Hardware helpers
    res.locals.getRoomIcon = viewHelpers.getRoomIcon;
    res.locals.translateRoom = viewHelpers.translateRoom;
    res.locals.getStatusBadgeClass = viewHelpers.getHardwareStatusBadgeClass;
    res.locals.translateHardwareStatus = viewHelpers.translateHardwareStatus;
    next();
  });

  // user em locals
  app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
  });

  // Monitoring stats for sidebar (ADMIN only)
  app.use(attachMonitoringStats);



  // CSRF error handler
  app.use((err, req, res, next) => {
    if (err && err.code === 'EBADCSRFTOKEN') {
      req.flash('error', 'Sessão expirada ou formulário desatualizado. Recarregue a página e tente novamente.');
      return res.redirect(req.get('Referrer') || '/');
    }
    next(err);
  });

  // Home
  app.get('/', (req, res) => {
    if (!req.user) return res.redirect('/login');

    if (req.user.role === 'ADMIN') return res.redirect('/admin');
    if (req.user.role === 'TECH') return res.redirect('/tech/tickets');
    if (req.user.role === 'COORDINATOR') return res.redirect('/coordinator/tickets');
    return res.redirect('/tickets/my');
  });

  // Routes
  app.use(authRoutes);
  app.use('/tickets', ticketRoutes);
  app.use('/coordinator', coordinatorRoutes);
  app.use('/tech', techRoutes);
  app.use('/admin', adminRoutes);
  app.use('/reports', reportsRoutes);
  app.use('/export', exportRoutes);
  app.use('/hardware', hardwareRoutes);

  app.use((req, res) => res.status(404).send('404 - Página não encontrada'));
  return app;
}

module.exports = { createApp };
