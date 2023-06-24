function pageLoaded() {
  const navbar = document.getElementById('navbar');
  navbar.removeAttribute('hidden');
  console.log('navbar removed');
  updateNavbar();
}


function updateNavbar() {
  const loginLink = document.getElementById('login');
  const logoutLink = document.getElementById('logout');
  const usernameLabel = document.getElementById('username');
  const myDetailsLink = document.getElementById('my-details');

  // Display the login error message
  const urlParams = new URLSearchParams(window.location.search);
  const errorMessage = urlParams.get('errorMessage');
  if (errorMessage) {
    const errorMessageElement = document.getElementById('login-message');
    errorMessageElement.textContent = errorMessage;
  }

// Send an HTTP request to the server to retrieve user details
fetch('/userDetails')
  .then(response => response.json())
  .then(data => {
    // Handle the response from the server
    console.log(data); // Assuming the server responds with an object containing user details
    // Update the HTML elements with the received user details
    document.getElementById('username').textContent = "Username: " + data.username;
    document.getElementById('fullName').textContent = "Full Name: " + data.fullName;
    document.getElementById('city').textContent = "City: " + data.city;
  });


  
  fetch('/api/login-status')
    .then((response) => response.json())
    .then((data) => {
      if (data.isLoggedIn) {
        usernameLabel.textContent = 'Welcome, ' + data.username;
        loginLink.style.display = 'none';
        logoutLink.style.display = '';
        myDetailsLink.style.display = ''; // Show the "My Details" link

      } else {
        loginLink.style.display = '';
        logoutLink.style.display = 'none';
        myDetailsLink.style.display = 'none'; // Hide the "My Details" link
        usernameLabel.textContent = '';
        document.getElementById('userDetails').textContent = '';
      }
    })
    .catch((error) => {
      console.error('Error fetching login status:', error);
    });
}

function getCookie(name) {
  const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return cookieValue ? cookieValue.pop() : '';
}

window.addEventListener('DOMContentLoaded', updateNavbar);
