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

  fetch('/api/login-status')
    .then((response) => response.json())
    .then((data) => {
      if (data.isLoggedIn) {
        loginLink.style.display = 'none';
        logoutLink.style.display = '';
        myDetailsLink.style.display = ''; // Show the "My Details" link
        usernameLabel.textContent = 'Welcome, ' + data.username;
        document.getElementById('userDetails').textContent ='Username: ' + data.username + '\n' +
          'Full Name: ' + data.fullName + '\n' +
          'City: ' + data.city;
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
