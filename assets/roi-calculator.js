// Wait for both DOM and Chart.js to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Check if Chart.js is loaded
  if (typeof Chart === 'undefined') {
    // If Chart.js isn't loaded yet, wait for it
    const checkChart = setInterval(() => {
      if (typeof Chart !== 'undefined') {
        clearInterval(checkChart);
        initializeCalculator();
      }
    }, 100);
  } else {
    // If Chart.js is already loaded, initialize immediately
    initializeCalculator();
  }
});

function initializeCalculator() {
  // Initialize the main sales graph
  const graphContainer = document.querySelector('.graph-container');
  if (!graphContainer) return;

  const canvas = document.createElement('canvas');
  graphContainer.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Current Sales',
        data: [1800000, 1900000, 1750000, 2100000, 2300000, 2200000, 2400000, 2350000, 2200000, 2150000, 2050000, 2000000],
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Projected Sales',
        data: [1700000, 1800000, 1650000, 1900000, 2000000, 1950000, 2100000, 2050000, 1900000, 1850000, 1800000, 1750000],
        borderColor: '#9CA3AF',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        fill: true,
        tension: 0.4,
        borderDash: [5, 5]
      }
    ]
  };

  new Chart(ctx, {
    type: 'line',
    data: salesData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              return '$' + (value / 1000000).toFixed(1) + 'M';
            }
          }
        }
      }
    }
  });

  // Initialize mini stat graphs
  const miniGraphs = document.querySelectorAll('.stat-graph');
  miniGraphs.forEach(container => {
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const data = {
      labels: ['', '', '', '', '', ''],
      datasets: [{
        data: [65, 75, 70, 80, 85, 80],
        borderColor: '#34D399',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4
      }]
    };

    new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            display: false
          },
          y: {
            display: false
          }
        }
      }
    });
  });

  // Initialize range sliders
  const sliders = document.querySelectorAll('.metric-slider');
  sliders.forEach(slider => {
    slider.addEventListener('input', updateCalculations);
  });

  // Initialize calculate button
  const calculateBtn = document.querySelector('.calculate-btn');
  if (calculateBtn) {
    calculateBtn.addEventListener('click', updateCalculations);
  }
}

function updateCalculations() {
  // Add your calculation logic here
  console.log('Updating calculations...');
} 