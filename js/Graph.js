fetch('/items/')
  .then(response => response.json())
  .then(items => {
    // Process the data and generate the graph
    generateGraph(items);

    // Print the three most ordered items
    printMostOrderedItems(items);
  })
  .catch(error => {
    console.error('Error fetching most ordered items:', error);
  });

function generateGraph(items) {
  // Extract the necessary data from the items array
  const labels = items.map(item => item.name);
  const orderedCounts = items.map(item => item.Ordered);

  // Create a bar chart using Chart.js
  const ctx = document.getElementById('chart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Most Ordered Items',
        data: orderedCounts,
        backgroundColor: '#ad8fb9',
        borderWidth: 2
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          precision: 0
        }
      }
    }
  });
}

function printMostOrderedItems(items) {
  // Sort the items by the Ordered field in descending order
  const sortedItems = items.sort((a, b) => b.Ordered - a.Ordered);

  // Get the top three most ordered items
  const topThreeItems = sortedItems.slice(0, 3);

  // Print the item names
  console.log('Top Three Most Ordered Items:');
  topThreeItems.forEach(item => {
    console.log(item.name);
  });
}