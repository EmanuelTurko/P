document.addEventListener('DOMContentLoaded', initializeAdmin);

function initializeAdmin() {
  const addItemForm = document.getElementById('addItemForm');
  const itemsContainer = document.getElementById('itemsContainer');
  const toggleUsersButton = document.getElementById('toggleUsersButton');
  toggleUsersButton.addEventListener('click', toggleUsersTable);

  // Add event listener to the "Add" button in the form
  addItemForm.addEventListener('submit', addItem);


  // Function to fetch all items from the server
  function fetchItems() {
    fetch('/items')
      .then(response => response.json())
      .then(items => {
        // Render the items on the page
        renderItems(items);
      })
      .catch(error => {
        console.error('Error fetching items:', error);
      });
  }
  
// Function to remove all child nodes from an element
function removeAllChildNodes(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
// Function to render the items on the page
function renderItems(items) {
  const itemsContainer = document.getElementById('itemsContainer');

  // Clear the container
  removeAllChildNodes(itemsContainer);

  // Create a table
  const table = document.createElement('table');
  table.classList.add('item-table');

  // Create the table headers
  const tableHeaderRow = document.createElement('tr');
  const headers = ['Name', 'Price', 'Stock','ShippingFee', 'Action'];
  headers.forEach(headerText => {
    const header = document.createElement('th');
    header.textContent = headerText;
    tableHeaderRow.appendChild(header);
  });
  table.appendChild(tableHeaderRow);
  

  // Iterate over the items and create table rows for each item
  items.forEach(item => {
    const tableRow = document.createElement('tr');

    // Create the table cells for each item property
    const nameCell = document.createElement('td');
    nameCell.textContent = item.name;
    tableRow.appendChild(nameCell);

    const priceCell = document.createElement('td');
    priceCell.textContent = `$${item.price}`;
    tableRow.appendChild(priceCell);

    const stockCell = document.createElement('td');
    stockCell.textContent = item.stock;
    tableRow.appendChild(stockCell);

    const shippingCell = document.createElement('td');
    shippingCell.textContent = `${item.shipping}`;
    tableRow.appendChild(shippingCell);

    const removeCell = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      removeItem(item.itemId);
    });
    removeCell.appendChild(removeButton);
    tableRow.appendChild(removeCell);
  table.appendChild(tableRow);
  });

  // Append the table to the container
  itemsContainer.appendChild(table);
}



