const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const crypto = require('crypto');
const secret = crypto.randomBytes(64).toString('hex');
const cookieParser = require('cookie-parser');
const { name } = require('ejs');

const app = express();
const port = 3000;
app.use(cookieParser());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/spaceshop', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
 // Define a schema for the 'supplier' collection
 // Define a schema for the 'supplier' collection
 const suppSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  stock: {
    type: Map,
    of: { type: Number },
    required: true,
    transform: (value) => {
      const stockMap = new Map();
      for (const key in value) {
        const itemId = key.split(':')[1];
        stockMap.set(itemId, value[key]);
      }
      return stockMap;
    }
  }
});
 // model for supplier
 const Supplier = mongoose.model('supplier',suppSchema);
// Adding a new supplier to the system
async function insertNewSupplier(name, location, stock) {
  try {
    const stockMap = new Map();
    Object.entries(stock).forEach(([itemId, stockValue]) => {
      const key = `itemId:${itemId}`;
      stockMap.set(key, stockValue);
    });

    const newSupplier = new Supplier({
      name: name,
      location: location,
      stock: stockMap
    });

    await newSupplier.save();
    console.log('New supplier inserted successfully:', newSupplier);
  } catch (error) {
    console.error('Error inserting new supplier:', error);
  }
}
// Insert a new supplier when needed
/*insertNewSupplier('Supplier Name', 'Supplier Location', {
  'item1': 10,
  'item2': 20,
  'item3': 15,
  'item4': 15,
  'item5': 15,
  'item6': 15,
  'item7': 15,
  'item8': 15,
  'item9': 15
});*/
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
  },
  NumOfOrders: {
    type: Number,
    default: 0
  },
  Role: {
    type: String,
    default: 'User'
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
  },
  shipping: {
    type: String, // can be Free or an integer
    required: true
  },
  itemId: {
    type: String,
    required: true
  },
  Ordered: {
  type: Number,
  default : 0
  }
});
// Create a model for the "items" collection
const Item = mongoose.model('Item', itemSchema);
// async function to update the item's stock value based on supplier's stock
// Update item stock values based on suppliers
async function updateItemStocksFromSuppliers() {
  try {
    const items = await Item.find(); // Retrieve all items from the items collection

    for (const item of items) {
      const itemID = item.itemId;
      let totalStock = 0;

      const suppliers = await Supplier.find(); // Retrieve all suppliers from the suppliers collection

      for (const supplier of suppliers) {
        const stock = supplier.stock;
        const stockValue = stock.get(`itemId:${itemID}`);
        if (stockValue !== undefined) {
          totalStock += stockValue;
        }
      }

      item.stock = totalStock;
      await item.save();
      console.log(`Stock updated for item '${itemID}': Total Stock = ${totalStock}`);
    }

    console.log('All item stocks updated successfully');
  } catch (error) {
    console.error('Error updating item stocks:', error);
  }
}

// Call the function to update item stocks from suppliers upon server bootup
updateItemStocksFromSuppliers();

