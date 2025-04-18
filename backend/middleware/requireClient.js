const requireClient = (req, res, next) => {
    if (req.user?.role !== 'client') {
      return res.status(403).json({ error: 'Clients only' });
    }
    next();
  };
  