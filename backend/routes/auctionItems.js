const express = require('express');
const { supabase } = require('../supabaseClient');
const checkAuth = require('../middleware/checkAuth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

// GET /auction - View all auctions (for AuctionList component)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('auction_items')
      .select('id, title, description, current_bid, image_url, start_time, end_time')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[GET /auction Error]', error.message);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data); // Send auction items data as response
  } catch (err) {
    console.error('[GET /auction Exception]', err.message);
    res.status(500).json({ error: 'Server error while fetching auction items' });
  }
});


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

// GET /admin/auctions - View all auctions
router.get('/admin', checkAuth, requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('auction_items')
    .select('id, title, description, current_bid, image_url, start_time, end_time')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// GET /auction/:id
router.get('/:id', checkAuth, async (req, res) => {
  const { id } = req.params;

  // Fetch auction item
  const { data: auctionItem, error: fetchError } = await supabase
    .from('auction_items')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !auctionItem) {
    return res.status(404).json({ error: 'Auction item not found' });
  }

  // Fetch highest bid
  const { data: highestBidData, error: bidError } = await supabase
    .from('bids')
    .select('amount, user_id')
    .eq('item_id', id)
    .order('amount', { ascending: false })
    .limit(1)
    .single();

  if (bidError) {
    console.error('[Bid Fetch Error]', bidError.message);
  }

  // Fetch all bids
  const { data: allBids, error: allBidsError } = await supabase
    .from('bids')
    .select('amount, user_id, bid_time')
    .eq('item_id', id)
    .order('bid_time', { ascending: false });

  if (allBidsError) {
    console.error('[All Bids Fetch Error]', allBidsError.message);
  }


  res.status(200).json({
    auctionItem,
    highestBid: highestBidData || null,
    allBids: allBids || [],
  });
});



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

  // 🚨 Check if auction has already ended
  const now = new Date();
  const auctionEndTime = new Date(auctionItem.end_time);

  if (now > auctionEndTime) {
    return res.status(400).json({ error: 'Auction has already ended' });
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



// DELETE /admin/:id - Delete auction item
router.delete('/admin/:id', checkAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('auction_items')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'Auction item deleted' });
});


module.exports = router;