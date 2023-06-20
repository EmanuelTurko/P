const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

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
app.use(express.static(path.join(__dirname, 'public')));

// Set the default route to redirect to index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve static files from the 'css' directory
app.use('/css', express.static(path.join(__dirname, 'css')));
// Serve static files from the 'images' directory
app.use('/images', express.static(path.join(__dirname, 'images')));
// Serve static files from the 'js' directory
app.use('/js', express.static(path.join(__dirname, 'js')));

// Serve HTML files dynamically
app.get('/:page.html', (req, res) => {
  const { page } = req.params;
  res.sendFile(path.join(__dirname, `${page}.html`));
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

/// Handle login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists in the database
  Register.findOne({ username })
    .then((user) => {
      if (user && user.password === password) {
        res.sendFile(path.join(__dirname, 'index.html'));
      } else {
        res.status(200).send('Invalid username or password');
      }
    })
    .catch((error) => {
      console.error('Error logging in:', error);
      res.status(500).send('Login failed');
    });
});

// Serve login.html
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Handle logout
app.get('/logout', (req, res) => {
  // Perform any logout logic here
  res.redirect('/login.html'); // Redirect to the login page
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
