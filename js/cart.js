// Function to update the cart badge count in the UI
function updateCartBadge() {
  const cartBadge = document.querySelector('.cart-badge');
  cartBadge.textContent = getCartCount();
}

// Function to get the cart count from localStorage
function getCartCount() {
  return localStorage.getItem('cartCount') || '0';
}

// Function to set the cart count in localStorage
function setCartCount(count) {
  localStorage.setItem('cartCount', count);
}

function addToCart(itemId) {
  // Fetch item data from the server
  fetch('/items')
    .then(response => response.json())
    .then(items => {
      // Find the item with the given itemId
      const selectedItem = items.find(item => item.itemId === itemId);

      if (selectedItem) {
        // Increase cart count by 1
        const cartCount = parseInt(getCartCount()) + 1;
        setCartCount(cartCount.toString());

        // Update the cart badge
        updateCartBadge();

        showToast(); // Show the toast notification

        // Add the selected item to the cart items
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems.push(selectedItem);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        console.log('Item added to cart:', selectedItem);
      } else {
        console.log('Item not found.');
      }
    })
    .catch(error => {
      console.error('Error fetching items:', error);
    });
}

// Call updateCartBadge initially when the page loads
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
});



  // Function to show the toast notification
  function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('hide');
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      toast.classList.add('hide');
    }, 2000); // Hide the toast after 2 seconds
  }
// Call updateCartBadge initially when the page loads
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
});

// Table for the cart
// JavaScript
document.addEventListener('DOMContentLoaded', initializeCart);

function initializeCart() {
  const cartItemsTableBody = document.getElementById('cartItemsTableBody');
  const clearCartButton = document.getElementById('clearCartButton');
  const totalAmountCell = document.getElementById('totalAmountCell');
  const emptyCartMessage = document.getElementById('emptyCartMessage');
  const cartContainer = document.getElementById('cartContainer');

  // Retrieve the cart items from localStorage
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  // Function to update cart display based on cartItems state
  function updateCartDisplay() {
    if (cartItems.length > 0) {
      // Populate the cart table
      populateCartTable(cartItems, cartItemsTableBody);

      // Calculate and display the total amount
      const totalAmount = calculateTotalAmount(cartItems);
      displayTotalAmount(totalAmount, totalAmountCell);

      // Show the cart table
      cartContainer.style.display = 'block';

      // Hide the empty cart message
      emptyCartMessage.style.display = 'none';
    } else {
      // Hide the cart table
      cartContainer.style.display = 'none';

      // Show the empty cart message
      emptyCartMessage.style.display = 'block';
    }
  }

  // Initialize cart display
  updateCartDisplay();

  // Add event listener for the "Clear Cart" button
  clearCartButton.addEventListener('click', () => {
    clearCart();
    cartItems = [];
    removeAllTableRows(cartItemsTableBody);
    displayTotalAmount(0, totalAmountCell);
    updateCartDisplay();

    if (cartItems.length === 0) {
      location.reload(); // Refresh the page when cart is empty
    }
  });

  // Function to remove an item from the cart
  function removeItem(itemId) {
    const itemIndex = cartItems.findIndex(item => item.itemId === itemId);
    if (itemIndex !== -1) {
      cartItems.splice(itemIndex, 1);
      updateCartDisplay();

      if (cartItems.length === 0) {
        clearCart();
        updateCartDisplay();
      }
    }
  }

  function populateCartTable(cartItems, cartItemsTableBody) {
    // Clear the table body
    removeAllTableRows(cartItemsTableBody);

    // Create a map to store the total quantity of each item
    const itemQuantityMap = new Map();

    // Iterate over the cart items and update the item quantity map
    cartItems.forEach(item => {
      const { itemId } = item;
      const quantity = itemQuantityMap.get(itemId) || 0;
      itemQuantityMap.set(itemId, quantity + 1);
    });

    // Iterate over the item quantity map and populate the table rows
    itemQuantityMap.forEach((quantity, itemId) => {
      const selectedItem = cartItems.find(item => item.itemId === itemId);

      // Create a table row for the item
      const row = document.createElement('tr');

      // Create table cells for the item details
      const imageCell = document.createElement('td');
      const image = document.createElement('img');

      const itemNumber = parseInt(itemId.replace('item', ''), 10);
      if (!isNaN(itemNumber)) {
        image.src = `images/img${itemNumber}.jpg`; // Set the image source based on the item number
      } else {
        image.src = 'images/default.jpg'; // Set a default image source for other items
      }

      image.alt = selectedItem.name; // Set the alt attribute to the item name
      image.style.width = '50px'; // Adjust the width as needed
      imageCell.appendChild(image);
      row.appendChild(imageCell);

      const nameCell = document.createElement('td');
      nameCell.textContent = selectedItem.name;

      const priceCell = document.createElement('td');
      priceCell.textContent = selectedItem.price;

      const totalAmountCell = document.createElement('td');
      totalAmountCell.textContent = (selectedItem.price * quantity).toFixed(2);

      const actionsCell = document.createElement('td');
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => {
        removeItem(selectedItem.itemId);
      });
      actionsCell.appendChild(removeButton);

      // Append the cells to the row
      row.appendChild(nameCell);
      row.appendChild(priceCell);
      row.appendChild(totalAmountCell);
      row.appendChild(actionsCell);

      // Append the row to the table body
      cartItemsTableBody.appendChild(row);
    });
  }

  function calculateTotalAmount(cartItems) {
    let totalAmount = 0;

    cartItems.forEach(item => {
      const { price } = item;
      totalAmount += price;
    });

    return totalAmount.toFixed(2);
  }

  function displayTotalAmount(totalAmount, totalAmountCell) {
    totalAmountCell.textContent = totalAmount;
  }

  function clearCart() {
    // Clear the cart items in localStorage
    localStorage.removeItem('cartItems');
  }

  function removeAllTableRows(tableBody) {
    while (tableBody.firstChild) {
      tableBody.firstChild.remove();
    }
  }
}
