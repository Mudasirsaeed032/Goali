require('dotenv').config();
const express = require("express");
const cors = require("cors");
const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');
const checkAuth = require('./middleware/checkAuth');
const requireAdmin = require('./middleware/requireAdmin');

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);

app.get('/protected', checkAuth, (req, res) => {
  res.json({
    message: 'You are authorized',
    user: req.user,
  });
});


app.get('/admin/stats', checkAuth, requireAdmin, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.full_name}` });
});

app.get('/api/ping', (req, res)=>{
  res.json({message: "pong from backend!"});
})

app.get("/", (req, res) => {
  res.send("GOALI backend running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
