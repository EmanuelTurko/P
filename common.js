function updateNavbar() {
    var loginLink = document.getElementById("loginLink");
    var registerLink = document.getElementById("registerLink");
    var loggedInUsernameElement = document.getElementById("loggedInUsername");
  
    if (isLoggedIn()) {
      loginLink.style.display = "none"; // Hide the login link
      registerLink.style.display = "none"; // Hide the register link
      loggedInUsernameElement.style.display = "block"; // Show the logged-in username element
  
      // Set the logged-in username in the navbar
      var username = sessionStorage.getItem("username"); // Assuming you store the username in session storage
      loggedInUsernameElement.textContent = "Welcome back, " + username; // Display the welcome message with the username
    } else {
      loginLink.style.display = "block"; // Show the login link
      registerLink.style.display = "block"; // Show the register link
      loggedInUsernameElement.style.display = "none"; // Hide the logged-in username element
    }
  }
  
  window.addEventListener("load", updateNavbar);