// Function to add a new item
function addItem(event) {
  event.preventDefault();

  // Retrieve the form input values
  const itemNameInput = document.getElementById('Item');
  const stockInput = document.getElementById('stock');
  const priceInput = document.getElementById('price');
  const shippingInput = document.getElementById('shipping');
  const itemIdInput = document.getElementById('itemId');

  const newItem = {
    name: itemNameInput.value,
    stock: parseInt(stockInput.value),
    price: parseFloat(priceInput.value),
    shipping: shippingInput.value === 'free' ? 'free' : parseFloat(shippingInput.value),
    itemId: 'item' + itemIdInput.value
  };

  // Send an HTTP POST request to the `/items` endpoint
  fetch('/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newItem)
  })
    .then(response => {
      if (response.ok) {
        console.log('Item added successfully');
        // Clear the form inputs
        itemNameInput.value = '';
        stockInput.value = '';
        priceInput.value = '';
        shippingInput.value = '';
        itemIdInput.value = '';

        // Refresh the item list
        fetchItems();
      } else {
        console.error('Failed to add item:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Error adding item:', error);
    });
}

  // Function to remove an item
  function removeItem(itemId) {
    // Send an HTTP DELETE request to the API endpoint
    fetch(`/items/${itemId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          console.log('Item removed successfully');
          // Refresh the item list
          fetchItems();
        } else {
          console.error('Failed to remove item:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error removing item:', error);
      });
  }

  // Call fetchItems initially when the page loads
  fetchItems();
 // Call fetchUsers initially when the page loads
  fetchUsers();
}

// Function to toggle the visibility of the items container
function toggleItemsContainer() {
  const itemsContainer = document.getElementById('itemsContainer');
  const toggleItemsButton = document.getElementById('toggleItemsButton');

  if (itemsContainer.style.display === 'none') {
    itemsContainer.style.display = '';
    toggleItemsButton.textContent = 'Hide';
  } else {
    itemsContainer.style.display = 'none';
    toggleItemsButton.textContent = 'Show All Items';
  }
}

// Attach an event listener to the toggle button
const toggleItemsButton = document.getElementById('toggleItemsButton');
toggleItemsButton.addEventListener('click', toggleItemsContainer);

// Hide the items container on page load
document.addEventListener('DOMContentLoaded', function () {
  const itemsContainer = document.getElementById('itemsContainer');
  itemsContainer.style.display = 'none';
});
function searchItems() {
  console.log('Search button clicked'); // Debugging statement

  const searchInput = document.getElementById('searchInput');
  const searchKeyword = searchInput.value.toLowerCase().trim();

  console.log('Search keyword:', searchKeyword); // Debugging statement

  // Fetch the items from the server
  fetch('/items')
    .then(response => response.json())
    .then(items => {
      console.log('Fetched items:', items); // Debugging statement

      // Filter the items based on the search keyword
      const filteredItems = items.filter(item => {
        const itemName = item.name.toLowerCase();
        const itemPrice = item.price.toString();
        const itemStock = item.stock;

        return (
          itemName.includes(searchKeyword) ||
          itemPrice.includes(searchKeyword) ||
          itemStock === parseInt(searchKeyword)
        );
      });

      console.log('Filtered items:', filteredItems); // Debugging statement

      // Clear the container
      const itemsContainer = document.getElementById('itemsContainer');
      itemsContainer.innerHTML = '';

      // Create a table
      const table = document.createElement('table');
      table.classList.add('item-table');

      // Create the table headers
      const tableHeaderRow = document.createElement('tr');
      const headers = ['Name', 'Price', 'Stock', 'Action'];
      headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        tableHeaderRow.appendChild(header);
      });
      table.appendChild(tableHeaderRow);

      // Iterate over the filtered items and create table rows for each item
      filteredItems.forEach(item => {
        const tableRow = document.createElement('tr');

      // Create the table cells for each item property
    const nameCell = document.createElement('td');
    nameCell.textContent = item.name;
    tableRow.appendChild(nameCell);

    const priceCell = document.createElement('td');
    priceCell.textContent = `$${item.price}`;
    tableRow.appendChild(priceCell);

    const stockCell = document.createElement('td');
    stockCell.textContent = item.stock;
    tableRow.appendChild(stockCell);

    const shippingCell = document.createElement('td');
    shippingCell.textContent = `${item.shipping}`;
    tableRow.appendChild(shippingCell);

    const removeCell = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      removeItem(item.itemId);
    });
    removeCell.appendChild(removeButton);
    tableRow.appendChild(removeCell);

    const updateCell = document.createElement('td');
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.addEventListener('click', () => {
      updateItem(item.itemId);
        // Add event listener to the update button
  updateButton.addEventListener('click', () => {
    updateItem(item.itemId);
  });
    });
    updateCell.appendChild(updateButton);
    tableRow.appendChild(updateCell);
    table.appendChild(tableRow);
  });

  // Append the table to the container
  itemsContainer.appendChild(table);
})
    .catch(error => {
      console.error('Error fetching items:', error);
    });
}


// Attach an event listener to the search button
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', searchItems);

// ...
// Function to perform the item removal operation
// Function to remove an item
function removeItem(itemId) {
  // Perform the removal operation
  const url = `http://localhost:3000/items/${itemId}`;

  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      // Include any necessary headers for authentication or other purposes
    },
  })
    .then(response => {
      if (response.ok) {
        // Item successfully removed
        console.log('Item removed successfully');
        // You can perform any necessary UI updates or other actions
      } else {
        // Handle the error if the removal operation failed
        console.error('Failed to remove item');
        // You can display an error message or perform other error handling
      }
    })
    .catch(error => {
      // Handle any network or other errors
      console.error('An error occurred:', error);
    });
}

// Function to perform the item removal operation
function performItemRemoval(itemId) {
  // This function is responsible for calling removeItem
  removeItem(itemId);
}

