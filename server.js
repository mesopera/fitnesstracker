const express = require("express");
const app = express();
const port = 3000; // Change if needed

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from your website folder
app.use(express.static(__dirname + "/website")); // Make sure "website" folder exists

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
