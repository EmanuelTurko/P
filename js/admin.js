document.addEventListener('DOMContentLoaded', initializeCart);

function initializeCart() {

  // Function to fetch all items from the server
  function fetchItems() {
    fetch('/items')
      .then(response => response.json())
      .then(items => {
        // Render the items on the page
        renderItems(items);
      })
      .catch(error => {
        console.error('Error fetching items:', error);
      });
  }

  // Function to render the items on the page
  function renderItems(items) {
    const itemsContainer = document.getElementById('itemsContainer');

    // Clear the container
    removeAllChildNodes(itemsContainer);
    // Iterate over the items and create elements for each item
    items.forEach(item => {
      const itemElement = createItemElement(item);
      itemsContainer.appendChild(itemElement);
    });
  }

  // Function to create an item element
  function createItemElement(item) {
    const itemElement = document.createElement('div');
    itemElement.classList.add('item');
    itemElement.classList.add('inline-item'); // Add class for inline display

    const itemName = document.createElement('h3');
    itemName.textContent = item.name;
    itemElement.appendChild(itemName);

    const itemPrice = document.createElement('p');
    itemPrice.textContent = `Price: $${item.price}`;
    itemElement.appendChild(itemPrice);

    const itemStock = document.createElement('p');
    itemStock.textContent = `Stock: ${item.stock}`;
    itemElement.appendChild(itemStock);

    // Add a button to remove the item from the inline display
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      removeItem(item.itemId);
    });
    itemElement.appendChild(removeButton);

    // Add a button to update the item
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.addEventListener('click', () => {
      updateItem(item.itemId);
    });
    itemElement.appendChild(updateButton);

    return itemElement;
  }

  // Function to remove all child nodes from an element
  function removeAllChildNodes(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  // Call fetchItems initially when the page loads
  fetchItems();
}


function removeItem(itemId) {
    // Send an HTTP DELETE request to the API endpoint
    fetch(`/items/${itemId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          console.log('Item removed successfully');
        } else {
          console.error('Failed to remove item:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error removing item:', error);
      });
  }
  
  // Attach an event listener to the remove button
  const removeButton = document.getElementById('removeButton'); // Replace 'removeButton' with the actual ID of your button
  removeButton.addEventListener('click', () => {
    const itemId = 'your_item_id'; // Replace 'your_item_id' with the actual ID or unique identifier of the item
    removeItem(itemId);
  });
  