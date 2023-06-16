const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const path = require('path');

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/Customer', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define a schema for the "register" collection
const registerSchema = new mongoose.Schema({
  username: String,
  password: String
});

// Create a model for the "register" collection
const Register = mongoose.model('register', registerSchema);

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.resolve(__dirname, 'C:\\Users\\Berse\\.vscode\\Matala\\IntApps\\P\\P')));

// Set the default route to redirect to index.html
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

// Handle registration form submission
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Create a new document using the Register model
  const newUser = new Register({ username, password });

  // Save the new user document to the "register" collection
  newUser.save()
    .then(() => {
      res.send('Registration successful');
    })
    .catch((error) => {
      console.error('Error registering user:', error);
      res.status(500).send('Registration failed');
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
