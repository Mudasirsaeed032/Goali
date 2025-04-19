const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const cookie = require('cookie');
require('dotenv').config();
const checkAuth = require('../middleware/checkAuth');
const requireAdmin = require('../middleware/requireAdmin');


router.post('/register-user', async (req, res) => {
  const { id, full_name, role } = req.body;
  console.log('[Register User Request]', { id, full_name, role });

  const { data, error } = await supabase
    .from('users') // if you're using 'profiles', replace this
    .upsert([{ id, full_name, role }], { onConflict: 'id' });

  if (error) {
    console.error('[Register User Error]', error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: 'User registered successfully' });
});



// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('[Login attempt]', email);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('[Login error]', error.message);
    return res.status(401).json({ error: error.message });
  }

  console.log('[Login success]', data);
  const token = data.session?.access_token;
  if (!token) return res.status(401).json({ error: 'No session token.' });

  res.setHeader(
    'Set-Cookie',
    cookie.serialize('sb-access-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax',
    })
  );

  res.json({ message: 'Logged in successfully' });
});

router.post('/make-admin', checkAuth, requireAdmin, async (req, res) => {
  const { user_id } = req.body;

  const { error } = await supabase
    .from('users')
    .update({ role: 'admin' })
    .eq('id', user_id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'User promoted to admin' });
});


// POST /auth/logout
router.post('/logout', (req, res) => {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('sb-access-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 0,
      path: '/',
      sameSite: 'lax',
    })
  );
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;