// Code that creates the remove button and sets up the event listener
const removeButton = document.createElement('button');
removeButton.textContent = 'Remove';
removeButton.addEventListener('click', () => {
  const itemId = /* retrieve the itemId */
  performItemRemoval(itemId);
});

/// Update Button

// Function to populate the updateItemId select element with itemIds
function populateItemIdSelect() {
  fetch('/items')
    .then(response => response.json())
    .then(data => {
      const updateItemIdSelect = document.getElementById('updateItemId');
      updateItemIdSelect.innerHTML = ''; // Clear previous options

      // Create and append option elements for each itemId
      data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.itemId;
        option.textContent = item.itemId;
        updateItemIdSelect.appendChild(option);
      });

      // Add onchange event listener to the select element
      updateItemIdSelect.onchange = fetchItemDetails;
    })
    .catch(error => {
      console.error('Error fetching itemIds:', error);
    });
}

// Function to fetch and display item details based on selected itemId
function fetchItemDetails() {
  const updateItemIdSelect = document.getElementById('updateItemId');
  const selectedItemId = updateItemIdSelect.value;

  // Make a GET request to fetch item details based on itemId
  fetch(`/items/${selectedItemId}`)
    .then(response => response.json())
    .then(item => {
      // Fill out the form fields with item details
      console.log(selectedItemId);
      document.getElementById('updateItem').value = item.name;
      document.getElementById('updateStock').value = item.stock;
      document.getElementById('updatePrice').value = item.price;
      document.getElementById('updateShipping').value = item.shipping;
      // Construct the image URL dynamically based on the item ID
      const imageId = selectedItemId.replace('item', ''); // Remove 'item' from the ID
      const imageURL = `images/img${imageId}.jpg`;

      // Check if the image URL exists
      fetch(imageURL)
        .then(response => {
          if (response.ok) {
            document.getElementById('updateImageURL').value = imageURL;
          } else {
            document.getElementById('updateImageURL').value = 'No Image Implemented';
          }
        })
        .catch(error => {
          console.error('Error checking image URL:', error);
          document.getElementById('updateImageURL').value = null;
        });
    })
    .catch(error => {
      console.error('Error fetching item details:', error);
    });
}

// Call the function to populate the select element on page load
populateItemIdSelect();

