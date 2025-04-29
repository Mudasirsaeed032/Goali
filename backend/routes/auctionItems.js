const express = require('express');
const { supabase } = require('../supabaseClient');
const checkAuth = require('../middleware/checkAuth')

const router = express.Router();

// POST /auction
router.post('/', checkAuth, async (req, res) => {
  const { title, description, current_bid, end_time, start_time, image_url } = req.body;
  const userId = req.user.id; // From checkAuth middleware

  // Log incoming data for debugging
  console.log('Received Auction Data:', req.body);

  // Validate data
  if (!title || !description || current_bid === undefined || !end_time || !start_time || !image_url) {
    const missingFields = [
      !title && 'title',
      !description && 'description',
      (current_bid === undefined) && 'current_bid',
      !end_time && 'end_time',
      !start_time && 'start_time',
      !image_url && 'image_url'
    ].filter(Boolean).join(', ');

    return res.status(400).json({ error: `Missing required fields: ${missingFields}` });
  }

  // Convert end_time and start_time to Date objects
  const endTime = new Date(end_time);
  const startTime = new Date(start_time);

  if (isNaN(endTime) || isNaN(startTime)) {
    return res.status(400).json({ error: 'Invalid datetime format for start_time or end_time' });
  }

  // Insert auction item into the database
  try {
    const { data, error } = await supabase
      .from('auction_items')
      .insert([{
        title,
        description,
        current_bid,  // Store current_bid as the initial bid amount
        end_time: endTime,
        start_time: startTime,
        image_url,
        owner_id: userId,
        highest_bidder_id: null  // Set highest_bidder_id to null initially
      }])
      .single();

    if (error) {
      console.error('Supabase error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error('Error inserting auction item:', err);
    res.status(500).json({ error: 'Server error while creating auction item' });
  }
});

router.get('/:id', async(req, res)=>{
  const {id} = req.params;
  const { data, error } = await supabase
    .from('auction_items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('[Auction Fetch Error]', error.message);
    return res.status(500).json({ error: 'Failed to fetch auction item' });
  }

  if (!data) {
    return res.status(404).json({ error: 'Auction item not found' });
  }

  res.json(data);
})

// Place a bid
router.post('/:id/bid', checkAuth, async (req, res) => {
  const { id } = req.params; // Auction item ID
  const { bid_amount } = req.body;
  const userId = req.user.id; // Logged-in user's ID

  // Validate
  if (!bid_amount || isNaN(bid_amount)) {
    return res.status(400).json({ error: 'Bid amount is required and must be a number' });
  }

  // Fetch the auction item
  const { data: auctionItem, error: fetchError } = await supabase
    .from('auction_items')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !auctionItem) {
    console.error('[Bid Fetch Error]', fetchError?.message);
    return res.status(404).json({ error: 'Auction item not found' });
  }

  // Check if bid is higher than current bid
  if (bid_amount <= auctionItem.current_bid) {
    return res.status(400).json({ error: 'Bid must be higher than current bid' });
  }

  // Insert the new bid into bids table
  const { error: insertError } = await supabase
    .from('bids')
    .insert([{
      item_id: id,
      user_id: userId,
      amount: bid_amount,
    }]);

  if (insertError) {
    console.error('[Bid Insert Error]', insertError.message);
    return res.status(500).json({ error: 'Failed to place bid' });
  }

  // Update the auction item's current_bid
  const { error: updateError } = await supabase
    .from('auction_items')
    .update({ current_bid: bid_amount })
    .eq('id', id);

  if (updateError) {
    console.error('[Bid Update Error]', updateError.message);
    return res.status(500).json({ error: 'Failed to update auction current bid' });
  }

  console.log(`✅ Bid placed: $${bid_amount} by user ${userId}`);
  res.status(200).json({ message: 'Bid placed successfully' });
});

module.exports = router;



module.exports = router;
