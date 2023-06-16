const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;
const path = require('path');

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Serve static files from the 'public' directory
app.use(express.static(path.resolve(__dirname, 'C:\\Users\\Berse\\.vscode\\Matala\\IntApps\\P\\P')));

// Set the default route to redirect to index.html
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});