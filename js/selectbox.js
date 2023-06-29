// Function to show the corresponding form based on the selected option
function showForm() {
    const selectOption = document.getElementById('selectOption');
    const searchForm = document.getElementById('searchForm');
  
    // Clear the form
    searchForm.innerHTML = '';
  
    // Get the selected option value
    const option = selectOption.value;
  
    if (option === 'name') {
      const usernameInput = document.createElement('input');
      usernameInput.type = 'text';
      usernameInput.placeholder = 'Enter username or name';
  
      const submitButton = document.createElement('button');
      submitButton.textContent = 'Search';
  
      searchForm.appendChild(usernameInput);
      searchForm.appendChild(submitButton);
    } else if (option === 'city') {
      const citySelect = document.createElement('select');
      // Add city options dynamically here
  
      const submitButton = document.createElement('button');
      submitButton.textContent = 'Search';
  
      searchForm.appendChild(citySelect);
      searchForm.appendChild(submitButton);
    } else if (option === 'orders') {
      const ordersSelect = document.createElement('select');
  
      const allOption = document.createElement('option');
      allOption.value = '';
      allOption.textContent = 'All';
      ordersSelect.appendChild(allOption);
  
      const ordersMadeOption = document.createElement('option');
      ordersMadeOption.value = 'made';
      ordersMadeOption.textContent = 'Orders Made';
      ordersSelect.appendChild(ordersMadeOption);
  
      const ordersNotMadeOption = document.createElement('option');
      ordersNotMadeOption.value = 'notMade';
      ordersNotMadeOption.textContent = 'Orders Not Made';
      ordersSelect.appendChild(ordersNotMadeOption);
  
      const submitButton = document.createElement('button');
      submitButton.textContent = 'Search';
  
      searchForm.appendChild(ordersSelect);
      searchForm.appendChild(submitButton);
    }
  
    // Show the form
    searchForm.style.display = 'block';
  }
  
  // Function to toggle the visibility of the users table
  function toggleUsersTable() {
    const usersTableContainer = document.getElementById('usersTableContainer');
    const toggleUsersButton = document.getElementById('toggleUsersButton');
  
    if (usersTableContainer.style.display === 'none') {
      // Fetch and render the users' data
      fetchUsers();
  
      usersTableContainer.style.display = '';
      toggleUsersButton.textContent = 'Hide Users';
    } else {
      usersTableContainer.style.display = 'none';
      toggleUsersButton.textContent = 'Show Users';
    }
  }
  
  function fetchUsers() {
    fetch('/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        return response.json();
      })
      .then(users => {
        console.log('Fetched users:', users);
        renderUsers(users);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        // Display an error message on the page
        const errorContainer = document.getElementById('errorContainer');
        errorContainer.textContent = 'Failed to fetch users. Please try again later.';
      });
  }
  
  // Function to render the users' data in the table
  function renderUsers(users) {
    const usersTable = document.getElementById('usersTable');
  
    // Clear the table body
    usersTable.innerHTML = '';
  
    // Create table rows for each user
    users.forEach(user => {
      const tableRow = document.createElement('tr');
  
      // Create table cells for each user property
      const usernameCell = document.createElement('td');
      usernameCell.textContent = user.name;
      tableRow.appendChild(usernameCell);
  
      const fullNameCell = document.createElement('td');
      fullNameCell.textContent = user.fullName;
      tableRow.appendChild(fullNameCell);
  
      const cityCell = document.createElement('td');
      cityCell.textContent = user.city;
      tableRow.appendChild(cityCell);
  
      const ordersCell = document.createElement('td');
      ordersCell.textContent = user.orders || 0; // If 'orders' is undefined, set it to 0
      tableRow.appendChild(ordersCell);
  
      const roleCell = document.createElement('td');
      roleCell.textContent = user.role || 'User'; // If 'role' is undefined, set it to 'User'
      tableRow.appendChild(roleCell);
  
      // Add the row to the table
      usersTable.appendChild(tableRow);
    });
  }
  