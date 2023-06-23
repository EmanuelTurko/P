// Function to add a new item to the gallery
function addNewItem(itemID, imageURL) {
    // Create a new item container
    console.log('Adding new item:', itemID);
    const newItemContainer = document.createElement('div');
    newItemContainer.classList.add('col-md-4');
  
    // Create the container for the image
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('container_main');
  
    // Create the image element
    const image = document.createElement('img');
    image.classList.add('image');
    image.setAttribute('id', itemID);
    image.setAttribute('data-item-id', itemID);
  
    // Set the image source to the provided imageURL or use a template avatar
    if (imageURL) {
      image.src = imageURL;
    } else {
      image.src = 'path/to/template-avatar.jpg';
    }
  
    // Create the overlay
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
  
    // Create the text within the overlay
    const text = document.createElement('div');
    text.classList.add('text');
  
    // Create the "Add to Cart" link
    const addToCartLink = document.createElement('a');
    addToCartLink.href = '#';
    addToCartLink.setAttribute('onclick', `addToCart('${itemID}')`);
  
    // Create the cart icon within the link
    const cartIcon = document.createElement('i');
    cartIcon.classList.add('fa', 'fa-cart-plus');
    cartIcon.setAttribute('aria-hidden', 'true');
  
    // Append the cart icon to the "Add to Cart" link
    addToCartLink.appendChild(cartIcon);
  
    // Append the "Add to Cart" link to the text
    text.appendChild(addToCartLink);
  
    // Append the text to the overlay
    overlay.appendChild(text);
  
    // Append the image and overlay to the image container
    imageContainer.appendChild(image);
    imageContainer.appendChild(overlay);
  
    // Create the item data container
    const itemDataContainer = document.createElement('div');
    itemDataContainer.classList.add('item-data');
  
    // Append the image container and item data container to the new item container
    newItemContainer.appendChild(imageContainer);
    newItemContainer.appendChild(itemDataContainer);
  
    // Find the gallery section to insert the new item
    const gallerySection = document.querySelector('.gallery_section_2 .row');
  
    // Insert the new item before the last item in the gallery section
    const lastItem = gallerySection.lastElementChild;
    gallerySection.insertBefore(newItemContainer, lastItem);
  }
  
  // Function to handle the "ADD" button click event
  function addItem() {
    // Get the item details from the input fields or any other source
    const itemID = document.getElementById('itemIDInput').value;
    const imageURL = document.getElementById('imageURLInput').value;
  
    // Call the addNewItem function with the item details
    addNewItem(itemID, imageURL);
  }
  
  // Attach the event listener to the "ADD" button when the page is loaded
  window.addEventListener('load', function () {
    const addButton = document.getElementById('addItemButton');
    addButton.addEventListener('click', addItem);
  });
  