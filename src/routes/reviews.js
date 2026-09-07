const express = require('express');
const crypto = require('crypto');
const supabase = require('../lib/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const hashUserId = (userId) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  return crypto.createHmac('sha256', secret).update(String(userId)).digest('hex');
};

// POST /api/reviews
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { committee_id, cycle_id, rating, comment } = req.body;
    const userId = req.user?.id || req.user?.userId || req.user?.sub;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'User ID missing from token' });
    }

    const anonymous_hash = hashUserId(userId);

    const { data, error } = await supabase
      .from('reviews')
      .insert([
        {
          committee_id,
          cycle_id: cycle_id || null,
          user_id_hash: anonymous_hash,
          ratings: { score: rating }, // Stores rating as jsonb
          comment
        }
      ])
      .select();

    if (error) return res.status(400).json({ success: false, error: error.message });

    res.status(201).json({ success: true, data: data[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/reviews/committee/:id
router.get('/committee/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('id, ratings, comment, created_at')
      .eq('committee_id', req.params.id)
      .eq('is_hidden', false);

    if (error) return res.status(400).json({ success: false, error: error.message });

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;