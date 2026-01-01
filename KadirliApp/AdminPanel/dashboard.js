let moduleUsageChart, topCampaignsChart, dailyInteractionsChart;

// Dashboard verilerini yükle
async function loadDashboard() {
    try {
        const data = await api.get('/Analytics/dashboard-stats');
        
        // Özet kartları güncelle
        document.getElementById('totalInteractions').textContent = data.totalInteractions.toLocaleString('tr-TR');
        document.getElementById('todayInteractions').textContent = data.todayInteractions.toLocaleString('tr-TR');
        document.getElementById('last7DaysInteractions').textContent = data.last7DaysInteractions.toLocaleString('tr-TR');
        
        // Grafikleri güncelle
        updateModuleUsageChart(data.moduleUsage);
        updateTopCampaignsChart(data.topCampaigns);
        updateDailyInteractionsChart(data.last7DaysStats);
        
    } catch (error) {
        console.error('Dashboard yüklenirken hata:', error);
        showNotification('Dashboard verileri yüklenemedi: ' + error.message, 'error');
    }
}

// Modül kullanım pasta grafiği
function updateModuleUsageChart(moduleUsage) {
    const ctx = document.getElementById('moduleUsageChart').getContext('2d');
    
    if (moduleUsageChart) {
        moduleUsageChart.destroy();
    }
    
    const colors = [
        'rgba(79, 70, 229, 0.8)',   // primary
        'rgba(236, 72, 153, 0.8)',  // pink
        'rgba(34, 197, 94, 0.8)',   // green
        'rgba(251, 146, 60, 0.8)',  // orange
        'rgba(59, 130, 246, 0.8)',  // blue
        'rgba(168, 85, 247, 0.8)',  // purple
        'rgba(239, 68, 68, 0.8)'    // red
    ];
    
    moduleUsageChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: moduleUsage.map(m => m.moduleName),
            datasets: [{
                data: moduleUsage.map(m => m.count),
                backgroundColor: colors.slice(0, moduleUsage.length),
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// En popüler kampanyalar bar grafiği
function updateTopCampaignsChart(topCampaigns) {
    const ctx = document.getElementById('topCampaignsChart').getContext('2d');
    
    if (topCampaignsChart) {
        topCampaignsChart.destroy();
    }
    
    if (topCampaigns.length === 0) {
        ctx.fillStyle = '#999';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Henüz kampanya verisi yok', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    
    topCampaignsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topCampaigns.map(c => c.campaignTitle.length > 20 
                ? c.campaignTitle.substring(0, 20) + '...' 
                : c.campaignTitle),
            datasets: [{
                label: 'Etkileşim Sayısı',
                data: topCampaigns.map(c => c.interactionCount),
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            const index = context[0].dataIndex;
                            return topCampaigns[index].campaignTitle;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Günlük etkileşim çizgi grafiği
function updateDailyInteractionsChart(dailyStats) {
    const ctx = document.getElementById('dailyInteractionsChart').getContext('2d');
    
    if (dailyInteractionsChart) {
        dailyInteractionsChart.destroy();
    }
    
    // Tarihleri formatla (gün/ay)
    const labels = dailyStats.map(stat => {
        const date = new Date(stat.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    });
    
    dailyInteractionsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Etkileşim Sayısı',
                data: dailyStats.map(stat => stat.count),
                borderColor: 'rgba(79, 70, 229, 1)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: 'rgba(79, 70, 229, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Sayfa yüklendiğinde dashboard'u yükle
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
});

