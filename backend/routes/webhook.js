require('dotenv').config();
const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log('✅ Stripe event received:', event.type);
  } catch (err) {
    console.error('❌ Webhook signature verification failed', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = session.metadata;

    console.log('🔍 Session metadata:', metadata);
    console.log('💰 Amount received (in cents):', session.amount_total);
    console.log('🧾 Payment status:', session.payment_status);

    const paymentData = {
      user_id: metadata.user_id,
      fundraiser_id: metadata.fundraiser_id || null,
      auction_items_id: metadata.auction_items_id || null,
      event_id: metadata.event_id || null,
      amount: session.amount_total / 100,
      method: session.payment_method_types[0],
      status: session.payment_status,
      created_at: new Date().toISOString()
    };

    console.log('📦 Prepared payment data:', paymentData);

    const { error } = await supabase.from('payments').insert([paymentData]);

    if (error) {
      console.error('❌ Error saving payment to Supabase:', error.message);
      return res.status(500).json({ error: 'Failed to record payment' });
    }

    console.log('✅ Payment stored successfully in Supabase');
  }

  res.json({ received: true });
});


module.exports = router;