function UpdateNewInfo() {
  const itemId = document.getElementById('updateItemId').value;
  const updatedItem = {
    name: document.getElementById('updateItem').value,
    stock: document.getElementById('updateStock').value,
    price: parseFloat(document.getElementById('updatePrice').value),
    shipping: document.getElementById('updateShipping').value,
    imageURL: document.getElementById('updateImageURL').value,
  };

  console.log('Updated item details:', updatedItem);

  fetch(`/items/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedItem),
  })
    .then(response => {
      if (response.ok) {
        console.log('Item details updated successfully');
        // Handle success
      } else {
        console.error('Error updating item details:', response.statusText);
        // Handle error
      }
    })
    .catch(error => {
      console.error('Error updating item details:', error);
      // Handle error
    });
}
function fetchUsers() {
  fetch('/users')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      return response.json();
    })
    .then(users => {
      console.log('Fetched users:', users);
      renderUsers(users);
    })
    .catch(error => {
      console.error('Error fetching users:', error);
      // Display an error message on the page
      const errorContainer = document.getElementById('errorContainer');
      errorContainer.textContent = 'Failed to fetch users. Please try again later.';
    });
}

// Function to render the users' data in the table
function renderUsers(users) {
  const usersTable = document.getElementById('usersTable');

  // Clear the table body
  usersTable.innerHTML = '';

  // Create table rows for each user
  users.forEach(user => {
    const tableRow = document.createElement('tr');

    // Create table cells for each user property
    const usernameCell = document.createElement('td');
    usernameCell.textContent = user.name;
    tableRow.appendChild(usernameCell);

    const fullNameCell = document.createElement('td');
    fullNameCell.textContent = user.fullName;
    tableRow.appendChild(fullNameCell);

    const cityCell = document.createElement('td');
    cityCell.textContent = user.city;
    tableRow.appendChild(cityCell);

    const ordersCell = document.createElement('td');
    ordersCell.textContent = user.orders || 0; // If 'orders' is undefined, set it to 0
    tableRow.appendChild(ordersCell);

    const roleCell = document.createElement('td');
    roleCell.textContent = user.role || 'User'; // If 'role' is undefined, set it to 'User'
    tableRow.appendChild(roleCell);

    // Add the row to the table
    usersTable.appendChild(tableRow);
  });
}

// Function to toggle the visibility of the users table
function toggleUsersTable() {
  const usersTableContainer = document.getElementById('usersTableContainer');
  const toggleUsersButton = document.getElementById('toggleUsersButton');

  if (usersTableContainer.style.display === 'none') {
    // Fetch and render the users' data
    fetchUsers();

    usersTableContainer.style.display = '';
    toggleUsersButton.textContent = 'Hide Users';
  } else {
    usersTableContainer.style.display = 'none';
    toggleUsersButton.textContent = 'Show Users';
  }
}
// Function to handle the SelectBox Change
function handleSearchGroupChange() {
  const searchGroup = document.getElementById('searchGroup').value;
  const searchFormContainer = document.getElementById('searchFormContainer');
  searchFormContainer.innerHTML = '';

  if (searchGroup === 'name') {
    createNameSearchForm();
  } else if (searchGroup === 'city') {
    createCitySearchForm();
  } else if (searchGroup === 'orders') {
    createOrdersSearchForm();
  }
}
function createNameSearchForm() {
  const searchFormContainer = document.getElementById('searchFormContainer');
  searchFormContainer.innerHTML = '';

  const nameSearchForm = document.createElement('form');
  nameSearchForm.innerHTML = `
    <label for="fullName">Full Name:</label>
    <input type="text" id="fullName" />
    <button type="submit">Search</button>
  `;
  nameSearchForm.addEventListener('submit', handleNameSearch);

  searchFormContainer.appendChild(nameSearchForm);
}

function handleNameSearch(event) {
  event.preventDefault();

  const fullName = document.getElementById('fullName').value.trim();

  // Perform the search and update the user table
  // Fetch the users from the server based on the full name and update the table accordingly
  // ...
}
function createCitySearchForm() {
  const searchFormContainer = document.getElementById('searchFormContainer');
  searchFormContainer.innerHTML = '';

  const citySearchForm = document.createElement('form');
  citySearchForm.innerHTML = `
    <label for="city">City:</label>
    <select id="city">
      <option value="Ashdod">Ashdod</option>
      <option value="Jerusalem">Jerusalem</option>
      <option value="Tel Aviv-Yafo">Tel Aviv-Yafo</option>
      <option value="Haifa">Haifa</option>
      <option value="Netanya">Netanya</option>
      <option value="Lod">Lod</option>
      <option value="Holon">Holon</option>
    </select>
    <button type="submit">Search</button>
  `;
  citySearchForm.addEventListener('submit', handleCitySearch);

  searchFormContainer.appendChild(citySearchForm);
}

function handleCitySearch(event) {
  event.preventDefault();

  const city = document.getElementById('city').value;

  // Perform the search and update the user table
  fetch(`/users/${city}`)
    .then(response => response.json())
    .then(users => {
      // Render the users' data on the page
      renderUsers(users);
    })
    .catch(error => {
      console.error('Error fetching users:', error);
    });
}
function createOrdersSearchForm() {
  const searchFormContainer = document.getElementById('searchFormContainer');
  searchFormContainer.innerHTML = '';

  const ordersSearchForm = document.createElement('form');
  ordersSearchForm.innerHTML = `
    <label for="orderStatus">Order Status:</label>
    <select id="orderStatus">
      <option value="all">All</option>
      <option value="made">Orders Made</option>
      <option value="not-made">Orders Not Made</option>
    </select>
    <button type="submit">Search</button>
  `;
  ordersSearchForm.addEventListener('submit', handleOrdersSearch);

  searchFormContainer.appendChild(ordersSearchForm);
}

function handleOrdersSearch(event) {
  event.preventDefault();

  const orderStatus = document.getElementById('orderStatus').value;

  // Perform the search and update the user table
  // Fetch the users from the server based on the order status and update the table accordingly
  // ...
}