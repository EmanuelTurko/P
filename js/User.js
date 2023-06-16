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
  
    // Create an object with the registration data
    var registrationData = {
      username: usernameInput.value,
      password: passwordInput.value
    };
  
    // Send the registration data to the server
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/register", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          // Registration successful
          console.log("User registered successfully");
          // Redirect the user to index.html after successful registration
          window.location.href = '/index.html';
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
          // Registration failed
          console.error("Error registering user");
          // You can display an error message to the user or perform any other action here
        }
      };
    xhr.send(JSON.stringify(registrationData));
  
    return false; // Prevent the form from submitting
  }
  function hideLinksOnRegistration() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
      const loginLink = document.querySelector('a[href="login.html"]');
      const registerLink = document.querySelector('a[href="register.html"]');
      loginLink.style.display = 'none';
      registerLink.style.display = 'none';
    }
  }
  
  // Call the function to hide links on registration
  hideLinksOnRegistration();