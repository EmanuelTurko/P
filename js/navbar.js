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
  const adminLink = document.getElementById('adminLink');

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

      // Check if the user has admin privileges
      console.log('User role:', data.role); // Access the property as "role"
      if (data.role === 'Admin') {
        adminLink.style.display = ''; // Show the "Admin" link
      } else {
        adminLink.style.display = 'none'; // Hide the "Admin" link
      }
    } else {
      loginLink.style.display = '';
      logoutLink.style.display = 'none';
      myDetailsLink.style.display = 'none'; // Hide the "My Details" link
      adminLink.style.display = 'none'; // Hide the "Admin" link
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


fetch('/suppliers/locations')
  .then(response => response.json())
  .then(locations => {
    // Assuming the locations array contains a single location object
    const location = locations[0];

    // Get the iframe element
    const iframe = document.getElementById('map-iframe');

    // Update the iframe source with the fetched location
    const locationUrl = `https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=${encodeURIComponent(location)}&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed`;
    iframe.src = locationUrl;
  })
  .catch(error => {
    console.error('Error fetching suppliers\' locations:', error);
  });
