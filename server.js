const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./backend/config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the project root
app.use(express.static(__dirname));

// API Test Route
app.get('/api', (req, res) => res.send('API Running'));

// Routes
app.use('/api/hotels', require('./backend/routes/hotels'));
app.use('/api/activities', require('./backend/routes/activities'));
app.use('/api/restaurants', require('./backend/routes/restaurants'));
app.use('/api/chat', require('./backend/routes/chat'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
