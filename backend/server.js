require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');


const checkAuth = require('./middleware/checkAuth');
const requireAdmin = require('./middleware/requireAdmin');
const fundraisersRoute = require('./routes/fundraisers');
const authRoutes = require('./routes/auth');
const auctionRoutes = require('./routes/auctionItems');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  }
})

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

//Routes
app.use('/auth', authRoutes);
app.use('/fundraisers', fundraisersRoute);
app.use('/auction', auctionRoutes);


//Example protected route
app.get('/protected', checkAuth, (req, res) => {
  res.json({
    message: 'You are authorized',
    user: req.user,
  });
});

//Admin only routes
app.get('/admin/stats', checkAuth, requireAdmin, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.full_name}` });
});

//Basic health check
app.get('/api/ping', (req, res) => {
  res.json({ message: "pong from backend!" });
})

//Home
app.get("/", (req, res) => {
  res.send("GOALI backend running!");
});

// SOCKET.IO setup
io.on('connection', (socket) => {
  console.log('New client connected ✅');

  socket.on('disconnect', () => {
    console.log('Client disconnected ❌');
  });

  socket.on('place_bid', (bidData) => {
    console.log('New bid received:', bidData);
    io.emit('new_bid', bidData); // Broadcast to all clients
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
