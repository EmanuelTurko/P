function isLoggedIn() {
    // Implement your logic to determine if the user is logged in
    // For example, you can check if there is a session or token indicating a logged-in user
    // Return true if logged in, false otherwise
    return true; // Set to false to simulate being logged out by default
  }
  // Update the visibility of login and register links based on the logged-in status
  function updateNavbar() {
    var loginLink = document.getElementById("loginLink");
    var registerLink = document.getElementById("registerLink");
    var loggedInUsernameElement = document.getElementById("loggedInUsername");
  
    if (isLoggedIn()) {
      loginLink.style.display = "none"; // Hide the login link
      registerLink.style.display = "none"; // Hide the register link
      var username = sessionStorage.getItem("username"); // Assuming you store the username in session storage
      loggedInUsernameElement.textContent = "Welcome back!"; // Display the welcome message with the username
      loggedInUsernameElement.style.display = "block"; // Show the logged-in username
    } else {
      loginLink.style.display = "block"; // Show the login link
      registerLink.style.display = "block"; // Show the register link
      loggedInUsernameElement.style.display = "none"; // Hide the logged-in username
    }
  }
  
  // Call the updateNavbar function on page load
  window.addEventListener("load", updateNavbar);