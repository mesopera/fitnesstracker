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
    const { name, email, phone, nickname, gender, age, weight, height } = req.body;
    // Insert user data into database
    const [result] = await pool.query(
      'INSERT INTO userdata (name, email, phone, nickname, gender, age, weight, height) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, phone, nickname, gender, age, weight, height]
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
    const [rows] = await pool.query('SELECT * FROM userdata WHERE id = ?', [userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(rows[0]);
  } 
    catch (error) {
      console.error('Error fetching user data:', error);
      return res.status(500).json({ error: 'Failed to fetch user data' });
    }
});

// API endpoint to save food/diet details
app.post('/api/save-diet', async (req, res) => {
  try {
    const { user_id, food_name, preptime, calories, date } = req.body;
    
    // Insert food data into database
    const [result] = await pool.query(
      'INSERT INTO diet (user_id, food_name, preptime, calories, date) VALUES (?, ?, ?, ?, ?)',
      [user_id, food_name, preptime, calories, date || new Date()]
    );
    
    return res.status(201).json({ 
      success: true, 
      message: 'Food data saved successfully',
      dietEntryId: result.insertId
    });
  } catch (error) {
    console.error('Error saving food data:', error);
    return res.status(500).json({ error: 'Failed to save food data' });
  }
});

// API endpoint to get all diet entries for a user
app.get('/api/diet/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const [rows] = await pool.query('SELECT * FROM diet WHERE user_id = ? ORDER BY date DESC', [userId]);
    
    return res.json(rows);
  } catch (error) {
    console.error('Error fetching diet data:', error);
    return res.status(500).json({ error: 'Failed to fetch diet data' });
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