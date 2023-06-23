const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;
app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/spaceshop', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define a schema for the "register" collection
const registerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  }
});

// Create a model for the "register" collection
const Register = mongoose.model('users', registerSchema);

// Define a schema for the "items" collection
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});


// Create a model for the "items" collection
const Item = mongoose.model('Item', itemSchema);


app.get('/items', async (req, res) => {
  try {
    // Fetch the items from the database
    const items = await Item.find();

    // Send the items as JSON response to the client
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Internal Server Error');
  }
});
// Set up session middleware
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true
}));

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
app.post('/register', async (req, res) => {
  const { name, password, fullName, city } = req.body;

  // Create a new document using the Register model
  const newUser = new Register({ name, password, fullName, city });

  // Save the new user document to the "register" collection
  try {
    await newUser.save();
    res.redirect('/index.html');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Registration failed');
  }
});

// Set the initial isLoggedIn status to false
let isLoggedIn = false;

// Handle login form submission
app.post('/login', async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await Register.findOne({ name });
    if (user && user.password === password) {
      // Update the isLoggedIn status to true
      isLoggedIn = true;

      // Set the username as a cookie
      res.cookie('username', user.name);

      res.redirect('/index.html');
    } else {
      res.redirect('/login.html?errorMessage=Invalid%20username%20or%20password');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.redirect('/register.html?errorMessage=An%20error%20occurred');
  }
});

// API endpoint to fetch login status and user data
app.get('/api/login-status', async (req, res) => {
  try {
    if (isLoggedIn) {
      // Retrieve the user data from the database based on the logged-in user's information
      const user = await Register.findOne({ name: req.cookies.username });

      if (user) {
        // Return the login status and user details
        res.json({
          isLoggedIn: true,
          username: user.name,
          password: user.password,
          fullName: user.fullName,
          city: user.city
        });
      } else {
        res.json({ isLoggedIn: false });
      }
    } else {
      res.json({ isLoggedIn: false });
    }
  } catch (error) {
    console.error('Error fetching login status:', error);
    res.json({ isLoggedIn: false });
  }
});
// Handle logout request
app.post('/logout', (req, res) => {
  // Clear the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error clearing session:', err);
      res.sendStatus(500);
    } else {
      // Update the isLoggedIn status to false
      isLoggedIn = false;
      console.log('Session cleared successfully');
      res.sendStatus(200);
    }
  });
});

// Handle update profile form submission
app.post('/update-profile', async (req, res) => {
  const { username, password, fullName, city } = req.body;

  try {
    // Find the user by username
    const user = await Register.findOne({ name: username });

    if (!user) {
      // User not found
      return res.status(404).send('User not found');
    }

    // Update the user's profile information
    if (password) {
      user.password = password;
    }
    if (fullName) {
      user.fullName = fullName;
    }
    if (city) {
      user.city = city;
    }

    // Save the updated user document
    await user.save();

    // Redirect the user to a success page or any other desired action
    res.redirect('/index.html');
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).send('Profile update failed');
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
