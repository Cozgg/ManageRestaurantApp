# ManageRestaurantApp

# Hệ Thống Quản Lý Nhà Hàng Trực Tuyến

Dự án phần mềm hỗ trợ đặt bàn, quản lý thực đơn và trải nghiệm dịch vụ nhà hàng trực tuyến với 3 phân quyền: Khách hàng, Đầu bếp và Quản trị viên.

## 🚀 Công Nghệ Sử Dụng
* **Backend:** Java Spring
* **Frontend:** ReactJs
* **Database:** MySQL
* **Thanh toán:** MoMo, ZaloPay, Tiền mặt

## ✨ Tính Năng Nổi Bật

### 👨‍💼 Quản Trị Viên (Admin)
* Quản lý danh mục, sơ đồ bàn (`Table`) và người dùng.
* Phê duyệt tài khoản Đầu bếp.
* Xem báo cáo thống kê doanh thu, tần suất đặt bàn.

### 🧑‍🍳 Đầu Bếp (Chef)
* Quản lý thực đơn (Tạo, sửa, xóa món ăn, nguyên liệu, thời gian chuẩn bị).
* Cập nhật trạng thái đơn hàng (`Order`).
* Theo dõi đánh giá món ăn từ khách hàng.

### 👤 Khách Hàng (User)
* Đăng ký, đăng nhập và quản lý hồ sơ.
* Xem thực đơn, tìm kiếm và lọc món ăn.
* Đặt bàn theo số bàn (`Reservation`) và gọi món (`Order`).
* Thanh toán trực tuyến và đánh giá (`Rating`).

## 🛠️ Cài Đặt Dịch Vụ

1. **Clone dự án:**
   ` ` `bash
   git clone [[URL_REPO_CỦA_BẠN](https://github.com/canhhuynh220805/ManageRestaurantApp.git)]
   cd [RestaurantApp]
   ` ` `
2. **Thiết lập Cơ sở dữ liệu:**
   * Tạo database trên MySQL.
   * Import file script SQL chứa cấu trúc các bảng.
3. **Cấu hình môi trường (.env):**
   * Thông tin kết nối Database.
   * Cấu hình API Key/Secret Key cho cổng thanh toán.
4. **Khởi chạy ứng dụng:**
   ` ` `bash
   npm install
   npm start
   ` ` `

## 🔗 Các Nhóm API Chính
* `/api/users`: Xác thực, profile, phê duyệt đầu bếp.
* `/api/categories`: Quản lý danh mục món.
* `/api/dishes`: Quản lý và tìm kiếm món ăn.
* `/api/tables`: Quản lý danh sách bàn.
* `/api/reservations`: Đặt bàn.
* `/api/orders`: Quản lý gọi món và thanh toán.
* `/api/ratings`: Chức năng đánh giá.
