const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;
const path = require('path');

// Connect to MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/Customer', { useNewUrlParser: true, useUnifiedTopology: true })
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
app.use(express.static(path.resolve(__dirname, 'public')));

// Configure session middleware
app.use(
  session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
  })
);

// Set the default route to redirect to index.html
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

// Handle registration form submission
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Create a new document using the Register model
  const newUser = new Register({ username, password });

  // Save the new user document to the "register" collection
  newUser
    .save()
    .then(() => {
      res.redirect('/index.html?registered=true');
    })
    .catch((error) => {
      console.error('Error registering user:', error);
      res.status(500).send('Registration failed');
    });
});

// Handle login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists in the database
  Register.findOne({ username })
    .then((user) => {
      if (user && user.password === password) {
        // Set the username in the session
        req.session.username = username;
        res.redirect('/index.html');
      } else {
        res.status(401).send('Invalid username or password');
      }
    })
    .catch((error) => {
      console.error('Error logging in:', error);
      res.status(500).send('Login failed');
    });
});

// Handle logout
app.get('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error logging out:', err);
    }
    res.redirect('/login.html');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
