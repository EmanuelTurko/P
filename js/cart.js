// Global variable to store the cart count
let cartCount = 0;

// Function to update the cart badge count in the UI
function updateCartBadge() {
  console.log('Updating cart badge...');
  const cartBadge = document.querySelector('.cart-badge');
  cartBadge.textContent = cartCount;
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
          cartCount++;
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
