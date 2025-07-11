let swotChart, financialChart;

function renderSwotChart(data) {
  const ctx = document.getElementById('swotChart').getContext('2d');
  
  if (swotChart) swotChart.destroy();

  swotChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.swotCategories || ['Strengths', 'Weaknesses', 'Opportunities', 'Threats'],
      datasets: [{
        label: 'SWOT Analysis',
        data: data.swotData || [5, 3, 4, 2],
        backgroundColor: data.swotColors || [
          'rgba(76, 175, 80, 0.7)',
          'rgba(244, 67, 54, 0.7)',
          'rgba(33, 150, 243, 0.7)',
          'rgba(255, 152, 0, 0.7)'
        ],
        borderColor: data.swotColors || [
          'rgba(76, 175, 80, 1)',
          'rgba(244, 67, 54, 1)',
          'rgba(33, 150, 243, 1)',
          'rgba(255, 152, 0, 1)'
        ],
        borderWidth: 1,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 14, 23, 0.9)',
          titleColor: '#ffffff',
          bodyColor: '#e0e0e0',
          borderColor: 'rgba(110, 69, 226, 0.5)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: function(context) {
              return `${context.parsed.y} key factors`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: { color: 'rgba(255, 255, 255, 0.7)' }
        },
        x: {
          grid: { display: false },
          ticks: { color: 'rgba(255, 255, 255, 0.7)' }
        }
      }
    }
  });
}

function renderFinancialChart(data) {
  const ctx = document.getElementById('financialChart').getContext('2d');
  
  if (financialChart) financialChart.destroy();

  financialChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.months || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Revenue',
          data: data.revenueData || Array(12).fill(0).map((_, i) => 5000 + i * 1000),
          borderColor: 'rgba(76, 175, 80, 1)',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          tension: 0.3,
          fill: true,
          borderWidth: 2
        },
        {
          label: 'Expenses',
          data: data.expenseData || Array(12).fill(0).map((_, i) => 3000 + i * 800),
          borderColor: 'rgba(244, 67, 54, 1)',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          tension: 0.3,
          fill: true,
          borderWidth: 2
        },
        {
          label: 'Profit',
          data: data.profitData || Array(12).fill(0).map((_, i) => 2000 + i * 200),
          borderColor: 'rgba(33, 150, 243, 1)',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          tension: 0.3,
          fill: true,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: 'rgba(255, 255, 255, 0.7)' }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 14, 23, 0.9)',
          titleColor: '#ffffff',
          bodyColor: '#e0e0e0',
          borderColor: 'rgba(110, 69, 226, 0.5)',
          borderWidth: 1,
          padding: 12
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: { color: 'rgba(255, 255, 255, 0.7)' }
        },
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.1)' },
          ticks: { color: 'rgba(255, 255, 255, 0.7)' }
        }
      }
    }
  });

  // Highlight break-even point if available
  if (data.breakEvenIndex !== undefined) {
    const breakEvenMonth = data.months[data.breakEvenIndex];
    const breakEvenValue = data.profitData[data.breakEvenIndex];
    
    financialChart.data.datasets.push({
      label: 'Break-even Point',
      data: Array(data.months.length).fill(null).map((_, i) => 
        i === data.breakEvenIndex ? breakEvenValue : null),
      borderColor: 'rgba(178, 0, 255, 1)',
      backgroundColor: 'rgba(178, 0, 255, 0.7)',
      pointBackgroundColor: 'rgba(178, 0, 255, 1)',
      pointRadius: 6,
      pointHoverRadius: 8,
      showLine: false
    });
    
    financialChart.update();
  }
}