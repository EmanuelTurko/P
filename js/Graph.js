// Fetch the most ordered items
fetch('/items/most-ordered')
  .then(response => response.json())
  .then(items => {
    // Process the data and generate the graph for most ordered items
    generateGraph(items);

    // Print the three most ordered items
    printMostOrderedItems(items);

    // Fetch the least ordered items
    fetch('/items/least-ordered')
      .then(response => response.json())
      .then(leastOrderedItems => {
        // Process the data and generate the graph for least ordered items
        generateLeastOrderedGraph(leastOrderedItems);

        // Print the three least ordered items
        printLeastOrderedItems(leastOrderedItems);
      })
      .catch(error => {
        console.error('Error fetching least ordered items:', error);
      });
  })
  .catch(error => {
    console.error('Error fetching most ordered items:', error);
  });

const chartOptions = {
  scales: {
    y: {
      beginAtZero: true,
      precision: 0,
      grid: {
        color: 'rgba(255, 255, 255, 0.6)', // Set the grid lines color to white
      },
      ticks: {
        color: 'white', // Set the color of the scale numbers to white
      },
    },
    x: {
      ticks: {
        color: 'white', // Set the color of the scale numbers to white
      },
    },
  },
};

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
      datasets: [
        {
          label: 'Most Ordered Items',
          data: orderedCounts,
          backgroundColor: '#ad8fb9',
          borderWidth: 2,
        },
      ],
    },
    options: chartOptions,
  });
}

function generateLeastOrderedGraph(leastOrderedItems) {
  // Extract the necessary data from the least ordered items array
  const leastOrderedLabels = leastOrderedItems.map(item => item.name);
  const leastOrderedCounts = leastOrderedItems.map(item => item.Ordered);

  // Create a bar chart for least ordered items using Chart.js
  const leastOrderedCtx = document.getElementById('leastOrderedChart').getContext('2d');
  new Chart(leastOrderedCtx, {
    type: 'bar',
    data: {
      labels: leastOrderedLabels,
      datasets: [
        {
          label: 'Least Ordered Items',
          data: leastOrderedCounts,
          backgroundColor: '#f0b7a4',
          borderWidth: 2,
        },
      ],
    },
    options: chartOptions,
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

function printLeastOrderedItems(leastOrderedItems) {
  // Sort the least ordered items by the Ordered field in ascending order
  const sortedLeastOrderedItems = leastOrderedItems.sort((a, b) => a.Ordered - b.Ordered);

  // Get the top three least ordered items
  const topThreeLeastOrderedItems = sortedLeastOrderedItems.slice(0, 3);

  // Print the item names
  console.log('Top Three Least Ordered Items:');
  topThreeLeastOrderedItems.forEach(item => {
    console.log(item.name);
  });
}
