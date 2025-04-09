const express = require("express");
const app = express();
const port = 3000; // Change if needed
const { pool, testConnection, initDatabase } = require('./database');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from your website folder
app.use(express.static(__dirname + "/website"));

// API endpoint to save user data
app.post('/api/save-user', async (req, res) => {
  try {
    const { gender, age, weight, height } = req.body;
    
    // Basic validation
    if (!gender || !age) {
      return res.status(400).json({ error: 'Gender and age are required' });
    }
    
    // Insert user data into database
    const [result] = await pool.query(
      'INSERT INTO users (gender, age, weight, height) VALUES (?, ?, ?, ?)',
      [gender, age, weight || null, height || null]
    );
    
    return res.status(201).json({ 
      success: true, 
      message: 'User data saved successfully',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Error saving user data:', error);
    return res.status(500).json({ error: 'Failed to save user data' });
  }
});

// API endpoint to get user data by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Initialize the application
async function initApp() {
  // Test database connection
  const dbConnected = await testConnection();
  
  if (dbConnected) {
    // Initialize database tables
    await initDatabase();
    
    // Start server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } else {
    console.error('Exiting application due to database connection failure');
    process.exit(1);
  }
}

initApp();