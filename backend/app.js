const express = require("express");
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000", // Your React app's URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
require('dotenv').config();
// const SECRET_KEY = process.env.SECRET_KEY;
const connectDB = require("./config/database_config");
const user_routes = require('./routes/userRoute');
const order_routes = require('./routes/orderRoute');
const inventory_routes = require('./routes/inventoryRoute');
const leave_routes = require('./routes/leaveRoute');
const postnotifier_routes = require('./routes/postNotifierRoute');
const cors = require("cors");
const path = require("path")

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use("/uploads",express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
    res.send("Welcome to Laundry & Dry-Cleaning App!");
});

app.use('/api/users', user_routes);
app.use('/api/orders', order_routes);
app.use('/api/users/admin/inventory', inventory_routes);
app.use('/api/leave', leave_routes);
app.use('/api/post-notifier', postnotifier_routes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

http.listen(process.env.PORT, () => {
    console.log('Server running...')
    connectDB();
})