const express = require('express');
const supabase = require('../lib/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/lost-found - Report item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, location, type, image_url, date_lost } = req.body;
    const userId = req.user?.id || req.user?.userId || req.user?.sub;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'User ID missing from token' });
    }

    const isFound = type === 'FOUND';
    const tableName = isFound ? 'found_items' : 'lost_items';

    const insertData = { title, description, category, status: 'OPEN' };

    if (isFound) {
      insertData.finder_id = userId;
      insertData.location_found = location;
      insertData.date_found = req.body.date_found || new Date().toISOString();
    } else {
      insertData.reporter_id = userId;
      insertData.location_lost = location;
      insertData.date_lost = date_lost || new Date().toISOString();
      if (image_url) insertData.image_urls = [image_url];
    }

    const { data, error } = await supabase
      .from(tableName)
      .insert([insertData])
      .select();

    if (error) return res.status(400).json({ success: false, error: error.message });

    res.status(201).json({ success: true, data: data[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/lost-found - Paginated & Filtered Search
router.get('/', async (req, res) => {
  try {
    const { type = 'LOST', status = 'OPEN', page = 1, limit = 10, category } = req.query;
    const tableName = type.toUpperCase() === 'FOUND' ? 'found_items' : 'lost_items';

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const from = (pageNum - 1) * limitNum;
    const to = from + limitNum - 1;

    let query = supabase
      .from(tableName)
      .select('id, title, category, status, created_at', { count: 'exact' })
      .eq('status', status)
      .range(from, to)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, count, error } = await query;

    if (error) return res.status(400).json({ success: false, error: error.message });

    res.status(200).json({
      success: true,
      page: pageNum,
      limit: limitNum,
      total_records: count,
      data
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;