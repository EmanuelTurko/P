document.addEventListener('DOMContentLoaded', initializeAdmin);

function initializeAdmin() {
  const addItemForm = document.getElementById('addItemForm');
  const itemsContainer = document.getElementById('itemsContainer');

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
  const headers = ['Name', 'Price', 'Stock','ShippingFee', 'Action ','Requested'];
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

    const updateCell = document.createElement('td');
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.addEventListener('click', () => {
      updateItem(item.itemId);
    });
    updateCell.appendChild(updateButton);
    tableRow.appendChild(updateCell);

    // Append the table row to the table
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
      shipping: shippingInput.value,
      itemId: itemIdInput.value
    };

    // Send an HTTP POST request to the API endpoint
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

  // Function to update an item
  function updateItem(itemId) {
    // Implement the update functionality as per your requirement
    console.log(`Updating item with ID: ${itemId}`);
  }

  // Call fetchItems initially when the page loads
  fetchItems();
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

        const actionCell = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
          removeItem(item.itemId);
        });
        actionCell.appendChild(removeButton);
        tableRow.appendChild(actionCell);

        // Append the table row to the table
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