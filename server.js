const express = require("express");
const app = express();
const port = 3000; // Change if needed
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Middleware to parse JSON bodies
app.use(express.json());

const uri = "mongodb+srv://rajeshmahajandpspune:raj22550@dbmscp.gop7h7q.mongodb.net/?appName=dbmscp";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Define User Schema
const userSchema = new mongoose.Schema({
  gender: String,
  age: Number,
  createdAt: { type: Date, default: Date.now }
});

// Create User model
const User = mongoose.model('User', userSchema);

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Serve static files from your website folder
app.use(express.static(__dirname + "/website")); // Change "public" to your folder name

// API Endpoints
app.post('/api/save-gender', async (req, res) => {
  try {
    const { gender } = req.body;
    const user = new User({ gender });
    await user.save();
    res.json({ success: true, message: 'Gender saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/save-age', async (req, res) => {
  try {
    const { age } = req.body;
    const user = new User({ age });
    await user.save();
    res.json({ success: true, message: 'Age saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
