// Function to toggle the visibility of the search form
function toggleSearchForm() {
    const searchForm = document.getElementById('searchForm');
    searchForm.hidden = !searchForm.hidden;
  }
  
  function toggleSearchForm() {
    var searchFormContainer = document.getElementById("searchFormContainer");
    searchFormContainer.style.display = (searchFormContainer.style.display === "none") ? "block" : "none";
  }
  
  function performSearch() {
    var searchInput = document.getElementById("searchInput").value;
    var priceUnder25Checked = document.getElementById("priceUnder25Checkbox").checked;
    var freeShippingChecked = document.getElementById("freeShippingCheckbox").checked;
    var inStockChecked = document.getElementById("inStockCheckbox").checked;
  
    // Retrieve the items from the server
    fetch('/items')
      .then(response => response.json())
      .then(items => {
        // Filter the items based on the search input and checkbox values
        var filteredItems = items.filter(item => {
          // Check if the item name contains the search input
          var itemName = item.name.toLowerCase();
          var searchQuery = searchInput.toLowerCase();
          if (itemName.includes(searchQuery) === false) {
            return false;
          }
  
          // Check the price under $25 checkbox
          if (priceUnder25Checked && item.price >= 25) {
            return false;
          }
  
          // Check the free shipping checkbox
          if (freeShippingChecked && item.shipping !== "free") {
            return false;
          }
  
          // Check the in stock checkbox
          if (inStockChecked && item.stock === 0) {
            return false;
          }
  
          return true;
        });
  
        // Display the filtered items in the search results
        displaySearchResults(filteredItems);
      })
      .catch(error => {
        console.error('Error fetching items:', error);
      });
  
    document.getElementById("searchInput").value = "";
    document.getElementById("priceUnder25Checkbox").checked = false;
    document.getElementById("freeShippingCheckbox").checked = false;
    document.getElementById("inStockCheckbox").checked = false;
  
  }
  
  function displaySearchResults(items) {
    var searchResultsContainer = document.getElementById("searchResults");
    searchResultsContainer.innerHTML = "";
  
    if (items.length === 0) {
      searchResultsContainer.innerHTML = "No results found.";
      return;
    }
  
    var itemList = document.createElement("ul");
  
    items.forEach(item => {
      var listItem = document.createElement("li");
      listItem.textContent = item.name + " - Price: $" + item.price;
  
      var addToCartButton = document.createElement("button");
      addToCartButton.textContent = "Add to Cart";
      addToCartButton.setAttribute("onclick", "addToCart('" + item.itemId + "')");
  
      listItem.appendChild(addToCartButton);
      itemList.appendChild(listItem);
    });
  
    searchResultsContainer.appendChild(itemList);
  }