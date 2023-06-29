  // Function to update the cart badge count in the UI
  function updateCartBadge() {
    const cartBadge = document.querySelector('.cart-badge');
    const cartCount = getCartCount();
    
    if (cartCount <= '0') {
      cartBadge.style.display = 'none'; // Hide the cart badge
    } else {
      cartBadge.style.display = ''; // Show the cart badge
      cartBadge.textContent = cartCount;
    }
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
          if (selectedItem.stock === 0) {
            // Store the current scroll position
          const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
            showToast('The item is currently out of stock.');
          // After the toast is dismissed, restore the scroll position
          window.scrollTo(0, scrollPosition);
            return; // Don't add the item to the cart
          }

          // Get the current cart count
          let cartCount = parseInt(getCartCount());
          if (isNaN(cartCount) || cartCount < 0) {
            cartCount = 0; // Reset the cart count to 0 if it's not a valid number
          }

          // Increase cart count by 1
          cartCount += 1;
          setCartCount(cartCount.toString());

          // Update the cart badge
          updateCartBadge();

          // Add the selected item to the cart items
          const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
          cartItems.push(selectedItem);
          localStorage.setItem('cartItems', JSON.stringify(cartItems));

          // Store the current scroll position
          const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

          showToast('Item added to your cart.'); // Show the toast notification

          // After the toast is dismissed, restore the scroll position
          window.scrollTo(0, scrollPosition);

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
  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message; // Set the toast message

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

    function removeItem(itemId) {
      const itemIndex = cartItems.findIndex(item => item.itemId === itemId);
      if (itemIndex !== -1) {
        cartItems.splice(itemIndex, 1);
        updateCartDisplay();
        localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Update cart items in localStorage
    
        if (cartItems.length === 0) {
          clearCart();
          updateCartDisplay();
        }
    
        // Decrement the cart count by 1
        const cartCount = parseInt(getCartCount()) - 1;
        setCartCount(cartCount);
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

        const shippingCell = document.createElement('td');
        shippingCell.textContent = selectedItem.shipping === 'free' ? 'FREE' : selectedItem.shipping;

        const totalAmountCell = document.createElement('td');
      const shippingFee = selectedItem.shipping === 'free' ? 0 : parseFloat(selectedItem.shipping);
      const totalAmount = (selectedItem.price * quantity + shippingFee).toFixed(2);
      totalAmountCell.textContent = totalAmount;


        const actionsCell = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.style.backgroundColor = 'black';
        removeButton.innerHTML = '<i class="fas fa-trash" style="color:white; font-size: 32px;" aria-hidden="true"></i>';
        removeButton.addEventListener('mouseover', function() {
          var icon = removeButton.querySelector('i');
          if (icon) {
            icon.style.color = '#ad8fb9';
          }
        });
        
        removeButton.addEventListener('mouseout', function() {
          var icon = removeButton.querySelector('i');
          if (icon) {
            icon.style.color = 'white';
          }
        });

        removeButton.addEventListener('click', () => {
        removeItem(selectedItem.itemId);
        updateCartBadge();                               // refresh the cart after delete 
        });
        actionsCell.appendChild(removeButton);

        // Append the cells to the row
        row.appendChild(nameCell);
        row.appendChild(priceCell);
        row.appendChild(shippingCell);
        row.appendChild(totalAmountCell);
        row.appendChild(actionsCell);

        // Append the row to the table body
        cartItemsTableBody.appendChild(row);
      });
    }

function calculateTotalAmount(cartItems) {
  let totalAmount = 0;
  let shippingFees = {}; // Store the shipping fees for each item
  
  cartItems.forEach(item => {
    const { price, shipping } = item;
    const shippingFee = shipping === 'free' ? 0 : parseFloat(shipping);

    // Check if the item's shipping fee has already been added
    if (!shippingFees[item]) {
      totalAmount += shippingFee;
      shippingFees[item] = shippingFee; // Store the shipping fee for the item
    }
    
    totalAmount += price;
  });

  return totalAmount.toFixed(2);
}

    function displayTotalAmount(totalAmount, totalAmountCell) {
      totalAmountCell.textContent = totalAmount;
    }

  // Function to clear the cart
  function clearCart() {
    // Clear the cart items in localStorage
    localStorage.removeItem('cartItems');
    updateCartBadge(); // Update the cart badge
    setCartCount(0);
  }

    function removeAllTableRows(tableBody) {
      while (tableBody.firstChild) {
        tableBody.firstChild.remove();
      }
    }
  }
// Get the necessary elements for buy options
const buyNowButton = document.getElementById('buyNowButton');
const buyNowOptions = document.getElementById('buyNowOptions');
const deliveryOption = document.getElementById('deliveryOption');
const pickupOptions = document.getElementById('pickupOptions');
const deliveryOptions = document.getElementById('deliveryOptions');

// Hide buy options initially
buyNowOptions.style.display = 'none';
pickupOptions.style.display = 'none';
deliveryOptions.style.display = 'none';

// Event listener for Buy Now button
buyNowButton.addEventListener('click', () => {
  const selectedOption = deliveryOption.value;
  buyNowOptions.style.display = 'block';

  if (selectedOption !== '') {
    buyNowOptions.style.display = 'block';

    if (selectedOption === 'pickup') {
      pickupOptions.style.display = 'block';
      deliveryOptions.style.display = 'none';
    } else if (selectedOption === 'delivery') {
      pickupOptions.style.display = 'none';
      deliveryOptions.style.display = 'block';
    } else {
      pickupOptions.style.display = 'none';
      deliveryOptions.style.display = 'none';
    }
  }
});

// Event listener for Delivery option select
deliveryOption.addEventListener('change', () => {
  const selectedOption = deliveryOption.value;

  if (selectedOption === 'pickup') {
    pickupOptions.style.display = 'block';
    deliveryOptions.style.display = 'none';
    removeShippingFee(); // Add this line to remove the shipping fee
  } else if (selectedOption === 'delivery') {
    pickupOptions.style.display = 'none';
    deliveryOptions.style.display = 'block';
  } else {
    pickupOptions.style.display = 'none';
    deliveryOptions.style.display = 'none';
  }
});

function removeShippingFee() {
  const totalAmountCell = document.getElementById('totalAmountCell');
  const totalAmount = parseFloat(totalAmountCell.textContent);
  const shippingFee = calculateShippingFee(); // Calculate the shipping fee

  // Subtract the shipping fee from the total amount
  const newTotalAmount = totalAmount - shippingFee;
  totalAmountCell.textContent = newTotalAmount.toFixed(2);
}

function calculateShippingFee() {
  let totalAmount = 0;
  let shippingFees = {}; // Store the shipping fees for each item
  
  cartItems.forEach(item => {
    const { price, shipping } = item;
    const shippingFee = shipping === 'free' ? 0 : parseFloat(shipping);

    // Check if the item's shipping fee has already been added
    if (!shippingFees[item]) {
      totalAmount += shippingFee;
      shippingFees[item] = shippingFee; // Store the shipping fee for the item
    }
    
    totalAmount += price;
  });

  return totalAmount.toFixed(2);
}



// Event listener for Confirm Pickup button
const confirmPickupButton = document.getElementById('confirmPickup');
confirmPickupButton.addEventListener('click', () => {
  // Add your logic for confirming the pickup
});

// Event listener for Confirm Delivery button
const confirmDeliveryButton = document.getElementById('confirmDelivery');
confirmDeliveryButton.addEventListener('click', () => {
  // Add your logic for confirming the delivery
});
