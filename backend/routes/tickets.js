const express = require('express');
const { supabase } = require('../supabaseClient');
const checkAuth = require('../middleware/checkAuth');
const QRCode = require('qrcode');

const router = express.Router();

// POST /tickets → called after Stripe payment
router.post('/', checkAuth, async (req, res) => {
  const { event_id } = req.body;
  const userId = req.user.id;

  if (!event_id) return res.status(400).json({ error: 'Missing event_id' });

  // Generate QR code (e.g., encode user & event ID)
  const ticketData = `user:${userId}|event:${event_id}`;
  const qrCodeURL = await QRCode.toDataURL(ticketData);

  const { data, error } = await supabase
    .from('tickets')
    .insert([{ user_id: userId, event_id, qr_code_url: qrCodeURL }])
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ ticket: data });
});

module.exports = router;
