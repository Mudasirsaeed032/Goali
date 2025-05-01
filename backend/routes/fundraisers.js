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
  const { title, description, image_url, goal_amount } = req.body;
  const userId = req.user.id;

  if (!title || !description || !image_url || goal_amount === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const { data, error } = await supabase
    .from('fundraisers')
    .insert([{
      title,
      description,
      image_url,
      goal_amount,
      collected_amount: 0,
      owner_id: userId
    }])
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data);
});


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

  console.log('Attempting to delete:', id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'Fundraiser deleted' });
});

router.post('/:id/pay', checkAuth, async (req, res) => {
  const { id: fundraiserId } = req.params;
  const { amount } = req.body;
  const userId = req.user.id;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid payment amount" });
  }

  // Fetch fundraiser details
  const { data: fundraiser, error: fetchError } = await supabase
    .from('fundraisers')
    .select('title')
    .eq('id', fundraiserId)
    .single();

  if (fetchError || !fundraiser) {
    return res.status(404).json({ error: "Fundraiser not found" });
  }

  // Create Stripe Checkout session
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'pkr',
            product_data: {
              name: fundraiser.title,
            },
            unit_amount: amount * 100, // Convert to paisa
          },
          quantity: 1,
        },
      ],
      metadata: {
        user_id: userId,
        fundraiser_id: fundraiserId,
        amount: amount,
      },
      success_url: 'http://localhost:5173/success', // adjust later
      cancel_url: 'http://localhost:5173/failure',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: "Stripe checkout failed" });
  }
});


router.get('/with-progress', async (req, res) => {
  const { data: fundraisers, error: fundraisersError } = await supabase
    .from('fundraisers')
    .select('*');

  if (fundraisersError) {
    return res.status(500).json({ error: fundraisersError.message });
  }

  const { data: payments, error: paymentsError } = await supabase
    .from('payments')
    .select('fundraiser_id, amount, status')
    .eq('status', 'paid');

  if (paymentsError) {
    return res.status(500).json({ error: paymentsError.message });
  }

  // Calculate collected amounts
  const progressMap = {};
  for (const p of payments) {
    if (!p.fundraiser_id) continue;
    progressMap[p.fundraiser_id] = (progressMap[p.fundraiser_id] || 0) + p.amount;
  }

  const enriched = fundraisers.map(f => ({
    ...f,
    collected_amount: progressMap[f.id] || 0
  }));

  res.json(enriched);
});



module.exports = router;