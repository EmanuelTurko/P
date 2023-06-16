function validateForm() {
    var usernameInput = document.getElementById("username");
    var passwordInput = document.getElementById("password");
  
    // Perform client-side form validation
    if (!usernameInput.value.match(/^[a-zA-Z]+$/)) {
      usernameInput.classList.add("invalid");
      document.getElementById("usernameError").textContent = "Username must include only letters";
      return false;
    } else {
      usernameInput.classList.remove("invalid");
      document.getElementById("usernameError").textContent = "";
    }
  
    if (passwordInput.value.length < 6) {
      passwordInput.classList.add("invalid");
      document.getElementById("passwordError").textContent = "Password must be at least 6 characters long";
      return false;
    } else {
      passwordInput.classList.remove("invalid");
      document.getElementById("passwordError").textContent = "";
    }
  
    // Create an object with the login data
    var loginData = {
      username: usernameInput.value,
      password: passwordInput.value
    };
  
    // Send the login data to the server
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "login.html", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // Login successful, display the logged-in content
          document.getElementById("loggedInContent").style.display = "block";
          
          // Store the logged-in username in session storage
          sessionStorage.setItem("username", usernameInput.value);
          
          // Retrieve the username from session storage
          var username = sessionStorage.getItem("username");
          
          // Display the welcome message with the username
          var loggedInUsernameElement = document.getElementById("loggedInUsername");
          loggedInUsernameElement.textContent = "Welcome back, " + username;
          loggedInUsernameElement.style.display = "block";
  
          // Additional actions or content for logged-in users
        } else if (xhr.status === 401) {
          // Invalid credentials, display an error message
          alert("Invalid username or password");
        } else {
          // Other error occurred, handle it appropriately
          alert("Error: " + xhr.statusText);
        }
      }
    };
    xhr.send(JSON.stringify(loginData));
  
    return false; // Prevent the form from submitting
  }
  
  // Attach the event listener to the login form
  var loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", validateForm);
  