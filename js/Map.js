// Wait for the DOM content to load
document.addEventListener('DOMContentLoaded', () => {
    // Get the iframe element
    const iframe = document.getElementById('map-iframe');
  
// Fetch suppliers' locations
fetch('/suppliers/locations')
  .then(response => response.json())
  .then(locations => {
    // Assuming the locations array contains a single location object
    const location = locations[0].location; // Assuming the location property holds the URL

    // Get the iframe element
    const iframe = document.getElementById('map-iframe');

    // Encode the location URL
    const encodedLocationUrl = encodeURIComponent(location);

    // Update the iframe source with the encoded location URL
    const iframeSrc = `https://www.google.com/maps/embed?pb=${encodedLocationUrl}`;
    iframe.src = iframeSrc;
  })
  .catch(error => {
    console.error('Error fetching suppliers\' locations:', error);
  });
  });