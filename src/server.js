const express = require('express');
const cors = require('cors');
require('dotenv').config();
const reviewRoutes = require('./routes/reviews');
const lostFoundRoutes = require('./routes/lostFound');

const app = express();

app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/committees', require('./routes/committees'));
app.use('/api/events', require('./routes/events'));
app.use('/api/reviews', reviewRoutes);
app.use('/api/lost-found', lostFoundRoutes);


app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Campus Hub API is active' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});