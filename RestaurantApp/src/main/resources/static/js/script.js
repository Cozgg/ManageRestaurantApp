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
    const chart = document.getElementById('myChart');

    if (chart) {
        loadChart('MONTH', 2026);
    }
});

const statForm = document.getElementById('statForm');

if (statForm) {
    statForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const selectedTime = document.getElementById('timeFilter').value;
        const selectedYear = document.getElementById('yearFilter').value;

        loadChart(selectedTime, selectedYear);
    });
}

function approveUser(userId) {
    if (confirm('Bạn có chắc muốn duyệt tài khoản Đầu bếp này?')) {
        fetch(`http://localhost:8080/RestaurantApp/api/users/${userId}/approve`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Đã duyệt tài khoản thành công!');
                location.reload();
            } else {
                alert('Lỗi khi duyệt tài khoản!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi kết nối server!');
        });
    }
}

function deleteUser(userId) {
    if (confirm('Bạn có chắc muốn xóa người dùng này?')) {
        fetch(`http://localhost:8080/RestaurantApp/admin/users/${userId}`, {
            method: 'DELETE',
            credentials: 'same-origin'
        })
        .then(response => {
            if (response.ok) {
                alert('Đã xóa người dùng thành công!');
                location.reload();
            } else {
                alert('Lỗi khi xóa người dùng!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi kết nối server!');
        });
    }
}

function confirmOrder(orderId) {
    if (confirm('Bạn có chắc muốn xóa người dùng này?')) {
        fetch(`http://localhost:8080/RestaurantApp/admin/orders/${orderId}/confirm`, {
            method: 'POST',
            credentials: 'same-origin'
        })
        .then(response => {
            if (response.ok) {
                alert('Đã xác nhận thành công!');
                location.reload();
            } else {
                alert('Lỗi khi xác nhận!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi kết nối server!');
        });
    }
}

