// logout.js

function logout() {
    // Perform additional logout actions here
    // For example:
    console.log('Logout function called');
    // Make an AJAX request to the server to clear the session and update the login status
    fetch('/logout', {
      method: 'POST'
    })
      .then(response => {
        if (response.ok) {
          // Clear user-specific data
          // For example, if you have a cart associated with the user, clear the cart data
        // clearCart();
  
          // Redirect to the desired page after logout
          window.location.href = 'index.html';
        } else {
          console.error('Error clearing session:', response.statusText);
          // Handle any errors that occur during session clearing
        }
      })
      .catch(error => {
        console.error('Error clearing session:', error);
        // Handle any errors that occur during session clearing
      });
  }
  
  // Wait for the DOM to load
  document.addEventListener('DOMContentLoaded', () => {
    // Add event listener to the logout button
    const logoutButton = document.getElementById('logout-link');
    logoutButton.addEventListener('click', logout);
  });
  