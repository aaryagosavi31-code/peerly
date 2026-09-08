const express = require('express');
const supabase = require('../lib/supabase');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/summary', authenticateToken, authorizeRoles('ADMIN'), async (req, res) => {
  try {
    const results = await Promise.all([
      supabase.from('lost_items').select('id', { count: 'exact', head: true }).eq('status', 'OPEN'),
      supabase.from('found_items').select('id', { count: 'exact', head: true }).eq('status', 'OPEN'),
      supabase.from('lost_items').select('id', { count: 'exact', head: true }).eq('status', 'RESOLVED'),
      supabase.from('found_items').select('id', { count: 'exact', head: true }).eq('status', 'RESOLVED')
    ]);
    const failed = results.find((result) => result.error);
    if (failed) return res.status(400).json({ success: false, error: failed.error.message });

    res.json({
      success: true,
      data: {
        open_lost: results[0].count || 0,
        open_found: results[1].count || 0,
        resolved: (results[2].count || 0) + (results[3].count || 0)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/match/:id', async (req, res) => {
  try {
    const { data: lostItem, error: lostError } = await supabase
      .from('lost_items')
      .select('id, category, location_lost')
      .eq('id', req.params.id)
      .single();
    if (lostError) {
      const status = lostError.code === 'PGRST116' ? 404 : 400;
      return res.status(status).json({ success: false, error: status === 404 ? 'Lost item not found' : lostError.message });
    }

    let query = supabase
      .from('found_items')
      .select('id, title, description, category, location_found, date_found, status, created_at')
      .eq('status', 'OPEN')
      .eq('category', lostItem.category);
    if (lostItem.location_lost) query = query.ilike('location_found', `%${lostItem.location_lost}%`);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

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

    const fields = tableName === 'found_items'
      ? 'id, title, description, category, status, location_found, date_found, created_at'
      : 'id, title, description, category, status, location_lost, date_lost, created_at';

    let query = supabase
      .from(tableName)
      .select(fields, { count: 'exact' })
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