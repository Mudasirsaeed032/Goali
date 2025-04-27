const cookie = require('cookie');
const { supabase } = require('../supabaseClient');

const checkAuth = async (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies['sb-access-token'];

  console.log('== Incoming Request to /protected ==');
  console.log('[Access Token]', token?.slice(0, 20) + '...');

  if (!token) {
    console.error('❌ No token found in cookie.');
    return res.status(403).json({ error: 'No token in cookie' });
  }

  const { data: userSession, error } = await supabase.auth.getUser(token);

  if (error || !userSession?.user) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  const userId = userSession.user.id;

  const { data: userProfile, error: profileError } = await supabase
    .from('users')
    .select('role, full_name')
    .eq('id', userId)
    .single();

  if (profileError) {
    console.error('❌ Profile lookup failed:', profileError.message);
    return res.status(500).json({ error: 'Profile lookup failed' });
  }

  if (!userProfile) {
    console.error('❌ No profile found for user ID:', userId);
    return res.status(403).json({ error: 'No profile found' });
  }

  console.log('✅ Authenticated:', userSession.user.email, '| Role:', userProfile.role);

  req.user = {
    ...userSession.user,
    role: userProfile.role,
    full_name: userProfile.full_name
  };

  next();
};

module.exports = checkAuth;
