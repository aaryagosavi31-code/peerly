const express = require('express');
const supabase = require('../lib/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const toPost = (post) => ({
  id: post.id,
  committee: post.committee_name,
  tagline: post.badge || 'Campus Update',
  avatar: (post.committee_name || 'CH').slice(0, 2).toUpperCase(),
  time: post.created_at,
  badge: post.badge || 'Announcement',
  caption: post.caption,
  mediaType: post.media_type,
  mediaUrl: post.media_url,
  posterUrl: post.poster_url,
  likes: post.likes || 0,
  isLiked: false,
  comments: []
});

router.get('/posts', async (req, res) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 6, 1), 50);
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, count, error } = await supabase
      .from('feed_posts')
      .select('id, committee_name, media_type, media_url, poster_url, caption, badge, likes, created_at', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ success: false, error: error.message });
    res.json({ success: true, page, limit, total_records: count, data: data.map(toPost) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { committee_name, media_type, media_url, poster_url, caption, badge } = req.body;
    const { data, error } = await supabase
      .from('feed_posts')
      .insert([{ author_id: req.user.id, committee_name, media_type, media_url, poster_url, caption, badge, likes: 0 }])
      .select('id, committee_name, media_type, media_url, poster_url, caption, badge, likes, created_at')
      .single();

    if (error) return res.status(400).json({ success: false, error: error.message });
    res.status(201).json({ success: true, data: toPost(data) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;