const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const cookie = require('cookie');


router.post('/register-user', async(req, res)=>{
  const {id, full_name, role} = req.body;
  const {data, error} = await supabase
  .from('users')
  .insert([
    { id, full_name, role }
  ])

  if(error) return res.status(500).json({error: error.message});
  res.json({message: "User Profile Created"});
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