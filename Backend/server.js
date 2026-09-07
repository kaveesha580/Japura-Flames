const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// ===== Middleware =====
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ===== ROUTES =====

// 1. Auth Routes
try {
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
} catch (err) {
  app.get('/api/auth/test', (req, res) => {
    res.json({ message: 'Auth API - Create routes/auth.js file' });
  });
}

// 2. Projects Routes
try {
  const projectRoutes = require('./routes/projects');
  app.use('/api/projects', projectRoutes);
} catch (err) {
  app.get('/api/projects', (req, res) => {
    res.json({ message: 'Projects API - Create routes/projects.js file' });
  });
}

// 3. Bookings Routes
try {
  const bookingRoutes = require('./routes/bookings');
  app.use('/api/bookings', bookingRoutes);
} catch (err) {
  app.get('/api/bookings', (req, res) => {
    res.json({ message: 'Bookings API - Create routes/bookings.js file' });
  });
}

// 4. Crew Routes
try {
  const crewRoutes = require('./routes/crew');
  app.use('/api/crew', crewRoutes);
} catch (err) {
  app.get('/api/crew', (req, res) => {
    res.json({ message: 'Crew API - Create routes/crew.js file' });
  });
}

// 5. Facebook Posts Routes
try {
  const facebookPostRoutes = require('./routes/facebookPosts');
  app.use('/api/facebook-posts', facebookPostRoutes);
} catch (err) {
  app.get('/api/facebook-posts', (req, res) => {
    res.json({ message: 'Facebook posts API is unavailable' });
  });
}

// ===== TEST ROUTE =====
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'API is working!',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        adminLogin: 'POST /api/auth/admin-login',
        resetPassword: 'POST /api/auth/forgot-password',
        profile: 'GET /api/auth/me',
        users: 'GET /api/auth/users',
        checkEmail: 'GET /api/auth/check-email?email=test@example.com'
      },
      projects: {
        getAll: 'GET /api/projects',
        create: 'POST /api/projects',
        update: 'PUT /api/projects/:id',
        delete: 'DELETE /api/projects/:id'
      },
      bookings: {
        getAll: 'GET /api/bookings',
        create: 'POST /api/bookings',
        update: 'PUT /api/bookings/:id',
        delete: 'DELETE /api/bookings/:id',
        cancel: 'POST /api/bookings/:id/cancel',
        complete: 'POST /api/bookings/:id/complete',
        assignCrew: 'POST /api/bookings/:id/assign-crew',
        paymentSlip: 'POST /api/bookings/:id/payment-slip'
      },
      crew: {  
        getAll: 'GET /api/crew',
        create: 'POST /api/crew',
        update: 'PUT /api/crew/:id',
        delete: 'DELETE /api/crew/:id'
      },
      test: 'GET /api/test'
    },
    timestamp: new Date().toISOString()
  });
});

// ===== MONGO DB =====
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB Connected');
})
.catch((err) => {
  console.error('MongoDB Connection Failed:', err.message);
});

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: {
      auth: '/api/auth',
      projects: '/api/projects',
      bookings: '/api/bookings',
      crew: '/api/crew',  
      test: '/api/test'
    }
  });
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Server Error:', err.message);
  }
  
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      field: field
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
