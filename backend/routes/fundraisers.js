const express = require('express');
const { supabase } = require('../supabaseClient');
const checkAuth = require('../middleware/checkAuth');

const router = express.Router();

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


export default router;