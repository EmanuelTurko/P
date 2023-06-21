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

  fetch('/api/login-status')
    .then((response) => response.json())
    .then((data) => {
      if (data.isLoggedIn) {
        loginLink.style.display = 'none';
        logoutLink.style.display = '';

        // Retrieve the username from the cookie
        const username = getCookie('username');
        if (username) {
          usernameLabel.textContent = 'Welcome back, ' + username + '!';
        } else {
          usernameLabel.textContent = '';
        }
      } else {
        loginLink.style.display = '';
        logoutLink.style.display = 'none';
        usernameLabel.textContent = '';
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
