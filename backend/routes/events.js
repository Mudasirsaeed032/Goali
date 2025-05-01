require('dotenv').config();
const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const requireAdmin = require('../middleware/requireAdmin');

const checkAuth = require('../middleware/checkAuth');

// 🔐 GET /admin/events
router.get('/admin', checkAuth, requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /admin/:id - Delete event and its tickets manually
router.delete('/admin/:id', checkAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: Delete all tickets for this event
    const { error: ticketDeleteError } = await supabase
      .from('tickets')
      .delete()
      .eq('event_id', id);

    if (ticketDeleteError) throw new Error("Failed to delete related tickets: " + ticketDeleteError.message);

    // Step 2: Delete the event itself
    const { error: eventDeleteError } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (eventDeleteError) throw new Error("Failed to delete event: " + eventDeleteError.message);

    res.status(200).json({ message: "Event and related tickets deleted successfully" });
  } catch (err) {
    console.error("Delete failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});



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

// GET /events - List all events
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /events/:id/checkout-session
router.post('/:id/checkout-session', checkAuth, async (req, res) => {
  const eventId = req.params.id;
  const user = req.user;

  // Fetch event from DB
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (error || !event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: event.title,
            description: event.description,
          },
          unit_amount: Math.round(event.price * 100), // Price in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `http://localhost:5173/tickets/success?eventId=${eventId}`,
      cancel_url: `http://localhost:5173/events`,
      metadata: {
        event_id: event.id,
        user_id: user.id,
      }
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe session creation error:', err.message);
    res.status(500).json({ error: 'Unable to create checkout session' });
  }
});



module.exports = router;