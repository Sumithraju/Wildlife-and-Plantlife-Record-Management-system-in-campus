require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
const rateLimit = require('express-rate-limit');

const authRoutes     = require('./routes/authRoutes');
const wildlifeRoutes = require('./routes/wildlifeRoutes');
const plantRoutes    = require('./routes/plantRoutes');
const userRoutes     = require('./routes/userRoutes');

const app = express();

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api', limiter);

// Routes
app.use('/api/auth',     authRoutes);
app.use('/api/wildlife', wildlifeRoutes);
app.use('/api/plants',   plantRoutes);
app.use('/api/users',    userRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// 404
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5001;

if (require.main === module) {
  app.listen(PORT, () =>
    console.log(`Wildlife API running on port ${PORT}`)
  );
}

module.exports = app;
