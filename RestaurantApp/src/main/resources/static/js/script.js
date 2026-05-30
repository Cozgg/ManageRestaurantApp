let myChartInstance = null;

function renderChart(ctx, type, labels, data, labelTitle, bgColor, borderColor) {
    if (myChartInstance != null) {
        myChartInstance.destroy();
    }
    myChartInstance = new Chart(ctx, {
        type: type,
        data: {
            labels: labels,
            datasets: [{
                label: labelTitle,
                data: data,
                backgroundColor: bgColor,
                borderColor: borderColor,
                borderWidth: 1,
                borderRadius: type === 'bar' ? 4 : 0,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                }
            }
        }
    });
}

function loadChartData() {
    const time = document.getElementById('timeFilter').value;
    const year = document.getElementById('yearFilter').value;
    const statType = document.querySelector('input[name="statType"]:checked').value;
    const ctx = document.getElementById('myChart');

    let url = '';
    const headers = {
        'Content-Type': 'application/json'
        // 'Authorization': 'Bearer ' + localStorage.getItem('token') // Bỏ comment dòng này nếu dùng JWT
    };

    if (statType === 'REVENUE') {
        url = `http://localhost:8080/RestaurantApp/api/statistics/stat-revenue?time=${time}&year=${year}`;
    } else if (statType === 'DISHES') {
        url = `http://localhost:8080/RestaurantApp/api/statistics/dishes?top=5`;
    } else if (statType === 'RESERVATIONS') {
        url = `http://localhost:8080/RestaurantApp/api/statistics/reservations?time=${time}&year=${year}`;
    }

    fetch(url, { headers: headers })
        .then(response => {
            if (!response.ok) throw new Error('Không có quyền truy cập hoặc lỗi server');
            return response.json();
        })
        .then(data => {
            let labels = [];
            let values = [];

            data.forEach(item => {
                if (statType === 'DISHES') {
                    labels.push(item[1]);
                } else {
                    let prefix = time === 'MONTH' ? 'Tháng ' : (time === 'QUARTER' ? 'Quý ' : 'Năm ');
                    labels.push(prefix + item[0]);
                }
                values.push(item[statType === 'DISHES' ? 2 : 1]);
            });

            if (statType === 'REVENUE') {
                renderChart(ctx, 'bar', labels, values, 'Doanh thu (VNĐ)', 'rgba(230, 126, 34, 0.7)', 'rgba(230, 126, 34, 1)');
            } else if (statType === 'DISHES') {
                const pieColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
                renderChart(ctx, 'pie', labels, values, 'Số lượng bán', pieColors, '#ffffff');
            } else if (statType === 'RESERVATIONS') {
                renderChart(ctx, 'line', labels, values, 'Lượt đặt bàn', 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)');
            }
        })
        .catch(error => {
            console.error('Lỗi:', error);
            alert("Lỗi khi tải dữ liệu thống kê!");
        });
}

function approveUser(userId) {
    if (confirm('Bạn có chắc muốn duyệt tài khoản Đầu bếp này?')) {
        fetch(`http://localhost:8080/RestaurantApp/admin/users/${userId}/approve`, {
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


document.addEventListener("DOMContentLoaded", function () {
    loadChartData();

    document.getElementById('statForm').addEventListener('submit', function (event) {
        event.preventDefault();
        loadChartData();
    });

    // Lắng nghe sự kiện click đổi Radio Button để vẽ lại ngay lập tức
    const radioButtons = document.querySelectorAll('input[name="statType"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function () {
            // Thay đổi Tiêu đề thẻ H5 cho phù hợp
            const titleH5 = document.querySelector('.card-header h5');
            if (this.value === 'REVENUE') titleH5.innerHTML = "Thống kê doanh thu";
            if (this.value === 'DISHES') titleH5.innerHTML = "Thống kê món ăn bán chạy";
            if (this.value === 'RESERVATIONS') titleH5.innerHTML = "Thống kê đặt bàn";

            loadChartData();
        });
    });
});

