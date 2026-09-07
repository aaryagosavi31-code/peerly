const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const reviewRoutes = require('./routes/reviews');
const lostFoundRoutes = require('./routes/lostFound');
const feedRoutes = require('./routes/feed');
const analyticsRoutes = require('./routes/analytics');

const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later' }
}));

// Mount Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/committees', require('./routes/committees'));
app.use('/api/events', require('./routes/events'));
app.use('/api/reviews', reviewRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/analytics', analyticsRoutes);


app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Campus Hub API is active' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ success: false, error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});