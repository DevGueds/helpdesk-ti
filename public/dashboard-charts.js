// Dashboard Charts Initialization
// This file initializes all Chart.js charts on the reports page
// Data is read from data attributes to comply with CSP

document.addEventListener('DOMContentLoaded', function() {
  // Get chart data from data attributes
  const chartDataEl = document.getElementById('chartData');
  if (!chartDataEl) return;
  
  const usfData = JSON.parse(chartDataEl.getAttribute('data-usf') || '[]');
  const trendData = JSON.parse(chartDataEl.getAttribute('data-trend') || '[]');
  
  // Initialize USF Bar Chart (Horizontal)
  const barChartCanvas = document.getElementById('myBarChart');
  if (barChartCanvas && usfData.length > 0) {
    const ctx = barChartCanvas.getContext('2d');
    const labels = usfData.map(d => d.usfName);
    const data = usfData.map(d => d.count);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Chamados',
          data: data,
          backgroundColor: '#4e73df',
          hoverBackgroundColor: '#2e59d9',
          borderColor: '#4e73df',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y', // Horizontal bars
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            grid: {
               borderDash: [2, 2]
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  // Initialize Trend Line Chart
  const trendChartCanvas = document.getElementById('trendChart');
  if (trendChartCanvas && trendData.length > 0) {
    const trendCtx = trendChartCanvas.getContext('2d');
    
    const trendLabels = trendData.map(d => {
      const date = new Date(d.dia);
      return date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
    });
    
    new Chart(trendCtx, {
      type: 'line',
      data: {
        labels: trendLabels,
        datasets: [
          {
            label: 'Total',
            data: trendData.map(d => d.total_chamados),
            borderColor: '#4e73df',
            backgroundColor: 'rgba(78, 115, 223, 0.1)',
            tension: 0.3,
            fill: true
          },
          {
            label: 'Urgentes',
            data: trendData.map(d => d.urgentes),
            borderColor: '#e74a3b',
            backgroundColor: 'rgba(231, 74, 59, 0.1)',
            tension: 0.3,
            fill: true
          },
          {
            label: 'Resolvidos',
            data: trendData.map(d => d.resolvidos),
            borderColor: '#1cc88a',
            backgroundColor: 'rgba(28, 200, 138, 0.1)',
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        }
      }
    });
  }

  // Period Filter Handler
  const periodFilter = document.getElementById('periodFilter');
  if (periodFilter) {
    periodFilter.addEventListener('change', function() {
      const period = this.value;
      window.location.href = `/reports?period=${period}`;
    });
  }
});
