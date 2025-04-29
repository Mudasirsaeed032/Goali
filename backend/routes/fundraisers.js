const express = require('express');
const { supabase } = require('../supabaseClient');
const checkAuth = require('../middleware/checkAuth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

// GET /fundraisers (with optional search/filter)
router.get('/', async (req, res) => {
    const { search } = req.query; // Get the search term from the query params
  
    // Construct the query to filter by title (or any other field)
    let query = supabase.from('fundraisers').select('*');
  
    if (search) {
      query = query.ilike('title', `%${search}%`); // Case-insensitive search on 'title'
    }
  
    const { data, error } = await query;
  
    if (error) {
      return res.status(500).json({ error: error.message });
    }
  
    res.status(200).json(data);
  });
  

router.post('/', checkAuth, async (req, res) => {
    const { title, description, image_url } = req.body;
    const userId = req.user.id;

    // Validate data
    if (!title || !description || !image_url) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Insert fundraiser into the database
    const { data, error } = await supabase
        .from('fundraisers')
        .insert([{ title, description, image_url, owner_id: userId }])
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
})

// GET /admin/fundraisers → View all fundraisers
router.get('/admin', checkAuth, requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('fundraisers')
    .select('id, title, description, image_url, collected_amount, goal_amount, created_at');

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// DELETE /admin/fundraisers/:id
router.delete('/admin/:id', checkAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('fundraisers')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'Fundraiser deleted' });
});



module.exports = router;