function updateNavbar() {
    const loginLink = document.getElementById('login');
    const logoutLink = document.getElementById('logout');
  
    fetch('/api/login-status')
      .then((response) => response.json())
      .then((data) => {
        if (data.isLoggedIn) {
          loginLink.style.display = 'none';
          logoutLink.style.display = '';
        } else {
          loginLink.style.display = '';
          logoutLink.style.display = 'none';
        }
      })
      .catch((error) => {
        console.error('Error fetching login status:', error);
      });
  }
  
  window.addEventListener('DOMContentLoaded', updateNavbar);