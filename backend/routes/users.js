const express = require('express');
const { supabase } = require('../supabaseClient');
const checkAuth = require('../middleware/checkAuth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

// ✅ GET /admin/users
router.get('/admin', checkAuth, requireAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, role, created_at')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ✅ PATCH /admin/users/:id → toggle role
router.patch('/admin/:id', checkAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !['admin', 'client'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role specified' });
  }

  const { error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: `User role updated to ${role}` });
});

module.exports = router;
