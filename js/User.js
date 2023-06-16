function validateForm(event) {
    event.preventDefault(); // Prevent the form from submitting
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

   // Send the login data to the server using the Fetch API
   fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(loginData)
  })
    .then(function(response) {
      if (response.ok) {
        // Login successful
        window.location.href = "/index.html";
      } else {
        // Login failed
        return response.text().then(function(error) {
          throw new Error(error);
        });
      }
    })
    .catch(function(error) {
      alert("Login failed: " + error.message);
    });
}

// Attach the event listener to the login form
var loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", validateForm);