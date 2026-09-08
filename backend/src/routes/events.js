const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { authenticate, authorize } = require('../middleware/auth');

// GET EVENTS (With optional category filter & date tabs)
router.get('/', async (req, res) => {
  try {
    const { category, timeframe } = req.query;
    let query = supabase.from('events').select('*, committees(name, logo_url)');

    if (category) {
      query = query.eq('category', category);
    }

    const now = new Date().toISOString();

    if (timeframe === 'today') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      query = query.gte('start_time', startOfDay.toISOString()).lte('start_time', endOfDay.toISOString());
    } else if (timeframe === 'now') {
      query = query.lte('start_time', now).gte('end_time', now);
    }

    const { data, error } = await query.order('start_time', { ascending: true });

    if (error) throw error;
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CREATE EVENT
router.post('/', authenticate, authorize('ADMIN', 'COMMITTEE_HEAD'), async (req, res) => {
  try {
    const { committee_id, title, category, start_time, end_time, location, description, reg_link, is_recruiting } = req.body;

    const { data, error } = await supabase
      .from('events')
      .insert([{
        committee_id,
        title,
        category,
        start_time,
        end_time,
        location,
        description,
        reg_link,
        is_recruiting
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;