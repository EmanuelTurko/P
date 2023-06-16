//logout.js


// Check if the user is logged in
function checkLoggedIn() {
  // Replace this condition with your logic to determine if the user is logged in
  var isLoggedIn = true; // Example: Set it to true if the user is logged in
  
  if (isLoggedIn) {
    // User is logged in, hide the login and register buttons
    document.getElementById('loginLink').style.display = 'none';
    document.getElementById('registerLink').style.display = 'none';
    
    // Show the logout button
    document.getElementById('logoutLink').style.display = 'block';
  }
}

// Call the checkLoggedIn function when the page is loaded
window.addEventListener('DOMContentLoaded', checkLoggedIn);