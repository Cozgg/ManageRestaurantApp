let myChartInstance = null;
function loadChart(time, year) {
    fetch(`http://localhost:8080/RestaurantApp/api/stat-revenue?time=${time}&year=${year}`)
            .then(response => response.json())
            .then(data => {
                let labels = [];
                let revenues = [];

                data.forEach(item => {
                    let prefix = time === 'MONTH' ? 'Tháng ' : (time === 'QUARTER' ? 'Quý ' : 'Năm ');
                    labels.push(prefix + item[0]);
                    revenues.push(item[1]);
                });

                const ctx = document.getElementById('myChart');
                if (myChartInstance != null) {
                    myChartInstance.destroy();
                }
                myChartInstance = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                                label: 'Doanh thu (VNĐ)',
                                data: revenues,
                                backgroundColor: 'rgba(230, 126, 34, 0.7)',
                                borderColor: 'rgba(230, 126, 34, 1)',
                                borderWidth: 1,
                                borderRadius: 4
                            }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {beginAtZero: true}
                        }
                    }
                });
            })
            .catch(error => console.error('Lỗi tải dữ liệu thống kê:', error));

}
document.addEventListener("DOMContentLoaded", function () {
    loadChart('MONTH', 2026);
});

document.getElementById('statForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const selectedTime = document.getElementById('timeFilter').value;
    const selectedYear = document.getElementById('yearFilter').value;
    loadChart(selectedTime, selectedYear);
});