// route to get Suppliers
app.get('/suppliers', async (req, res) => {
  try {
    // Fetch the suppliers from the database
    const suppliers = await Supplier.find({}, 'name');
    res.json(suppliers);
  } catch (err) {
    console.error('Error fetching suppliers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Fetch the supplier's stock

app.get('/suppliers/:name/stock/:itemId', (req, res) => {
  const supplierName = req.params.name;
  const itemId = req.params.itemId;

  // Find the supplier by name
  Supplier.findOne({ name: supplierName })
    .then((supplier) => {
      if (!supplier) {
        res.status(404).json({ error: 'Supplier not found' });
      } else {
        // Check if the supplier has the specified item in stock
        if (supplier.stock.has(itemId)) {
          const stockQuantity = supplier.stock.get(itemId);
          res.json({ itemId, stockQuantity });
        } else {
          res.status(404).json({ error: 'Item not found in stock' });
        }
      }
    })
    .catch((err) => {
      console.error('Error fetching stock:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});
// Update supplier's stock
app.post('/suppliers/:name/stock', (req, res) => {
  const supplierName = req.params.name;
  const { itemId, stockQuantity } = req.body;

  // Find the supplier by name
  Supplier.findOne({ name: supplierName })
    .then((supplier) => {
      if (!supplier) {
        res.status(404).json({ error: 'Supplier not found' });
      } else {
        // Update the supplier's stock for the specified item
        supplier.stock.set(`itemId:${itemId}`, stockQuantity);
        // Save the updated supplier
        return supplier.save()
          .then(() => {
            console.log(`Updated stock of supplier '${supplier.name}':`, supplier.stock); // Print the stock map
            res.sendStatus(200);
          });
      }
    })
    .catch((err) => {
      console.error('Error updating supplier stock:', err);
      res.status(500).json({ error: 'Internal server error' });
    });
});
// Route handler for fetching users
app.get('/users', (req, res) => {
  // Fetch users from the "register" collection
  Register.find()
    .then(users => {
      // Send the users as JSON in the response
      res.json(users);
    })
    .catch(error => {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error fetching users' });
    });
});
// GET users by city
app.get('/users/:city', (req, res) => {
  const city = req.params.city;

  Register.find({ city })
    .then(users => {
      res.json(users);
    })
    .catch(error => {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

app.post('/items/:itemId', async (req, res) => {
  try {
    const itemId = req.params.itemId;

    // Find the item by itemId
    const item = await Item.findOne({ itemId });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Update the Ordered field
    item.Ordered += 1;
    console.log(item.Ordered);
    await item.save();

    res.json({ message: 'Item purchased successfully' });
  } catch (error) {
    console.error('Error purchasing item:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/items/', async (req, res) => {
  try {
    // Fetch the items from the database and sort them based on the Ordered field in descending order
    const items = await Item.find().sort({ Ordered: -1 }).limit(3);

    // Send the items as JSON response
    res.json(items);
  } catch (error) {
    console.error('Error fetching most ordered items:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.get('/items', async (req, res) => {
  try {
    // Fetch the items from the database
    const items = await Item.find();

    // Check if the request accepts JSON response
    if (req.accepts('json')) {
      // Send the items as JSON response
      res.json(items);
    } else {
      // Render the items.html template and pass the item data
      res.render('items.html', { items });
    }
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Internal Server Error');
  }
});
// Route for UpdateItem
app.get('/items/:itemId', async (req, res) => {
  try {
    const itemId = req.params.itemId;
    console.log('Received item ID:', itemId);

    // Retrieve the item details from the database based on the custom itemId field
    console.log('Fetching item details for itemId:', itemId);
    const item = await Item.findOne({ itemId });
    console.log('Retrieved item:', item);

    // Check if the item exists
    if (!item) {
      console.error('Item not found:', itemId);
      res.status(404).send('Item Not Found');
      return;
    }

    // Add the image URL to the item data
    item.imageURL = `images/img${itemId}.jpg`;

    // Check if the request accepts JSON response
    if (req.accepts('json')) {
      // Send the item details as JSON response
      res.json(item);
    } else {
      // Render the item details as HTML response
      res.render('item-details.html', { item });
    }
  } catch (error) {
    console.error('Error fetching item details:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update item details
app.put('/items/:itemId', async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const updatedItem = req.body;

    const result = await Item.updateOne({ itemId: itemId }, updatedItem);

    if (result.nModified === 0) {
      console.error('Item not found or no modifications made:', itemId);
      return res.status(404).send('Item Not Found');
    }

    console.log('Item details updated:', itemId);
    console.log('Updated item:', updatedItem);

    return res.sendStatus(200);
  } catch (error) {
    console.error('Error updating item details:', error);
    return res.status(500).send('Internal Server Error');
  }
});

// Route to handle the POST request for adding a new item
app.post('/items', async (req, res) => {
  try {
    const { name, price, stock, shipping, itemId } = req.body;

    console.log('Received item details:');
    console.log('Name:', name);
    console.log('Price:', price);
    console.log('Stock:', stock);
    console.log('Shipping:', shipping); 
    console.log('ItemId:', itemId);

    // Create a new document using the Item model
    const newItem = new Item({ name, price, stock, shipping, itemId });

    // Save the new item document to the "items" collection
    await newItem.save();

    // Send a success response
    res.status(201).send('Item added successfully');
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).send('Internal Server Error');
  }
});
app.delete('/items/:itemId', async (req, res) => {
  try {
    const itemId = req.params.itemId;

    // Find the item by its itemId and delete it
    const deletedItem = await Item.findOneAndDelete({ itemId });

    if (deletedItem) {
      console.log('Item removed successfully');
      res.status(200).send('Item removed successfully');
    } else {
      console.log('Item not found');
      res.status(404).send('Item not found');
    }
  } catch (error) {
    console.error('Error removing item:', error);
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
          city: user.city,
          role: user.Role
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



// Define an endpoint for handling the user details submission
app.post('/userDetails', (req, res) => {
  // Retrieve the user details from the request body
  const { username, password, fullName, city } = req.body;

  // Perform any necessary processing or validation with the user details
  // For this example, let's assume the server just sends back the received data as a response
  const userDetails = {
    username: username,
    password: password,
    fullName: fullName,
    city: city
  };

  // Send the user details as a response
  res.json(userDetails);
});


  app.get('/user/:username', (req, res) => {
    const username = req.params.username;
  
    MongoClient.connect(url, (err, client) => {
      if (err) {
        console.error('Failed to connect to MongoDB:', err);
        res.status(500).send('Failed to connect to MongoDB');
        return;
      }
  
      const db = client.db('spaceshop'); 
      const collection = db.collection('users'); 
  
      collection.findOne({ username }, (err, user) => {
        if (err) {
          console.error('Failed to retrieve user:', err);
          res.status(500).send('Failed to retrieve user');
          return;
        }
  
        if (!user) {
          res.status(404).send('User not found');
          return;
        }
  
        res.json(user);
      });
    });
  });

  // Handle PUT request to update user's NumOfOrders
app.put('/users/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Find the user in the database
    const user = await Register.findOne({ name: username });

    if (user) {
      // Update the NumOfOrders field
      user.NumOfOrders += 1;
      console.log(user.NumOfOrders);
      // Save the updated user
      await user.save();

      // Send a success response
      res.status(200).json({ message: 'NumOfOrders updated successfully' });
    } else {
      // User not found
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    // Handle any errors that occur during the update
    console.error('Error updating user information:', error);
    res.status(500).json({ error: 'An error occurred while updating user information' });
  }
});

// Serve the update profile form
app.get('/profile.html', async (req, res) => {
  try {
    // Retrieve the user data from the database based on the logged-in user's information
    const user = await Register.findOne({ name: req.cookies.username });

    if (user) {
      res.render('profile', { user }); // Pass the user data to the template
    } else {
      res.redirect('/login.html'); // Redirect if user not found
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.redirect('/login.html');
  }
});