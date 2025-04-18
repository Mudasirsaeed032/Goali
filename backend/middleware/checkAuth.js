const cookie = require('cookie');
const { supabase } = require('../supabaseClient');

const checkAuth = async (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies['sb-access-token'];
  if (!token) return res.status(401).json({ error: 'No token' });

  const { data: userSession, error } = await supabase.auth.getUser(token);
  if (error || !userSession?.user) return res.status(401).json({ error: 'Invalid session' });

  const userId = userSession.user.id;

  // Fetch user profile and role
  const { data: userProfile } = await supabase
    .from('users') // or 'profiles'
    .select('role, full_name')
    .eq('id', userId)
    .single();

  if (!userProfile) return res.status(403).json({ error: 'No profile found' });

  req.user = {
    ...userSession.user,
    role: userProfile.role,
    full_name: userProfile.full_name
  };

  next();
};

module.exports = checkAuth;
