const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const { authenticate, authorize } = require('../middleware/auth');

// GET ALL COMMITTEES
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('committees')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CREATE COMMITTEE (ADMIN/COMMITTEE_HEAD ONLY)
router.post('/', authenticate, authorize('ADMIN', 'COMMITTEE_HEAD'), async (req, res) => {
  try {
    const { name, description, category, contact_email, logo_url, is_recruiting } = req.body;

    const { data, error } = await supabase
      .from('committees')
      .insert([{ name, description, category, contact_email, logo_url, is_recruiting }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;