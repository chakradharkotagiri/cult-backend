require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');

const app = express();


connectDB();
const allowedOrigins = [
    process.env.FRONTEND_URL,        
    "http://localhost:5173"          
  ];

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  


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
app.use(express.json()); 


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/', require('./routes/userRoutes'))


app.get('/', (req, res) => {
    res.send('Cult backend is live !');
});

app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});


const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(` 🚀 Server is running on port ${PORT}`);
});


