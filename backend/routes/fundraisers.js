const express = require('express');
const { supabase } = require('../supabaseClient');
const checkAuth = require('../middleware/checkAuth');
const requireAdmin = require('../middleware/requireAdmin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
  const { amount } = req.body;  // Amount should be in USD
  const userId = req.user.id;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid payment amount" });
  }

  try {
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Donation to Fundraiser`,
          },
          unit_amount: Math.round(amount * 100), // Stripe expects amount in smallest currency unit (cents)
        },
        quantity: 1,
      }],
      success_url: `http://localhost:5173/fundraisers`,
      cancel_url: 'http://localhost:5173/fundraisers',
      metadata: {
        fundraiser_id: fundraiserId,
        user_id: userId,
      },
    });

    // Store the payment information in the database
    const { data, error } = await supabase
      .from('payments')
      .insert([{
        user_id: userId,
        fundraiser_id: fundraiserId,
        amount: amount, // Store the donation amount
        method: 'stripe', // Payment method (could be 'stripe' or other methods)
        status: 'succeeded', // Status (you may update this after confirming payment)
        created_at: new Date().toISOString(),
      }]);

    if (error) {
      console.error('Error storing payment data:', error.message);
      return res.status(500).json({ error: 'Failed to store payment data' });
    }

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
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
    .eq('status', 'succeeded');

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