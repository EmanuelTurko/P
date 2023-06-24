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



// client.js

// Function to fetch user details and populate the input fields
async function populateProfile() {
  try {
    const response = await fetch('/api/login-status');
    const data = await response.json();

    if (response.ok && data.isLoggedIn) {
      document.getElementById('username').value = data.username;
      document.getElementById('fullName').value = data.fullName;
      document.getElementById('city').value = data.city;
    } else {
      console.error('Error fetching user details:', data.message);
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
}

// Function to handle form submission
async function updateProfile(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get the form input values
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const fullName = document.getElementById('fullName').value;
  const city = document.getElementById('city').value;

  // Send a POST request to the server with the updated profile data
  try {
    const response = await fetch('/update-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, fullName, city })
    });

    if (response.ok) {
      // Profile update successful
      window.location.href = '/index.html'; // Redirect to the desired page
    } else {
      const errorMessage = await response.text();
      console.error('Profile update failed:', errorMessage);
    }
  } catch (error) {
    console.error('Profile update failed:', error);
  }
}

// Add an event listener to the form submit button
document.getElementById('updateProfileForm').addEventListener('submit', updateProfile);

// Populate the profile fields on page load
populateProfile();
