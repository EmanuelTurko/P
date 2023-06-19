// login.js

function updateNavbar() {
    var isLoggedIn = sessionStorage.getItem("isLoggedIn");

    var logoutLink = document.getElementById("logoutLink");
    var loginLink = document.getElementById("loginLink");
    var registerLink = document.getElementById("registerLink");

    if (isLoggedIn === "true") {
        logoutLink.style.display = "block";
        loginLink.style.display = "none";
        registerLink.style.display = "none";
    } else {
        logoutLink.style.display = "none";
        loginLink.style.display = "block";
        registerLink.style.display = "block";
    }
}
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
  
// Call the updateNavbar function when the page is loaded
window.addEventListener('DOMContentLoaded', updateNavbar);

// Call the checkLoggedIn function when the page is loaded
window.addEventListener('DOMContentLoaded', checkLoggedIn);