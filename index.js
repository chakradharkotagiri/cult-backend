require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');




const app = express();

// ✅ Connect to MongoDB
connectDB();
const allowedOrigins = [
    process.env.FRONTEND_URL,        // e.g. prod URL
    "http://localhost:5173"          // dev URL
  ];

// ✅ Middleware should come before routes
app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  }));
app.use(express.json()); // For JSON body parsing
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/', require('./routes/userRoutes'))


app.get('/', (req, res) => {
    res.send('Cult backend is live !');
});

// ✅ Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(` 🚀 Server is running on port ${PORT}`);
});
