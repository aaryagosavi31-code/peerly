const express = require('express');
const supabase = require('../lib/supabase');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

const countRows = (table, status) => {
  let query = supabase.from(table).select('id', { count: 'exact', head: true });
  return status ? query.eq('status', status) : query;
};

router.get('/overview', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const results = await Promise.all([
      countRows('users'),
      countRows('committees'),
      countRows('events'),
      countRows('reviews'),
      countRows('lost_items', 'OPEN'),
      countRows('found_items', 'OPEN')
    ]);
    const failed = results.find((result) => result.error);
    if (failed) return res.status(400).json({ success: false, error: failed.error.message });

    const [users, committees, events, reviews, openLost, openFound] = results;
    res.status(200).json({
      success: true,
      data: {
        users: users.count || 0,
        committees: committees.count || 0,
        events: events.count || 0,
        reviews: reviews.count || 0,
        open_lost_items: openLost.count || 0,
        open_found_items: openFound.count || 0
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;