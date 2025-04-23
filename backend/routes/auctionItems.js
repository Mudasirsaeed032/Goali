const express = require('express');
const {supabase} = require('../supabaseClient');
const checkAuth = require('../middleware/checkAuth')

const router = express.Router();

// POST /auction-items
router.post('/', checkAuth, async (req, res) => {
  const { title, description, starting_bid, end_time, image_url } = req.body;
  const userId = req.user.id; // From checkAuth middleware

  // Validate data
  if (!title || !description || !starting_bid || !end_time || !image_url) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Insert auction item into the database
  const { data, error } = await supabase
    .from('auction_items')
    .insert([{ title, description, starting_bid, end_time, image_url, owner_id: userId }])
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data);
});

module.exports = router;
