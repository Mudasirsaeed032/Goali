const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

router.post('/', checkAuth, async (req, res) => {
    const { title, description, price, location } = req.body;
    const owner_id = req.user.id;
  
    if (!title || !description || !price || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    const { data, error } = await supabase
      .from('events')
      .insert([{ title, description, price, location, owner_id }])
      .single();
  
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
  });

module.exports = router;