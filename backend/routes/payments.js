require('dotenv').config();
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { supabase } = require('../supabaseClient');
const checkAuth = require('../middleware/checkAuth');

// POST /payments/fundraiser/:id/checkout
router.post('/fundraiser/:id/checkout', checkAuth, async (req, res) => {
  const { id: fundraiserId } = req.params;
  const { amount } = req.body;
  const userId = req.user.id;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid donation amount' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd', // or PKR if your account supports it
          product_data: {
            name: `Donation to Fundraiser`,
          },
          unit_amount: Math.round(amount * 100), // convert to cents
        },
        quantity: 1,
      }],
      success_url: `http://localhost:5173/payment-success?type=fundraiser&fundraiser_id=${fundraiserId}`,
      cancel_url: `http://localhost:5173/fundraisers`,
      metadata: {
        user_id: userId,
        fundraiser_id: fundraiserId,
        type: 'fundraiser',
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('[Stripe Checkout Error]', err.message);
    res.status(500).json({ error: 'Stripe session failed' });
  }
});

module.exports = router;
